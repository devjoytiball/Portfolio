const adminAuth = require("./middleware/authMiddleware");
const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const multer = require("multer");
const fs = require("fs");
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));





// =========================
// SESSION CONFIGURATION
// =========================

app.use(session({
    secret: process.env.SESSION_SECRET || "portfolio-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

// =========================
// ADMIN LOGIN PAGE
// =========================

app.get("/admin/login", (req, res) => {

    if (req.session.adminId) {
        return res.redirect("/admin/dashboard");
    }

    res.render("admin/login", {
        error: null
    });

});
// =========================
// ADMIN LOGIN
// =========================

app.post("/admin/login", (req, res) => {

    const {
        username,
        password
    } = req.body;


    if (!username || !password) {

        return res.render("admin/login", {
            error: "Please enter username and password."
        });

    }


    const sql = `
        SELECT *
        FROM admins
        WHERE username = ?
        LIMIT 1
    `;


    db.query(
        sql,
        [username],
        async (err, results) => {

            if (err) {

                console.error(
                    "Admin login error:",
                    err.message
                );

                return res.render("admin/login", {
                    error: "Something went wrong."
                });

            }


            if (results.length === 0) {

                return res.render("admin/login", {
                    error: "Invalid username or password."
                });

            }


            const admin = results[0];


            const passwordMatch = await bcrypt.compare(
                password,
                admin.password
            );


            if (!passwordMatch) {

                return res.render("admin/login", {
                    error: "Invalid username or password."
                });

            }


            // Create login session

            req.session.adminId = admin.id;

            req.session.adminUsername = admin.username;


            res.redirect("/admin/dashboard");

        }
    );

});
// =====================================
// ADMIN DASHBOARD
// =====================================
app.get("/admin/dashboard", adminAuth, (req, res) => {

    const queries = {
        projects: "SELECT COUNT(*) AS total FROM projects",
        certificates: "SELECT COUNT(*) AS total FROM certificates",
        messages: "SELECT COUNT(*) AS total FROM messages",
        resume: "SELECT COUNT(*) AS total FROM resume"
    };

    db.query(queries.projects, (err, projectResult) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        db.query(queries.certificates, (err, certificateResult) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            db.query(queries.messages, (err, messageResult) => {

                if (err) {
                    console.error(err);
                    return res.status(500).send("Database error");
                }

                db.query(queries.resume, (err, resumeResult) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).send("Database error");
                    }

                    res.render("admin/dashboard", {

                        adminUsername: req.session.adminUsername,

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

});

// =========================
// ADMIN LOGOUT
// =========================

app.get("/admin/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error(
                "Logout error:",
                err.message
            );

        }

        res.redirect("/admin/login");

    });

});
// =========================
// ADMIN PROJECTS PAGE
// =========================

app.get(
    "/admin/projects",
    adminAuth,
    (req, res) => {

        const sql = `
            SELECT *
            FROM projects
            ORDER BY id DESC
        `;

        db.query(sql, (err, projects) => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send("Unable to load projects.");

            }

            res.render("admin/projects", {
                projects: projects,
                adminUsername: req.session.adminUsername
            });

        });

    }
);
// =========================
// ADD PROJECT
// =========================

app.post(
    "/admin/projects/add",
    adminAuth,
    (req, res) => {

        const {
            title,
            description,
            technologies,
            github_url,
            live_url,
            image
        } = req.body;


        if (!title) {

            return res.redirect("/admin/projects");

        }


        const sql = `
            INSERT INTO projects
            (
                title,
                description,
                technologies,
                github_url,
                live_url,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;


        db.query(
            sql,
            [
                title,
                description,
                technologies,
                github_url,
                live_url,
                image
            ],
            (err) => {

                if (err) {

                    console.error(
                        "Add project error:",
                        err.message
                    );

                    return res
                        .status(500)
                        .send("Unable to add project.");

                }


                res.redirect("/admin/projects");

            }
        );

    }
);
// =========================
// EDIT PROJECT
// =========================

app.post(
    "/admin/projects/edit/:id",
    adminAuth,
    (req, res) => {

        const projectId = req.params.id;


        const {
            title,
            description,
            technologies,
            github_url,
            live_url,
            image
        } = req.body;


        const sql = `
            UPDATE projects

            SET
                title = ?,
                description = ?,
                technologies = ?,
                github_url = ?,
                live_url = ?,
                image = ?

            WHERE id = ?
        `;


        db.query(
            sql,
            [
                title,
                description,
                technologies,
                github_url,
                live_url,
                image,
                projectId
            ],
            (err) => {

                if (err) {

                    console.error(
                        "Edit project error:",
                        err.message
                    );

                    return res
                        .status(500)
                        .send("Unable to update project.");

                }


                res.redirect("/admin/projects");

            }
        );

    }
);
// =========================
// DELETE PROJECT
// =========================

app.post(
    "/admin/projects/delete/:id",
    adminAuth,
    (req, res) => {

        const projectId = req.params.id;


        const sql = `
            DELETE FROM projects
            WHERE id = ?
        `;


        db.query(
            sql,
            [projectId],
            (err) => {

                if (err) {

                    console.error(
                        "Delete project error:",
                        err.message
                    );

                    return res
                        .status(500)
                        .send("Unable to delete project.");

                }


                res.redirect("/admin/projects");

            }
        );

    }
);
// =========================
// ADMIN CERTIFICATES PAGE
// =========================

app.get(
    "/admin/certificates",
    adminAuth,
    (req, res) => {

        const sql = `
            SELECT *
            FROM certificates
            ORDER BY id DESC
        `;

        db.query(sql, (err, certificates) => {

            if (err) {

                console.error(
                    "Certificate loading error:",
                    err.message
                );

                return res
                    .status(500)
                    .send("Unable to load certificates.");

            }

            res.render("admin/certificates", {

                certificates: certificates,

                adminUsername:
                    req.session.adminUsername

            });

        });

    }
);
// =========================
// ADD CERTIFICATE
// =========================

app.post(
    "/admin/certificates/add",
    adminAuth,
    (req, res) => {

        const {
            title,
            issuer,
            description,
            certificate_image,
            issue_date
        } = req.body;


        if (!title) {

            return res.redirect(
                "/admin/certificates"
            );

        }


        const sql = `
            INSERT INTO certificates
            (
                title,
                organization,
                description,
                certificate_file,
                issue_date
            )
            VALUES (?, ?, ?, ?, ?)
        `;


        db.query(
            sql,
            [
                title,
                issuer,
                description,
                certificate_image,
                issue_date
            ],
            (err) => {

                if (err) {

                    console.error(
                        "Add certificate error:",
                        err.message
                    );

                    return res
                        .status(500)
                        .send(
                            "Unable to add certificate."
                        );

                }


                res.redirect(
                    "/admin/certificates"
                );

            }
        );

    }
);
// =========================
// EDIT CERTIFICATE
// =========================

app.post(
    "/admin/certificates/edit/:id",
    adminAuth,
    (req, res) => {

        const certificateId =
            req.params.id;


        const {
            title,
            issuer,
            description,
            certificate_image,
            issue_date
        } = req.body;


        const sql = `
            UPDATE certificates

            SET
                title = ?,
                issuer = ?,
                description = ?,
                certificate_image = ?,
                issue_date = ?

            WHERE id = ?
        `;


        db.query(
            sql,
            [
                title,
                issuer,
                description,
                certificate_image,
                issue_date,
                certificateId
            ],
            (err) => {

                if (err) {

                    console.error(
                        "Edit certificate error:",
                        err.message
                    );

                    return res
                        .status(500)
                        .send(
                            "Unable to update certificate."
                        );

                }


                res.redirect(
                    "/admin/certificates"
                );

            }
        );

    }
);
// =========================
// DELETE CERTIFICATE
// =========================

app.post(
    "/admin/certificates/delete/:id",
    adminAuth,
    (req, res) => {

        const certificateId =
            req.params.id;


        const sql = `
            DELETE FROM certificates
            WHERE id = ?
        `;


        db.query(
            sql,
            [certificateId],
            (err) => {

                if (err) {

                    console.error(
                        "Delete certificate error:",
                        err.message
                    );

                    return res
                        .status(500)
                        .send(
                            "Unable to delete certificate."
                        );

                }


                res.redirect(
                    "/admin/certificates"
                );

            }
        );

    }
);
// ===============================
// RESUME UPLOAD CONFIGURATION
// ===============================

const resumeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/resume");
    },

    filename: function (req, file, cb) {
        cb(null, "resume-" + Date.now() + path.extname(file.originalname));
    }
});

const resumeUpload = multer({
    storage: resumeStorage,

    fileFilter: function (req, file, cb) {

        const extension = path.extname(file.originalname).toLowerCase();

        if (extension === ".pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
// ===============================
// ADMIN RESUME PAGE
// ===============================

app.get("/admin/resume", adminAuth, (req, res) => {

    const sql = "SELECT * FROM resume ORDER BY id DESC LIMIT 1";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.render("admin/resume", {
            resume: results.length > 0 ? results[0] : null,
            adminUsername: req.session.adminUsername
        });
    });
});
// ===============================
// UPLOAD RESUME
// ===============================

app.post(
    "/admin/resume/upload",
    adminAuth,
    resumeUpload.single("resume"),
    (req, res) => {

        if (!req.file) {
            return res.send("Please select a PDF resume.");
        }

        // Find old resume
        const selectSql = "SELECT * FROM resume ORDER BY id DESC LIMIT 1";

        db.query(selectSql, (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            // Delete old physical file
            if (results.length > 0) {

                const oldResume = results[0];

                const oldFilePath = path.join(
                    __dirname,
                    "public",
                    oldResume.file_path
                );

                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Delete old database record
                db.query(
                    "DELETE FROM resume WHERE id = ?",
                    [oldResume.id],
                    (deleteErr) => {

                        if (deleteErr) {
                            console.error(deleteErr);
                            return res.status(500).send("Database error");
                        }

                        saveNewResume(req, res);
                    }
                );

            } else {
                saveNewResume(req, res);
            }
        });
    }
);
// ===============================
// SAVE NEW RESUME
// ===============================

function saveNewResume(req, res) {

    const fileName = req.file.filename;

    const filePath = "uploads/resume/" + fileName;

    const sql = `
        INSERT INTO resume
        (file_name, file_path)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [fileName, filePath],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            res.redirect("/admin/resume");
        }
    );
}
// ===============================
// DELETE RESUME
// ===============================

