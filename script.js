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

        const heroAnnouncement =
            document.querySelector(
                ".hero-announcement"
            );


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

        let automaticScrollFrame =
            null;


        // ------------------------------------
        // Detect manual scrolling
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


        // ====================================
        // UPDATE HERO
        // ====================================

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
            // INTRO FADES OUT
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
            // NAMES FADE IN
            // --------------------------------
            //
            // Starts at 18%
            // Fully visible at 48%
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
        // Scroll listener
        // ------------------------------------

        window.addEventListener(
            "scroll",
            updateHero,
            {
                passive: true
            }
        );


        // ------------------------------------
        // Resize listener
        // ------------------------------------

        window.addEventListener(
            "resize",
            updateHero
        );


        // ====================================
        // SLOW AUTOMATIC SCROLL
        // ====================================

        function startAutomaticScroll() {

            /*
             * Never interfere with a visitor
             * who has already started scrolling.
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
             * The names become fully opaque
             * at approximately 48%.
             *
             * We scroll slightly beyond that
             * point so the final state feels
             * deliberate rather than stopping
             * exactly when opacity reaches 1.
             */

            const targetProgress =
                0.55;


            const startScroll =
                window.scrollY;


            const targetScroll =
                maxScroll *
                targetProgress;


            const distance =
                targetScroll -
                startScroll;


            if (
                maxScroll <= 0 ||
                distance <= 0
            ) {
                return;
            }


            /*
             * 4.5 seconds makes the transition
             * noticeably slower and more elegant.
             */

            const duration =
                4500;


            const startTime =
                performance.now();


            /*
             * Ease in/out.
             *
             * Starts gently,
             * moves smoothly,
             * then slows down before stopping.
             */

            function easeInOutCubic(t) {

                return t < 0.5
                    ? 4 * t * t * t
                    : 1 -
                        Math.pow(
                            -2 * t + 2,
                            3
                        ) / 2;

            }


            function animateScroll(
                currentTime
            ) {

                const elapsed =
                    currentTime -
                    startTime;


                const rawProgress =
                    Math.min(
                        elapsed /
                        duration,
                        1
                    );


                const easedProgress =
                    easeInOutCubic(
                        rawProgress
                    );


                const currentPosition =
                    startScroll +
                    (
                        distance *
                        easedProgress
                    );


                window.scrollTo(
                    0,
                    currentPosition
                );


                if (
                    rawProgress < 1
                ) {

                    automaticScrollFrame =
                        requestAnimationFrame(
                            animateScroll
                        );

                } else {

                    automaticScrollFrame =
                        null;

                    updateHero();

                }

            }


            automaticScrollFrame =
                requestAnimationFrame(
                    animateScroll
                );

        }


        // ====================================
        // WAIT FOR TEXT ANIMATION
        // ====================================

        /*
         * The announcement is the last
         * introductory text element to finish.
         *
         * Rather than guessing a total load
         * time, wait for its actual
         * animationend event.
         */

        if (heroAnnouncement) {

            let scrollTimerStarted =
                false;


            function scheduleAutomaticScroll() {

                if (scrollTimerStarted) {
                    return;
                }


                scrollTimerStarted = true;


                /*
                 * Half a second pause after
                 * the text animation finishes.
                 */

                setTimeout(
                    startAutomaticScroll,
                    500
                );

            }


            heroAnnouncement.addEventListener(
                "animationend",
                scheduleAutomaticScroll,
                {
                    once: true
                }
            );


            /*
             * Safety fallback.
             *
             * If animationend doesn't fire for
             * any reason, don't leave the hero
             * stuck forever.
             *
             * The current CSS animation finishes
             * after roughly 2.3 seconds.
             */

            setTimeout(
                scheduleAutomaticScroll,
                2500
            );

        } else {

            /*
             * If the announcement element is
             * missing, use a safe fallback.
             */

            setTimeout(
                startAutomaticScroll,
                500
            );

        }


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
            // Open assistant
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
            // Close assistant
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
            // Assistant answers
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
