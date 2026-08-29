// ========================================
// BRÖLLOPSDATUM
// ========================================
//
// Ändra detta till ert riktiga datum.
//
// Format:
// YYYY-MM-DDTHH:MM:SS
//
// Exempel:
// 2027-06-12T15:00:00
// ========================================

const weddingDate = new Date(
    "2027-06-12T15:00:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;


    // Om bröllopsdagen har passerat
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


// Kör direkt
updateCountdown();

// Uppdatera varje sekund
setInterval(updateCountdown, 1000);


/* ==================================================
   WEDDING ASSISTANT
   ================================================== */

const assistantButton =
    document.getElementById("assistantButton");

const assistantCard =
    document.getElementById("assistantCard");

const assistantClose =
    document.getElementById("assistantClose");

const assistantMessage =
    document.getElementById("assistantMessage");


/* Open assistant */

assistantButton.addEventListener("click", () => {

    assistantCard.classList.toggle("open");

});


/* Close assistant */

assistantClose.addEventListener("click", () => {

    assistantCard.classList.remove("open");

});


/* Answers */

const answers = {

    vigsel: `
        Vigseln äger rum <strong>TIME</strong>
        på <strong>VENUE</strong>.
        <br><br>
        Vi hoppas att du vill vara med!
    `,

    plats: `
        Festen hålls på <strong>VENUE</strong>,
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
        genom att klicka på knappen nedan.
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


/* Question buttons */

document
    .querySelectorAll(".assistant-options button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const answer =
                answers[button.dataset.answer];

            assistantMessage.innerHTML = answer;

        });

    });
