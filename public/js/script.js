
document.addEventListener("DOMContentLoaded", () => {

    const typingText = document.getElementById("typing-text");

    const messages = [
        "Hello, I'm Devjoyti",
        "Welcome to My Portfolio"
    ];

    let messageIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;


    function typeEffect() {

        const currentMessage = messages[messageIndex];


        if (!isDeleting) {

            // Add one character
            typingText.textContent =
                currentMessage.substring(0, characterIndex + 1);

            characterIndex++;


            // Finished typing
            if (characterIndex === currentMessage.length) {

                isDeleting = true;

                setTimeout(typeEffect, 1800);

                return;
            }


            // Typing speed
            setTimeout(typeEffect, 100);


        } else {

            // Delete one character
            typingText.textContent =
                currentMessage.substring(0, characterIndex - 1);

            characterIndex--;


            // Finished deleting
            if (characterIndex === 0) {

                isDeleting = false;

                messageIndex++;

                if (messageIndex >= messages.length) {
                    messageIndex = 0;
                }

                setTimeout(typeEffect, 500);

                return;
            }


            // Deleting speed
            setTimeout(typeEffect, 60);
        }
    }


    // Start animation
    typeEffect();

});
document.addEventListener("DOMContentLoaded", function () {

    const contactForm =
        document.querySelector('form[action="/contact"]');

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", function (event) {

        const name =
            contactForm.querySelector('[name="name"]').value.trim();

        const message =
            contactForm.querySelector('[name="message"]').value.trim();

        if (name.length < 2) {

            event.preventDefault();

            alert("Please enter a valid name.");

            return;
        }

        if (message.length < 5) {

            event.preventDefault();

            alert("Please enter a longer message.");

            return;
        }

    });

});