// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2026-12-30T00:00:00"
).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        weddingDate - now;


    if (distance <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (distance %
                (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (distance %
                (1000 * 60 * 60)) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (distance %
                (1000 * 60)) /
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
// HERO SCROLL ANIMATION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const hero =
            document.querySelector(".hero");

        const heroIntro =
            document.querySelector(".hero-intro");

        const heroAnnouncement =
            document.getElementById(
                "heroAnnouncement"
            );

        const heroNames =
            document.getElementById(
                "heroNames"
            );


        if (
            !hero ||
            !heroIntro ||
            !heroAnnouncement ||
            !heroNames
        ) {
            return;
        }


        // ==================================
        // HERO SCROLL SETTINGS
        // ==================================

        /*
         * The names begin appearing at 18%
         * and are fully visible at 53%.
         *
         * The automatic scroll stops exactly
         * at that 53% point.
         */

        const namesStartProgress =
            0.18;

        const namesEndProgress =
            0.53;

        const namesAnimationLength =
            namesEndProgress -
            namesStartProgress;


        // ==================================
        // AUTO-SCROLL STATE
        // ==================================

        /*
         * Once the visitor manually scrolls
         * away from the top, automatic scrolling
         * is permanently cancelled for this
         * page load.
         */

        let userHasLeftTop =
            window.scrollY > 0;

        let autoScrollStarted =
            false;

        let autoScrollScheduled =
            false;


        // ==================================
        // HERO VISUAL STATE
        // ==================================

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
            // HURRA
            // ==================================

            const introFade =
                Math.max(
                    0,
                    1 - (progress * 4)
                );


            heroIntro.style.opacity =
                introFade;


            // ==================================
            // HAMPUS & KRISTINA + DATE
            // ==================================

            const namesProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (
                            progress -
                            namesStartProgress
                        ) /
                        namesAnimationLength
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
        }


        updateHero();


        // ==================================
        // SCROLL HANDLER
        // ==================================

        function handleScroll() {

            /*
             * Any movement away from the top
             * means the visitor has taken control.
             *
             * This flag is never reset, even if
             * the visitor later returns to the top.
             */

            if (
                window.scrollY > 0
            ) {
                userHasLeftTop = true;
            }


            updateHero();
        }


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateHero
        );


        // ==================================
        // EASING
        // ==================================

        function easeInOutCubic(t) {

            return t < 0.5
                ? 4 * t * t * t
                : 1 -
                    Math.pow(
                        -2 * t + 2,
                        3
                    ) / 2;
        }


        // ==================================
        // AUTO-SCROLL
        // ==================================

        function scrollToNames() {

            /*
             * Automatic scrolling is only allowed
             * when the visitor has never manually
             * scrolled and is still at the top.
             */

            if (
                userHasLeftTop ||
                window.scrollY !== 0 ||
                autoScrollStarted
            ) {
                return;
            }


            autoScrollStarted = true;


            const heroHeight =
                hero.offsetHeight;

            const viewportHeight =
                window.innerHeight;


            /*
             * Because .hero-content is sticky
             * and .hero-names is centered inside
             * that viewport, the correct destination
             * is the point where the names animation
             * reaches 100%.
             */

            const maxScroll =
                Math.max(
                    0,
                    heroHeight -
                    viewportHeight
                );


            const targetPosition =
                maxScroll *
                namesEndProgress;


            const startPosition =
                window.scrollY;


            const distance =
                targetPosition -
                startPosition;


            const duration =
                5000;


            const startTime =
                performance.now();


            function animateScroll(
                currentTime
            ) {

                const elapsed =
                    currentTime -
                    startTime;


                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );


                const easedProgress =
                    easeInOutCubic(
                        progress
                    );


                window.scrollTo(
                    0,
                    startPosition +
                    (
                        distance *
                        easedProgress
                    )
                );


                if (
                    progress < 1
                ) {

                    requestAnimationFrame(
                        animateScroll
                    );

                } else {

                    /*
                     * Force the exact final
                     * destination to avoid a
                     * fractional-pixel difference.
                     */

                    window.scrollTo(
                        0,
                        targetPosition
                    );

                    updateHero();
                }
            }


            requestAnimationFrame(
                animateScroll
            );
        }


        // ==================================
        // SCHEDULE AUTO-SCROLL
        // ==================================

        function scheduleAutoScroll() {

            if (
                autoScrollScheduled ||
                autoScrollStarted ||
                userHasLeftTop
            ) {
                return;
            }


            autoScrollScheduled = true;


            setTimeout(
                () => {

                    /*
                     * Re-check everything immediately
                     * before starting the scroll.
                     */

                    if (
                        !userHasLeftTop &&
                        window.scrollY === 0
                    ) {
                        scrollToNames();
                    }

                },
                450
            );
        }


        // ==================================
        // ANNOUNCEMENT ANIMATION FINISHED
        // ==================================

        heroAnnouncement.addEventListener(
            "animationend",
            (event) => {

                if (
                    event.animationName ===
                    "announcementIn"
                ) {
                    scheduleAutoScroll();
                }
            }
        );


        // ==================================
        // FALLBACK
        // ==================================

        setTimeout(
            () => {

                if (
                    !autoScrollScheduled &&
                    !autoScrollStarted &&
                    !userHasLeftTop
                ) {
                    scheduleAutoScroll();
                }

            },
            3000
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
                    på eftermiddagen den
                    <strong>30 december 2026</strong>.
                    <br><br>
                    Exakt tid och plats kommer
                    senare.
                `,


                plats: `
                    Vi kommer att fira i
                    <strong>Göteborg</strong>.
                    <br><br>
                    Exakt lokal meddelas senare.
                `,


                kladsel: `
                    Klädkoden är
                    <strong>Kavaj</strong>.
                    <br><br>
                    Vi ser fram emot att se
                    er uppklädda och fina!
                `,


                osa: `
                    Vänligen svara på vår
                    inbjudan senast
                    <strong>31 oktober 2026</strong>.
                    <br><br>

                    <a
                        href="https://forms.gle/LFyQXTaBHwLzJJ5G8"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Öppna OSA-formuläret →
                    </a>
                `,


                presenter: `
                    Vi önskar oss ingenting
                    annat än att ni är med och
                    firar tillsammans med oss.
                    <br><br>
                    Men för er som är envisa så
                    uppskattar vi alltid
                    kvalitetstid och roliga
                    aktiviteter ihop!
                `
            };


            document
                .querySelectorAll(
                    ".assistant-options button"
                )
                .forEach(
                    (button) => {

                        button.addEventListener(
                            "click",
                            () => {

                                const answer =
                                    answers[
                                        button.dataset
                                            .answer
                                    ];


                                if (answer) {

                                    assistantMessage
                                        .innerHTML =
                                        answer;
                                }
                            }
                        );
                    }
                );
        }

    }
);
