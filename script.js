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
            !heroAnnouncement ||
            !heroNames
        ) {
            return;
        }


        // ==================================
        // MANUAL SCROLL DETECTION
        // ==================================

        /*
         * The automatic scroll should only happen
         * when the visitor has stayed at the very
         * top of the page.
         *
         * Any real user interaction with scrolling
         * cancels the automatic scroll permanently
         * for this page load.
         */

        let userHasScrolled =
            window.scrollY > 0;

        let autoScrollStarted = false;


        function cancelAutoScroll() {

            if (autoScrollStarted) {
                return;
            }

            userHasScrolled = true;
        }


        /*
         * Wheel / trackpad
         */

        window.addEventListener(
            "wheel",
            cancelAutoScroll,
            {
                passive: true
            }
        );


        /*
         * Touch scrolling
         */

        window.addEventListener(
            "touchmove",
            cancelAutoScroll,
            {
                passive: true
            }
        );


        /*
         * Keyboard scrolling:
         * arrows, Page Up/Down, Space, Home, End.
         */

        window.addEventListener(
            "keydown",
            (event) => {

                const scrollingKeys = [
                    "ArrowUp",
                    "ArrowDown",
                    "PageUp",
                    "PageDown",
                    "Home",
                    "End",
                    " "
                ];

                if (
                    scrollingKeys.includes(
                        event.key
                    )
                ) {
                    cancelAutoScroll();
                }
            }
        );


        /*
         * Also watch the actual scroll position.
         *
         * Ignore scrolling caused by our own
         * automatic animation.
         */

        function handleScroll() {

            if (
                !autoScrollStarted &&
                window.scrollY > 2
            ) {
                userHasScrolled = true;
            }

            updateHero();
        }


        // ==================================
        // HERO VISUAL STATE
        // ==================================

        function updateHero() {

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
            // INTRO FADES OUT
            // ==================================

            /*
             * Keep HURRA visible at first.
             *
             * Then gradually fade it away
             * as the visitor scrolls.
             */

            const introFade =
                Math.max(
                    0,
                    1 - (progress * 4)
                );


            const heroIntro =
                document.querySelector(
                    ".hero-intro"
                );


            if (heroIntro) {

                heroIntro.style.opacity =
                    introFade;
            }


            // ==================================
            // NAMES FADE IN
            // ==================================

            /*
             * Names begin appearing after
             * roughly 18% scroll.
             */

            const namesProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (progress - 0.18) /
                        0.35
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


        /*
         * Run once immediately.
         */

        updateHero();


        /*
         * Update while scrolling.
         */

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        /*
         * Update after resizing.
         */

        window.addEventListener(
            "resize",
            updateHero
        );


        // ==================================
        // AUTOMATIC SCROLL TO NAMES
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


        function scrollToNames() {

            /*
             * Never take control away from someone
             * who has already started scrolling.
             */

            if (
                userHasScrolled ||
                autoScrollStarted ||
                window.scrollY > 2
            ) {
                return;
            }


            autoScrollStarted = true;


            const startPosition =
                window.scrollY;


            const namesRect =
                heroNames.getBoundingClientRect();


            /*
             * Put the names comfortably into view,
             * rather than simply scrolling to the
             * very bottom of the hero.
             */

            const targetPosition =
                Math.max(
                    0,
                    window.scrollY +
                    namesRect.top -
                    (window.innerHeight * 0.28)
                );


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
                    (distance *
                        easedProgress)
                );


                if (progress < 1) {

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


        // ==================================
        // START AUTO-SCROLL AFTER ANNOUNCEMENT
        // ==================================

        let autoScrollScheduled =
            false;


        function scheduleAutoScroll() {

            if (
                autoScrollScheduled ||
                userHasScrolled
            ) {
                return;
            }


            autoScrollScheduled = true;


            setTimeout(
                () => {

                    /*
                     * Give the visitor a final chance
                     * to interact manually before we
                     * take control of scrolling.
                     */

                    if (
                        !userHasScrolled &&
                        window.scrollY <= 2
                    ) {
                        scrollToNames();
                    }

                },
                450
            );
        }


        /*
         * Preferred method:
         * wait for the CSS announcement animation
         * to finish.
         */

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


        /*
         * Fallback in case animationend doesn't fire.
         */

        setTimeout(
            () => {

                if (
                    !autoScrollScheduled &&
                    !userHasScrolled
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
