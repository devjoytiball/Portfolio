const db = require("../config/db");


// =============================
// SAVE CONTACT MESSAGE
// =============================

exports.submitContact = (req, res) => {

    const {
        name,
        email,
        phone,
        subject,
        message
    } = req.body;


    // Required fields

    if (!name || !message) {

        return res.status(400).send(
            "Name and Message are required."
        );

    }


    // Clean input

    const cleanName = name.trim();

    const cleanEmail =
        email ? email.trim() : "";

    const cleanPhone =
        phone ? phone.trim() : "";

    const cleanSubject =
        subject ? subject.trim() : "";

    const cleanMessage =
        message.trim();


    // Validation

    if (cleanName.length < 2) {

        return res.status(400).send(
            "Please enter a valid name."
        );

    }


    if (cleanMessage.length < 5) {

        return res.status(400).send(
            "Message is too short."
        );

    }


    // MySQL query

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

                console.error(
                    "Contact Database Error:",
                    err
                );

                return res.status(500).send(
                    "Database error"
                );
            }


            console.log(
                "Message saved successfully:",
                result.insertId
            );


            // No email notification
            // No SMS notification

            res.redirect(
                "/?message=success#contact"
            );

        }
    );
};