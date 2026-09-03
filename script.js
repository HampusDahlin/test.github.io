// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2027-12-30T15:00:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;


    if (distance <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }


    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


// ========================================
// HERO INTRO ANIMATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const announcement =
        document.getElementById("heroAnnouncement");


    if (announcement) {

        setTimeout(() => {

            announcement.classList.add("visible");

        }, 900);

    }


    // ========================================
    // WEDDING ASSISTANT
    // ========================================

    const assistantButton =
        document.getElementById("assistantButton");

    const assistantCard =
        document.getElementById("assistantCard");

    const assistantClose =
        document.getElementById("assistantClose");

    const assistantMessage =
        document.getElementById("assistantMessage");


    if (
        !assistantButton ||
        !assistantCard ||
        !assistantClose ||
        !assistantMessage
    ) {

        console.error(
            "Wedding assistant: required HTML elements not found."
        );

        return;
    }


    // Open / close
    assistantButton.addEventListener("click", () => {

        assistantCard.classList.toggle("open");

    });


    // Close
    assistantClose.addEventListener("click", () => {

        assistantCard.classList.remove("open");

    });


    // ========================================
    // ASSISTANT ANSWERS
    // ========================================

    const answers = {

        vigsel: `
            Vigseln äger rum
            <strong>TIME</strong>
            på <strong>VENUE</strong>.
            <br><br>
            Vi hoppas att du vill vara med!
        `,

        plats: `
            Festen hålls på
            <strong>VENUE</strong>.
            <br>
            ADDRESS, CITY.
        `,

        kladsel: `
            Klädkoden är
            <strong>DRESS CODE</strong>.
            <br><br>
            Vi ser fram emot att se dig där!
        `,

        osa: `
            Du kan svara på vår inbjudan
            genom att klicka på länken nedan.
            <br><br>

            <a
                href="https://forms.gle/LFyQXTaBHwLzJJ5G8"
                target="_blank"
                rel="noopener noreferrer"
            >
                Öppna OSA-formuläret →
            </a>
        `
    };


    // Question buttons
    document
        .querySelectorAll(".assistant-options button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const answer =
                    answers[button.dataset.answer];


                if (answer) {

                    assistantMessage.innerHTML =
                        answer;

                }

            });

        });

});
