const db = require("../config/db");


// =============================
// HOME PAGE
// =============================

exports.home = (req, res) => {

    const projectSql =
        "SELECT * FROM projects ORDER BY id DESC LIMIT 3";

    const certificateSql =
        "SELECT * FROM certificates ORDER BY id DESC LIMIT 3";


    db.query(projectSql, (projectErr, projects) => {

        if (projectErr) {

            console.error(
                "Projects Database Error:",
                projectErr
            );

            return res.status(500).send(
                "Database error"
            );
        }


        db.query(
            certificateSql,
            (certificateErr, certificates) => {

                if (certificateErr) {

                    console.error(
                        "Certificates Database Error:",
                        certificateErr
                    );

                    return res.status(500).send(
                        "Database error"
                    );
                }


                res.render("index", {

                    projects: projects,

                    certificates: certificates,

                    message:
                        req.query.message || ""

                });

            }
        );

    });
};


// =============================
// PROJECTS PAGE
// =============================

exports.projects = (req, res) => {

    const sql =
        "SELECT * FROM projects ORDER BY id DESC";


    db.query(sql, (err, projects) => {

        if (err) {

            console.error(
                "Projects Database Error:",
                err
            );

            return res.status(500).send(
                "Database error"
            );
        }


        res.render("projects", {
            projects: projects
        });

    });
};


// =============================
// CERTIFICATES PAGE
// =============================

exports.certificates = (req, res) => {

    const sql =
        "SELECT * FROM certificates ORDER BY id DESC";


    db.query(sql, (err, certificates) => {

        if (err) {

            console.error(
                "Certificates Database Error:",
                err
            );

            return res.status(500).send(
                "Database error"
            );
        }


        res.render("certificates", {
            certificates: certificates
        });

    });
};


// =============================
// RESUME
// =============================

exports.resume = (req, res) => {

    const path = require("path");

    const sql =
        "SELECT * FROM resume ORDER BY id DESC LIMIT 1";


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Resume Database Error:",
                err
            );

            return res.status(500).send(
                "Database error"
            );
        }


        if (results.length === 0) {

            return res.status(404).send(
                "Resume is not available."
            );

        }


        const resumeFile = path.join(
            __dirname,
            "..",
            "public",
            "uploads",
            "resume",
            results[0].file_name
        );


        console.log(
            "Opening resume:",
            resumeFile
        );


        res.sendFile(
            resumeFile,
            (err) => {

                if (err) {

                    console.error(
                        "Resume File Error:",
                        err
                    );

                    if (!res.headersSent) {

                        res.status(404).send(
                            "Resume file not found."
                        );

                    }
                }

            }
        );

    });
};