app.post("/admin/resume/delete/:id", adminAuth, (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM resume WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            if (results.length === 0) {
                return res.redirect("/admin/resume");
            }

            const resume = results[0];

            const filePath = path.join(
                __dirname,
                "public",
                resume.file_path
            );

            // Delete physical file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete database record
            db.query(
                "DELETE FROM resume WHERE id = ?",
                [id],
                (deleteErr) => {

                    if (deleteErr) {
                        console.error(deleteErr);
                        return res.status(500).send("Database error");
                    }

                    res.redirect("/admin/resume");
                }
            );
        }
    );
});
// ===============================
// PUBLIC RESUME
// ===============================

app.get("/resume", (req, res) => {

    const sql = "SELECT * FROM resume ORDER BY id DESC LIMIT 1";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Resume database error:", err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) {
            return res.status(404).send("Resume is not available.");
        }

        const resumeFile = path.join(
            __dirname,
            "public",
            "uploads",
            "resume",
            results[0].file_name
        );

        console.log("Opening resume:", resumeFile);

        res.sendFile(resumeFile, (err) => {

            if (err) {
                console.error("Resume file error:", err);
                if (!res.headersSent) {
                    res.status(404).send("Resume file not found.");
                }
            }

        });
    });
});
// ===============================
// CONTACT FORM
// ===============================

