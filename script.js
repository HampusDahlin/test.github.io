// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2027-12-31T15:00:00"
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
// HERO SCROLL ANIMATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const hero =
        document.querySelector(".hero");

    const heroIntro =
        document.querySelector(".hero-intro");

    const heroNames =
        document.getElementById("heroNames");


    function updateHero() {

        if (!hero || !heroIntro || !heroNames) {
            return;
        }


        const heroHeight =
            hero.offsetHeight;

        const viewportHeight =
            window.innerHeight;


        /*
         * How far we've travelled through
         * the hero.
         *
         * 0 = top of hero
         * 1 = bottom of hero
         */

        const maxScroll =
            heroHeight - viewportHeight;


        const scroll =
            Math.max(
                0,
                Math.min(
                    window.scrollY,
                    maxScroll
                )
            );


        const progress =
            maxScroll > 0
                ? scroll / maxScroll
                : 0;


        // ==================================
        // INTRO FADES OUT
        // ==================================

        /*
         * Keep HURRA visible at first.
         *
         * Then gradually fade it away.
         */

        const introFade =
            Math.max(
                0,
                1 - (progress * 4)
            );


        heroIntro.style.opacity =
            introFade;


        // ==================================
        // NAMES FADE IN
        // ==================================

        /*
         * Names begin appearing after
         * roughly 20% scroll.
         */

        const namesProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    (progress - 0.18) / 0.35
                )
            );


        const namesOpacity =
            namesProgress;


        const namesTranslate =
            100 -
            (namesProgress * 100);


        const namesScale =
            0.96 +
            (namesProgress * 0.04);


        heroNames.style.opacity =
            namesOpacity;


        heroNames.style.transform =
            `
            translateY(${namesTranslate}px)
            scale(${namesScale})
            `;


        // ==================================
        // SCROLL LINK
        // ==================================

        const scrollLink =
            document.querySelector(".scroll-link");


        if (scrollLink) {

            scrollLink.style.opacity =
                Math.max(
                    0,
                    1 - (progress * 5)
                );

        }

    }


    /*
     * Run once immediately.
     */

    updateHero();


    /*
     * Update while scrolling.
     */

    window.addEventListener(
        "scroll",
        updateHero,
        { passive: true }
    );


    /*
     * Update after resizing.
     */

    window.addEventListener(
        "resize",
        updateHero
    );


    // ========================================
    // WEDDING ASSISTANT
    // ========================================

    const assistantButton =
        document.getElementById(
            "assistantButton"
        );

    const assistantCard =
        document.getElementById(
            "assistantCard"
        );

    const assistantClose =
        document.getElementById(
            "assistantClose"
        );

    const assistantMessage =
        document.getElementById(
            "assistantMessage"
        );


    if (
        assistantButton &&
        assistantCard &&
        assistantClose &&
        assistantMessage
    ) {

        assistantButton.addEventListener(
            "click",
            () => {

                assistantCard.classList.toggle(
                    "open"
                );

            }
        );


        assistantClose.addEventListener(
            "click",
            () => {

                assistantCard.classList.remove(
                    "open"
                );

            }
        );


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


        document
            .querySelectorAll(
                ".assistant-options button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const answer =
                            answers[
                                button.dataset.answer
                            ];


                        if (answer) {

                            assistantMessage.innerHTML =
                                answer;

                        }

                    }
                );

            });

    }

});
