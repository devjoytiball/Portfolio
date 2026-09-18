const bcrypt = require("bcrypt");
const db = require("../config/db");


// =============================
// ADMIN LOGIN
// =============================

exports.login = (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Username and password are required.");
    }

    const sql = "SELECT * FROM admins WHERE username = ?";

    db.query(sql, [username], async (err, results) => {

        if (err) {
            console.error("Admin Login Error:", err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) {
            return res.send("Invalid username or password");
        }

        const admin = results[0];

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        if (!match) {
            return res.send("Invalid username or password");
        }

        req.session.adminId = admin.id;
        req.session.adminUsername = admin.username;

        res.redirect("/admin/dashboard");
    });
};


// =============================
// ADMIN LOGOUT
// =============================

exports.logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).send("Logout error");
        }

        res.redirect("/admin/login");
    });
};


// =============================
// ADMIN DASHBOARD
// =============================

exports.dashboard = (req, res) => {

    const projectSql =
        "SELECT COUNT(*) AS total FROM projects";

    const certificateSql =
        "SELECT COUNT(*) AS total FROM certificates";

    const messageSql =
        "SELECT COUNT(*) AS total FROM messages";

    const resumeSql =
        "SELECT COUNT(*) AS total FROM resume";


    db.query(projectSql, (err, projectResult) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        db.query(certificateSql, (err, certificateResult) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            db.query(messageSql, (err, messageResult) => {

                if (err) {
                    console.error(err);
                    return res.status(500).send("Database error");
                }

                db.query(resumeSql, (err, resumeResult) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Database error");
                    }

                    res.render("admin/dashboard", {

                        adminUsername:
                            req.session.adminUsername,

                        projectCount:
                            projectResult[0].total,

                        certificateCount:
                            certificateResult[0].total,

                        messageCount:
                            messageResult[0].total,

                        resumeCount:
                            resumeResult[0].total
                    });

                });
            });
        });
    });
};