app.post("/contact", (req, res) => {

    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
        return res.status(400).send("Name and Message are required.");
    }

    const cleanName = name.trim();
    const cleanEmail = email ? email.trim() : "";
    const cleanPhone = phone ? phone.trim() : "";
    const cleanSubject = subject ? subject.trim() : "";
    const cleanMessage = message.trim();

    if (cleanName.length < 2) {
        return res.status(400).send("Please enter a valid name.");
    }

    if (cleanMessage.length < 5) {
        return res.status(400).send("Message is too short.");
    }

    const sql = `
        INSERT INTO messages
        (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            cleanName,
            cleanEmail,
            cleanPhone,
            cleanSubject,
            cleanMessage
        ],
        (err, result) => {

            if (err) {
                console.error("Contact Database Error:", err);
                return res.status(500).send("Database error");
            }

            console.log(
                "Message saved:",
                result.insertId
            );

            res.redirect("/?message=success#contact");
        }
    );
});
// ===============================
// ADMIN MESSAGES
// ===============================

app.get("/admin/messages", adminAuth, (req, res) => {

    const sql = `
        SELECT *
        FROM messages
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Messages error:", err);
            return res.status(500).send("Database error");
        }

        res.render("admin/messages", {
            messages: results,
            adminUsername: req.session.adminUsername
        });

    });

});
// ===============================
// DELETE MESSAGE
// ===============================

