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


    if (distance <= 0) {

        document.getElementById("days").textContent =
            "00";

        document.getElementById("hours").textContent =
            "00";

        document.getElementById("minutes").textContent =
            "00";

        document.getElementById("seconds").textContent =
            "00";

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

setInterval(
    updateCountdown,
    1000
);



// ========================================
// HERO SCROLL
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const hero =
            document.querySelector(".hero");

        const heroSequence =
            document.querySelector(
                ".hero-sequence"
            );

        const heroAnnouncement =
            document.getElementById(
                "heroAnnouncement"
            );

        const heroNames =
            document.getElementById(
                "heroNames"
            );

        const scrollLink =
            document.querySelector(
                ".scroll-link"
            );


        if (
            !hero ||
            !heroSequence ||
            !heroNames
        ) {
            return;
        }


        let automaticScrollStarted =
            false;

        let userHasScrolled =
            false;

        let animationFallback =
            null;


        // ========================================
        // UPDATE HERO
        // ========================================

        function updateHero() {

            const heroHeight =
                hero.offsetHeight;

            const viewportHeight =
                window.innerHeight;


            /*
             * This is the actual amount of
             * scroll available inside the hero.
             */

            const maxScroll =
                Math.max(
                    0,
                    heroHeight -
                    viewportHeight
                );


            /*
             * Because the hero itself starts at
             * document position 0, scrollY is
             * the correct travel distance here.
             */

            const scroll =
                Math.max(
                    0,
                    Math.min(
                        window.scrollY,
                        maxScroll
                    )
                );


            /*
             * Move the entire sequence upward
             * exactly as far as the page has
             * been scrolled.
             *
             * This creates the natural feeling
             * of physically scrolling past the
             * announcement and down to the names.
             */

            heroSequence.style.transform =
                `translate3d(
                    0,
                    -${scroll}px,
                    0
                )`;


            // ==================================
            // SCROLL LINK
            // ==================================

            if (scrollLink) {

                const progress =
                    maxScroll > 0
                        ? scroll / maxScroll
                        : 0;


                scrollLink.style.opacity =
                    Math.max(
                        0,
                        1 -
                        (progress * 5)
                    );
            }
        }


        updateHero();


        window.addEventListener(
            "scroll",
            () => {

                /*
                 * If the visitor starts scrolling
                 * manually before the automatic
                 * sequence begins, leave control
                 * to them.
                 */

                if (
                    !automaticScrollStarted
                ) {
                    userHasScrolled = true;
                }


                updateHero();

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateHero
        );



        // ========================================
        // AUTOMATIC SCROLL
        // ========================================

        function startAutomaticScroll() {

            if (
                automaticScrollStarted ||
                userHasScrolled
            ) {
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
             * The names are positioned at 92vh.
             *
             * We want their content block to
             * arrive around the center of the
             * screen.
             *
             * Instead of using a magic 55% of
             * the hero, calculate the destination
             * from the actual position of the
             * names.
             */

            const namesRect =
                heroNames.getBoundingClientRect();


            const namesCenter =
                namesRect.top +
                (
                    namesRect.height / 2
                );


            /*
             * The amount needed to bring the
             * center of NAME & NAME to the
             * center of the viewport.
             */

            const desiredScroll =
                window.scrollY +
                (
                    namesCenter -
                    (viewportHeight / 2)
                );


            /*
             * Keep the destination inside
             * the hero's available scroll.
             */

            const targetScroll =
                Math.max(
                    0,
                    Math.min(
                        desiredScroll,
                        maxScroll
                    )
                );


            const startingScroll =
                window.scrollY;


            const distance =
                targetScroll -
                startingScroll;


            if (distance <= 1) {

                updateHero();

                return;
            }


            /*
             * Five seconds gives the movement
             * a deliberate, cinematic pace.
             */

            const duration =
                5000;


            const startTime =
                performance.now();


            function easeInOutCubic(
                value
            ) {

                return value < 0.5
                    ? 4 *
                        value *
                        value *
                        value
                    : 1 -
                        Math.pow(
                            -2 * value + 2,
                            3
                        ) /
                        2;
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


                const currentScroll =
                    startingScroll +
                    (
                        distance *
                        easedProgress
                    );


                window.scrollTo(
                    0,
                    currentScroll
                );


                if (
                    rawProgress < 1
                ) {

                    requestAnimationFrame(
                        animateScroll
                    );

                } else {

                    updateHero();
                }
            }


            requestAnimationFrame(
                animateScroll
            );
        }



        // ========================================
        // WAIT FOR ANNOUNCEMENT
        // ========================================

        if (heroAnnouncement) {

            heroAnnouncement.addEventListener(
                "animationend",
                () => {

                    if (
                        animationFallback
                    ) {
                        clearTimeout(
                            animationFallback
                        );
                    }


                    /*
                     * Small pause after
                     * "Vi ska gifta oss!"
                     * has appeared.
                     */

                    setTimeout(
                        startAutomaticScroll,
                        500
                    );

                },
                {
                    once: true
                }
            );


            /*
             * Fallback for browsers/settings
             * where animationend doesn't fire.
             */

            animationFallback =
                setTimeout(
                    () => {

                        startAutomaticScroll();

                    },
                    2800
                );

        } else {

            setTimeout(
                startAutomaticScroll,
                1800
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
