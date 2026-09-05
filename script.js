// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2026-12-30T00:00:00"
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

    const heroAnnouncement =
        document.querySelector(".hero-announcement");


    /*
     * The names animation is driven by the actual
     * position of the page through the hero.
     *
     * These values describe only when the visual
     * animation starts and ends. The automatic
     * scroll target itself is calculated from the
     * element's actual geometry.
     */
    const namesStartProgress = 0.18;
    const namesAnimationLength = 0.35;


    /*
     * Once the visitor manually leaves the top,
     * automatic scrolling is permanently cancelled
     * for this page load.
     */
    let userHasLeftTop =
        window.scrollY > 0;

    let autoScrollStarted = false;
    let autoScrollScheduled = false;


    function getHeroProgress() {

        if (!hero) {
            return 0;
        }

        const maxScroll =
            Math.max(
                0,
                hero.offsetHeight -
                window.innerHeight
            );

        if (maxScroll === 0) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(
                1,
                window.scrollY / maxScroll
            )
        );
    }


    function updateHero() {

        if (
            !hero ||
            !heroIntro ||
            !heroNames
        ) {
            return;
        }


        const progress =
            getHeroProgress();


        // ==================================
        // INTRO FADES OUT
        // ==================================

        const introFade =
            Math.max(
                0,
                1 - (progress * 4)
            );

        heroIntro.style.opacity =
            introFade;


        // ==================================
        // NAMES ENTER
        // ==================================

        const namesProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    (progress - namesStartProgress)
                    / namesAnimationLength
                )
            );


        const namesTranslate =
            100 -
            (namesProgress * 100);


        const namesScale =
            0.96 +
            (namesProgress * 0.04);


        heroNames.style.opacity =
            namesProgress;

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
     * Manual scrolling cancels the automatic
     * announcement scroll as soon as the visitor
     * has genuinely left the top.
     */
    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 0) {
                userHasLeftTop = true;
            }

            updateHero();
        },
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
    // AUTOMATIC SCROLL TO NAMES
    // ========================================

    function getNamesCenteredTarget() {

        if (!hero || !heroNames) {
            return null;
        }


        /*
         * The hero is sticky and the names element is
         * positioned inside that viewport. Therefore
         * its final centered position is determined by
         * its actual rendered geometry, not by a guessed
         * page percentage.
         *
         * Temporarily render the names in their final
         * state, measure their real center, and calculate
         * the page position needed to place that center
         * at the viewport center.
         */
        const previousOpacity =
            heroNames.style.opacity;

        const previousTransform =
            heroNames.style.transform;


        heroNames.style.opacity = "1";

        heroNames.style.transform =
            "translateY(0) scale(1)";


        const rect =
            heroNames.getBoundingClientRect();


        const elementCenter =
            rect.top +
            (rect.height / 2);

        const viewportCenter =
            window.innerHeight / 2;


        const target =
            window.scrollY +
            elementCenter -
            viewportCenter;


        heroNames.style.opacity =
            previousOpacity;

        heroNames.style.transform =
            previousTransform;


        const maxScroll =
            Math.max(
                0,
                hero.offsetHeight -
                window.innerHeight
            );


        return Math.max(
            0,
            Math.min(
                target,
                maxScroll
            )
        );
    }


    function scrollToNames() {

        if (
            autoScrollStarted ||
            userHasLeftTop ||
            window.scrollY !== 0
        ) {
            return;
        }


        const target =
            getNamesCenteredTarget();


        if (target === null) {
            return;
        }


        autoScrollStarted = true;


        const html =
            document.documentElement;

        const previousScrollBehavior =
            html.style.scrollBehavior;

        /*
         * The stylesheet has global smooth scrolling.
         * Disable it temporarily so that our own
         * five-second easing is the only scroll animation.
         */
        html.style.scrollBehavior = "auto";


        const start =
            window.scrollY;

        const distance =
            target - start;

        const duration =
            5000;

        const startTime =
            performance.now();


        function easeInOutCubic(t) {

            return t < 0.5
                ? 4 * t * t * t
                : 1 -
                    Math.pow(
                        -2 * t + 2,
                        3
                    ) / 2;
        }


        function step(now) {

            /*
             * If the visitor touches the scroll position
             * while the automatic movement is running,
             * respect that interaction and stop.
             */
            if (
                userHasLeftTop &&
                window.scrollY !== 0
            ) {
                html.style.scrollBehavior =
                    previousScrollBehavior;

                return;
            }


            const elapsed =
                now - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );

            const eased =
                easeInOutCubic(progress);

            const current =
                start +
                (distance * eased);


            window.scrollTo({
                top: current,
                left: 0,
                behavior: "auto"
            });


            if (progress < 1) {

                requestAnimationFrame(step);

            } else {

                /*
                 * Force the exact calculated endpoint,
                 * then restore the site's normal scrolling.
                 */
                window.scrollTo({
                    top: target,
                    left: 0,
                    behavior: "auto"
                });

                html.style.scrollBehavior =
                    previousScrollBehavior;

                updateHero();
            }
        }


        requestAnimationFrame(step);
    }


    function scheduleAutomaticScroll() {

        if (
            autoScrollScheduled ||
            autoScrollStarted ||
            userHasLeftTop
        ) {
            return;
        }


        autoScrollScheduled = true;


        window.setTimeout(() => {

            if (
                !userHasLeftTop &&
                window.scrollY === 0
            ) {
                scrollToNames();
            }

        }, 450);
    }


    /*
     * Start the automatic scroll only after
     * "Vi ska gifta oss!" has completed its
     * actual CSS entrance animation.
     */
    if (heroAnnouncement) {

        heroAnnouncement.addEventListener(
            "animationend",
            event => {

                if (
                    event.animationName ===
                    "announcementIn"
                ) {
                    scheduleAutomaticScroll();
                }

            }
        );


        /*
         * Fallback in case animationend is unavailable
         * or the animation is skipped by the browser.
         */
        window.setTimeout(() => {

            scheduleAutomaticScroll();

        }, 3000);
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
                <strong>eftermiddag</strong>
                den 30 december 2026.
                <br><br>
                Mer information kommer senare.
            `,

            plats: `
                Vi gifter oss och firar
                i <strong>Göteborg</strong>.
                <br><br>
                Mer information om platsen
                kommer senare.
            `,

            kladsel: `
                Klädkoden är
                <strong>kavaj</strong>.
                <br><br>
                Vi ser fram emot att se dig där!
            `,

            osa: `
                OSA senast
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
                Vi önskar oss ingenting annat än
                att ni är med och firar tillsammans
                med oss.
                <br><br>
                Men för er som är envisa så uppskattar
                vi alltid kvalitetstid och roliga
                aktiviteter ihop!
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
