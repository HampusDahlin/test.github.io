// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2027-12-31T15:00:00"
).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        weddingDate - now;


    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");

    const secondsElement =
        document.getElementById("seconds");


    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }


    if (distance <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        return;
    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                distance %
                (1000 * 60)
            ) /
            1000
        );


    daysElement.textContent =
        String(days).padStart(2, "0");

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


// ========================================
// HERO
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const hero =
            document.querySelector(".hero");

        const heroIntro =
            document.querySelector(".hero-intro");

        const heroNames =
            document.getElementById("heroNames");

        const scrollLink =
            document.querySelector(".scroll-link");


        if (
            !hero ||
            !heroIntro ||
            !heroNames
        ) {
            return;
        }


        let automaticScrollStarted =
            false;

        let userHasScrolled =
            false;


        // ------------------------------------
        // Detect real user scrolling
        // ------------------------------------

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY > 10 &&
                    !automaticScrollStarted
                ) {
                    userHasScrolled = true;
                }

            },
            {
                passive: true
            }
        );


        // ------------------------------------
        // Update hero animation
        // ------------------------------------

        function updateHero() {

            const heroHeight =
                hero.offsetHeight;

            const viewportHeight =
                window.innerHeight;


            const maxScroll =
                Math.max(
                    0,
                    heroHeight -
                    viewportHeight
                );


            const currentScroll =
                Math.max(
                    0,
                    Math.min(
                        window.scrollY,
                        maxScroll
                    )
                );


            const progress =
                maxScroll > 0
                    ? currentScroll / maxScroll
                    : 0;


            // --------------------------------
            // INTRO
            // --------------------------------

            const introProgress =
                Math.min(
                    1,
                    progress / 0.16
                );


            const introOpacity =
                1 - introProgress;


            heroIntro.style.opacity =
                introOpacity;


            // --------------------------------
            // NAMES
            // --------------------------------
            //
            // Names begin appearing around
            // 18% of the hero scroll.
            //

            const namesProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (
                            progress -
                            0.18
                        ) / 0.30
                    )
                );


            const namesOpacity =
                namesProgress;


            const namesTranslate =
                100 -
                (
                    namesProgress *
                    100
                );


            const namesScale =
                0.96 +
                (
                    namesProgress *
                    0.04
                );


            heroNames.style.opacity =
                namesOpacity;


            heroNames.style.transform =
                `
                translateY(${namesTranslate}px)
                scale(${namesScale})
                `;


            // --------------------------------
            // SCROLL LINK
            // --------------------------------

            if (scrollLink) {

                scrollLink.style.opacity =
                    Math.max(
                        0,
                        1 -
                        (
                            progress *
                            6
                        )
                    );

            }

        }


        // ------------------------------------
        // Initial state
        // ------------------------------------

        updateHero();


        // ------------------------------------
        // Scroll
        // ------------------------------------

        window.addEventListener(
            "scroll",
            updateHero,
            {
                passive: true
            }
        );


        // ------------------------------------
        // Resize
        // ------------------------------------

        window.addEventListener(
            "resize",
            updateHero
        );


        // ====================================
        // AUTOMATIC HERO SCROLL
        // ====================================

        setTimeout(
            () => {

                /*
                 * If the visitor has already
                 * scrolled manually, don't
                 * interfere.
                 */

                if (userHasScrolled) {
                    return;
                }


                automaticScrollStarted =
                    true;


                const heroHeight =
                    hero.offsetHeight;

                const viewportHeight =
                    window.innerHeight;


                const maxScroll =
                    Math.max(
                        0,
                        heroHeight -
                        viewportHeight
                    );


                /*
                 * Move far enough to start
                 * revealing the names,
                 * but not so far that the
                 * transition is skipped.
                 */

                const targetScroll =
                    maxScroll * 0.24;


                if (targetScroll <= 0) {
                    return;
                }


                window.scrollTo({
                    top: targetScroll,
                    behavior: "smooth"
                });

            },
            500
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


            // --------------------------------
            // Open
            // --------------------------------

            assistantButton.addEventListener(
                "click",
                () => {

                    assistantCard.classList.toggle(
                        "open"
                    );

                }
            );


            // --------------------------------
            // Close
            // --------------------------------

            assistantClose.addEventListener(
                "click",
                () => {

                    assistantCard.classList.remove(
                        "open"
                    );

                }
            );


            // --------------------------------
            // Answers
            // --------------------------------

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


            // --------------------------------
            // Option buttons
            // --------------------------------

            document
                .querySelectorAll(
                    ".assistant-options button"
                )
                .forEach(
                    button => {

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

                    }
                );

        }

    }
);