app.post("/admin/messages/delete/:id", adminAuth, (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM messages WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error("Delete message error:", err);
                return res.status(500).send("Database error");
            }

            res.redirect("/admin/messages");

        }
    );

});
// =====================================
// ADMIN SETTINGS PAGE
// =====================================

app.get("/admin/settings", adminAuth, (req, res) => {

    const adminId = req.session.adminId;

    const success = req.query.success || null;
    const error = req.query.error || null;


    db.query(
        "SELECT id, username FROM admins WHERE id = ?",
        [adminId],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500)
                    .send("Database error");

            }


            if (results.length === 0) {

                return res.status(404)
                    .send("Admin account not found.");

            }


            res.render("admin/settings", {

                admin: results[0],

                success: success,

                error: error

            });

        }
    );

});
// =====================================
// CHANGE ADMIN USERNAME
// =====================================

app.post(
    "/admin/settings/username",
    adminAuth,
    (req, res) => {

        const adminId = req.session.adminId;

        const newUsername =
            req.body.username.trim();


        if (!newUsername || newUsername.length < 3) {

            return res.redirect(
                "/admin/settings?error=Invalid username"
            );

        }


        const sql = `
            UPDATE admin
            SET username = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [newUsername, adminId],
            (err) => {

                if (err) {

                    console.error(
                        "Username update error:",
                        err
                    );

                    return res.redirect(
                        "/admin/settings?error=Unable to update username"
                    );

                }


                req.session.adminUsername =
                    newUsername;


                res.redirect(
                    "/admin/settings?success=Username updated successfully"
                );

            }
        );

    }
);
// =====================================
// CHANGE ADMIN PASSWORD
// =====================================

app.post(
    "/admin/settings/password",
    adminAuth,
    async (req, res) => {

        const adminId = req.session.adminId;

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.redirect(
                "/admin/settings?error=All password fields are required"
            );

        }


        if (newPassword.length < 6) {

            return res.redirect(
                "/admin/settings?error=Password must contain at least 6 characters"
            );

        }


        if (newPassword !== confirmPassword) {

            return res.redirect(
                "/admin/settings?error=Passwords do not match"
            );

        }


        db.query(
            "SELECT * FROM admin WHERE id = ?",
            [adminId],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Password lookup error:",
                        err
                    );

                    return res.redirect(
                        "/admin/settings?error=Database error"
                    );

                }


                if (results.length === 0) {

                    return res.redirect(
                        "/admin/settings?error=Admin account not found"
                    );

                }


                const admin = results[0];


                try {

                    const passwordMatch =
                        await bcrypt.compare(
                            currentPassword,
                            admin.password
                        );


                    if (!passwordMatch) {

                        return res.redirect(
                            "/admin/settings?error=Current password is incorrect"
                        );

                    }


                    const hashedPassword =
                        await bcrypt.hash(
                            newPassword,
                            10
                        );


                    db.query(
                        `
                        UPDATE admin
                        SET password = ?
                        WHERE id = ?
                        `,
                        [hashedPassword, adminId],
                        (updateErr) => {

                            if (updateErr) {

                                console.error(
                                    "Password update error:",
                                    updateErr
                                );

                                return res.redirect(
                                    "/admin/settings?error=Unable to update password"
                                );

                            }


                            res.redirect(
                                "/admin/settings?success=Password changed successfully"
                            );

                        }
                    );

                } catch (error) {

                    console.error(error);

                    return res.redirect(
                        "/admin/settings?error=Password update failed"
                    );

                }

            }
        );

    }
);
// Home route
// ================= HOME PAGE =================

app.get("/", (req, res) => {

    const projectSql =
        "SELECT * FROM projects ORDER BY id DESC LIMIT 3";

    const certificateSql =
        "SELECT * FROM certificates ORDER BY id DESC LIMIT 3";


    db.query(projectSql, (projectErr, projects) => {

        if (projectErr) {
            console.error("Projects Database Error:", projectErr);
            return res.status(500).send("Database error");
        }


        db.query(certificateSql, (certificateErr, certificates) => {

            if (certificateErr) {
                console.error("Certificates Database Error:", certificateErr);
                return res.status(500).send("Database error");
            }


            res.render("index", {
                projects: projects,
                certificates: certificates,
                message: req.query.message || ""
            });

        });

    });

});


// About page
app.get("/about", (req, res) => {
    res.render("about");
});
// Projects page
app.get("/projects", (req, res) => {

    const sql = `
        SELECT *
        FROM projects
        ORDER BY id DESC
    `;

    db.query(sql, (err, projects) => {

        if (err) {
            console.error("Projects database error:", err.message);
            return res.status(500).send("Unable to load projects");
        }

        res.render("projects", {
            projects: projects
        });
    });

});
// Certificates page
app.get("/certificates", (req, res) => {

    const sql = `
        SELECT *
        FROM certificates
        ORDER BY issue_date DESC
    `;

    db.query(sql, (err, certificates) => {

        if (err) {

            console.error(
                "Certificates database error:",
                err.message
            );

            return res
                .status(500)
                .send("Unable to load certificates");
        }

        res.render("certificates", {
            certificates: certificates
        });

    });

});
// Resume page
app.get("/resume", (req, res) => {
    res.render("resume");
});
// =========================
// CONTACT PAGE
// =========================

app.get("/contact", (req, res) => {

    const success = req.query.success === "1";

    res.render("contact", {
        success: success
    });

});
// =========================
// CONTACT FORM SUBMISSION
// =========================

app.post("/contact", (req, res) => {

    const {
        name,
        email,
        phone,
        subject,
        message
    } = req.body;


    // Basic validation

    if (!name || !email || !message) {

        return res.render("contact", {
            success: null,
            error: "Please fill all required fields."
        });

    }


    const sql = `
        INSERT INTO contact_messages
        (name, email, phone,subject, message)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [name, email,phone, subject, message],
        (err, result) => {

            if (err) {

                console.error(
                    "Contact message error:",
                    err.message
                );

                return res.render("contact", {
                    success: null,
                    error: "Something went wrong. Please try again."
                });

            }


            res.render("contact", {
                success: "Your message has been sent successfully!",
                error: null
            });

        }
    );

});
app.get("/test-db", (req, res) => {

    const sql = `
        SELECT 
            id,
            title,
            description,
            technologies,
            github_url,
            live_url,
            image
        FROM projects
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).send("Database error");
        }

        res.json(results);
    });
});

// ================= PUBLIC PROJECTS =================

app.get("/projects", (req, res) => {

    const sql = "SELECT * FROM projects ORDER BY id DESC";

    db.query(sql, (err, projects) => {

        if (err) {
            console.error("Projects Database Error:", err);
            return res.status(500).send("Database error");
        }

        res.render("projects", {
            projects: projects
        });

    });

});
// ================= PUBLIC CERTIFICATES =================

app.get("/certificates", (req, res) => {

    const sql = "SELECT * FROM certificates ORDER BY id DESC";

    db.query(sql, (err, certificates) => {

        if (err) {

            console.error("Certificates Database Error:", err);

            return res.status(500).send("Database error");
        }

        res.render("certificates", {
            certificates: certificates
        });

    });

});
app.use((req, res) => {

    res.status(404).render("404");

});
app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    res.status(500).send(
        "Something went wrong on the server."
    );

});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`server running on port ${PORT}`);
});