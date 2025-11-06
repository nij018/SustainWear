const db = require("../config/db");
const { logAuditAction } = require("../helpers/auditLogger");

// UPDATE USER ROLE (Admin only)
const updateUser = (req, res) => {
  const { user_id, role, is_active } = req.body;
  const admin_id = req.user?.id;

  if (role !== "Donor" && role !== "Admin") { // only switch between admin and donor roles
    return res.status(400).json({ errMessage: "Invalid role. Only Donor or Admin are allowed." });
  }

  const query = `UPDATE USER SET role = ?, is_active = ? WHERE user_id = ?`;

  db.run(query, [role, is_active, user_id], function (err) {
    if (err) return res.status(500).json({ errMessage: "Database error", error: err.message });

    const action = `Updated user: role=${role}, active=${is_active}`;
    logAuditAction(admin_id, action, user_id); // add action to admin log

    res.status(200).json({ message: "User updated successfully" });
  });
};

// GET ALL USERS
const getAllUsers = (req, res) => {
  const query = `SELECT user_id, first_name, last_name, email, role, is_active FROM USER`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ errMessage: "Database error", error: err.message });
    res.status(200).json(rows);
  });
};

// ADD NEW ORGANISATION
const addOrganisation = (req, res) => {
  const { name, description, street_name, post_code, city, contact_email } = req.body;

  if (!name || !description || !street_name || !post_code || !city || !contact_email)
    return res.status(400).json({ errMessage: "All fields are required" });

  const query = `
    INSERT INTO ORGANISATION (name, description, street_name, post_code, city, contact_email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, description, street_name, post_code, city, contact_email],
    function (err) {
      if (err) return res.status(500).json({ errMessage: "Failed to add organisation", error: err.message });

      const action = "Organisation created";
      logAuditAction(admin_id, action, null, newOrgId); // add action to admin log

      res.status(201).json({ message: "Organisation added successfully", org_id: this.lastID });
    }
  );
};

// GET ALL ORGANISATIONS
const getAllOrganisations = (req, res) => {
  const query = `SELECT * FROM ORGANISATION ORDER BY created_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ errMessage: "Database error", error: err.message });
    res.status(200).json(rows);
  });
};

// UPDATE ORGANISATION STATUS
const updateOrganisationStatus = (req, res) => {
  const { org_id, is_active } = req.body;
  const admin_id = req.user?.id;

  if (typeof is_active === "undefined")
    return res.status(400).json({ errMessage: "Missing activation status" });

  const query = `UPDATE ORGANISATION SET is_active = ? WHERE org_id = ?`;

  db.run(query, [is_active ? 1 : 0, org_id], function (err) {
    if (err) return res.status(500).json({ errMessage: "Failed to update organisation", error: err.message });

    const action = is_active ? "Organisation activated" : "Organisation deactivated";
    logAuditAction(admin_id, action, null, org_id); // add action to admin log

    res.status(200).json({ message: "Organisation status updated successfully" });
  });
};


const deleteOrganisation = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM ORGANISATION WHERE org_id = ?`;
  const admin_id = req.user?.id;

  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ errMessage: "Failed to delete organisation", error: err.message });

    const action = "Organisation deleted";
    logAuditAction(admin_id, action, null, id); // add action to admin log

    res.status(200).json({ message: "Organisation deleted successfully" });
  });
};

const getAuditLogs = (req, res) => {
  const query = `
    SELECT 
      a.log_id,
      a.action,
      a.timestamp,

      -- Admin info
      u.first_name || ' ' || u.last_name AS admin_name,
      u.email AS admin_email,

      -- Target user info
      COALESCE(t.first_name || ' ' || t.last_name, '—') AS target_user_name,
      COALESCE(t.email, '—') AS target_user_email,

      -- Target organisation info
      COALESCE(o.name, '—') AS target_org_name,
      COALESCE(o.contact_email, '—') AS target_org_email

    FROM AUDIT_LOG a
    LEFT JOIN USER u ON a.admin_id = u.user_id
    LEFT JOIN USER t ON a.target_user_id = t.user_id
    LEFT JOIN ORGANISATION o ON a.target_org_id = o.org_id
    ORDER BY a.timestamp DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        errMessage: "Database error while fetching logs",
        error: err.message,
      });
    }

    res.status(200).json(rows);
  });
};

module.exports = {
  getAllUsers,
  updateUser,
  addOrganisation,
  getAllOrganisations,
  updateOrganisationStatus,
  deleteOrganisation,
  getAuditLogs,
};