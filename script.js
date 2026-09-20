

// ========================================
// SPOTIFY EMBED
// ========================================

const spotifyPlaylistUri =
    "spotify:playlist:2CRtxjwtr3o4Jcc8qcOOJm";


function initSpotifyEmbed(IFrameAPI) {

    const element =
        document.getElementById("spotifyEmbed");


    if (!element) {
        return;
    }


    const options = {
        width: "100%",
        height: "352",
        uri: spotifyPlaylistUri
    };


    IFrameAPI.createController(
        element,
        options,
        EmbedController => {

            /*
             * Spotify's iFrame API supports the
             * dark theme through loadUri().
             * The playlist is loaded again with
             * that theme as soon as the controller
             * is ready.
             */
            EmbedController.loadUri(
                spotifyPlaylistUri,
                false,
                0,
                "dark"
            );

        }
    );
}


window.onSpotifyIframeApiReady =
    initSpotifyEmbed;


function loadSpotifyIframeApi() {

    if (
        document.getElementById(
            "spotify-iframe-api"
        )
    ) {
        return;
    }


    const script =
        document.createElement("script");


    script.id =
        "spotify-iframe-api";

    script.src =
        "https://open.spotify.com/embed/iframe-api/v1";

    script.async = true;


    document.body.appendChild(script);
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadSpotifyIframeApi,
        { once: true }
    );

} else {

    loadSpotifyIframeApi();
}

// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2026-12-31T00:00:00"
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
// HERO SCROLL ANIMATION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const hero =
            document.querySelector(".hero");

        const heroIntro =
            document.querySelector(".hero-intro");

        const heroContent =
            document.querySelector(".hero-content");

        const heroBackground =
            document.querySelector(".hero-background");

        const heroNames =
            document.getElementById("heroNames");

        const heroAnnouncement =
            document.getElementById(
                "heroAnnouncement"
            );


        if (
            !hero ||
            !heroIntro ||
            !heroContent ||
            !heroBackground ||
            !heroNames
        ) {
            return;
        }


        // ----------------------------------------
        // HERO TIMING
        // ----------------------------------------

        const namesStartProgress =
            0.18;

        const namesAnimationLength =
            0.35;

        const automaticScrollDelay =
            450;

        const automaticScrollDuration =
            5000;


        // ----------------------------------------
        // HERO STATE
        // ----------------------------------------

        /*
         * Once the visitor manually leaves the top,
         * automatic scrolling is permanently cancelled
         * for this page load.
         */
        let userHasLeftTop =
            window.scrollY > 0;


        let autoScrollStarted =
            false;


        let autoScrollScheduled =
            false;


        let autoScrollFrame =
            null;


        let autoScrollTimeout =
            null;


        // ----------------------------------------
        // HELPERS
        // ----------------------------------------

        function clamp(
            value,
            min,
            max
        ) {
            return Math.max(
                min,
                Math.min(
                    max,
                    value
                )
            );
        }


        function isReducedMotion() {

            return window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
        }


        function getHeroMaxScroll() {

            return Math.max(
                0,
                hero.offsetHeight -
                window.innerHeight
            );
        }


        function getHeroLocalScroll(
            scrollY = window.scrollY
        ) {

            const heroTop =
                hero.getBoundingClientRect().top +
                window.scrollY;

            return clamp(
                scrollY - heroTop,
                0,
                getHeroMaxScroll()
            );
        }


        function updateHeroLayers(
            scrollY = window.scrollY
        ) {

            const localScroll =
                getHeroLocalScroll(
                    scrollY
                );

            const translate =
                `translate3d(0, ${localScroll}px, 0)`;

            heroBackground.style.transform =
                translate;

            heroContent.style.transform =
                translate;
        }


        function getHeroProgress(
            scrollY = window.scrollY
        ) {

            const maxScroll =
                getHeroMaxScroll();


            if (maxScroll === 0) {
                return 0;
            }


            return clamp(
                scrollY / maxScroll,
                0,
                1
            );
        }


        function getNamesProgress(
            progress
        ) {

            return clamp(
                (
                    progress -
                    namesStartProgress
                ) /
                namesAnimationLength,
                0,
                1
            );
        }


        // ----------------------------------------
        // RENDER HERO
        // ----------------------------------------

        function renderHero(
            scrollY = window.scrollY
        ) {

            updateHeroLayers(
                scrollY
            );

            if (isReducedMotion()) {

                heroIntro.style.opacity =
                    "1";

                heroNames.style.opacity =
                    "1";

                heroNames.style.transform =
                    "none";

                return;
            }


            const progress =
                getHeroProgress(
                    scrollY
                );


            const namesProgress =
                getNamesProgress(
                    progress
                );


            /*
             * Hurra + announcement leave the
             * scene as the names arrive.
             */
            const introOpacity =
                clamp(
                    1 -
                    (
                        progress /
                        namesStartProgress
                    ),
                    0,
                    1
                );


            heroIntro.style.opacity =
                introOpacity;


            /*
             * Names move upward into their
             * natural centered position.
             */
            const namesTranslate =
                120 *
                (1 - namesProgress);


            const namesScale =
                0.96 +
                (
                    0.04 *
                    namesProgress
                );


            heroNames.style.opacity =
                namesProgress;


            heroNames.style.transform =
                `translateY(${namesTranslate}px) scale(${namesScale})`;
        }


        // ----------------------------------------
        // FIND THE SCROLL POSITION WHERE THE
        // RENDERED NAMES BLOCK IS ACTUALLY CENTERED
        // ----------------------------------------

        function getNamesCenteredTarget() {

            const maxScroll =
                getHeroMaxScroll();


            if (maxScroll === 0) {
                return 0;
            }


            const previousOpacity =
                heroNames.style.opacity;


            const previousTransform =
                heroNames.style.transform;


            /*
             * The names block is absolutely positioned
             * inside the sticky viewport. Its base position
             * is centered, while JavaScript applies the
             * reveal transform.
             *
             * We therefore solve for the actual rendered
             * geometry instead of guessing a page %.
             *
             * Binary-search the progress value and
             * temporarily apply the transform belonging
             * to that candidate. getBoundingClientRect()
             * then gives us the real rendered center.
             */
            const viewportCenter =
                window.innerHeight / 2;


            let low =
                namesStartProgress;


            let high =
                namesStartProgress +
                namesAnimationLength;


            for (
                let i = 0;
                i < 24;
                i += 1
            ) {

                const progress =
                    (
                        low +
                        high
                    ) / 2;


                const namesProgress =
                    getNamesProgress(
                        progress
                    );


                const translate =
                    120 *
                    (
                        1 -
                        namesProgress
                    );


                const scale =
                    0.96 +
                    (
                        0.04 *
                        namesProgress
                    );


                heroNames.style.opacity =
                    namesProgress;


                heroNames.style.transform =
                    `translateY(${translate}px) scale(${scale})`;


                const rect =
                    heroNames.getBoundingClientRect();


                const center =
                    rect.top +
                    (
                        rect.height /
                        2
                    );


                if (
                    center >
                    viewportCenter
                ) {

                    low =
                        progress;

                } else {

                    high =
                        progress;
                }
            }


            const targetProgress =
                (
                    low +
                    high
                ) / 2;


            const target =
                targetProgress *
                maxScroll;


            heroNames.style.opacity =
                previousOpacity;


            heroNames.style.transform =
                previousTransform;


            return clamp(
                target,
                0,
                maxScroll
            );
        }


        // ----------------------------------------
        // AUTOMATIC SCROLL
        // ----------------------------------------

        function cancelAutomaticScroll() {

            if (
                autoScrollFrame !== null
            ) {

                cancelAnimationFrame(
                    autoScrollFrame
                );

                autoScrollFrame =
                    null;
            }


            if (
                autoScrollTimeout !== null
            ) {

                clearTimeout(
                    autoScrollTimeout
                );

                autoScrollTimeout =
                    null;
            }
        }


        function scrollToNames() {

            if (
                autoScrollStarted ||
                userHasLeftTop ||
                window.scrollY !== 0 ||
                isReducedMotion()
            ) {
                return;
            }


            const target =
                getNamesCenteredTarget();


            const start =
                window.scrollY;


            const distance =
                target -
                start;


            if (
                Math.abs(distance) < 1
            ) {

                renderHero(target);

                return;
            }


            autoScrollStarted =
                true;


            const html =
                document.documentElement;


            const previousScrollBehavior =
                html.style.scrollBehavior;


            /*
             * The stylesheet has global smooth
             * scrolling. Disable it temporarily so
             * our five-second easing is the only
             * scroll animation.
             */
            html.style.scrollBehavior =
                "auto";


            const startTime =
                performance.now();


            function easeInOutCubic(t) {

                return t < 0.5
                    ? 4 * t * t * t
                    : 1 -
                        (
                            Math.pow(
                                -2 * t + 2,
                                3
                            ) /
                            2
                        );
            }


            function finish() {

                if (
                    autoScrollFrame !== null
                ) {

                    cancelAnimationFrame(
                        autoScrollFrame
                    );

                    autoScrollFrame =
                        null;
                }


                html.style.scrollBehavior =
                    previousScrollBehavior;


                renderHero();
            }


            function step(now) {

                /*
                 * A real user interaction can
                 * interrupt the animation.
                 */
                if (userHasLeftTop) {

                    finish();

                    return;
                }


                const progress =
                    clamp(
                        (
                            now -
                            startTime
                        ) /
                        automaticScrollDuration,
                        0,
                        1
                    );


                const eased =
                    easeInOutCubic(
                        progress
                    );


                const current =
                    start +
                    (
                        distance *
                        eased
                    );


                window.scrollTo({
                    top: current,
                    left: 0,
                    behavior: "auto"
                });


                if (
                    progress < 1
                ) {

                    autoScrollFrame =
                        requestAnimationFrame(
                            step
                        );

                    return;
                }


                /*
                 * Force the exact endpoint.
                 */
                window.scrollTo({
                    top: target,
                    left: 0,
                    behavior: "auto"
                });


                finish();
            }


            autoScrollFrame =
                requestAnimationFrame(
                    step
                );
        }


        function scheduleAutomaticScroll() {

            if (
                autoScrollScheduled ||
                autoScrollStarted ||
                userHasLeftTop ||
                isReducedMotion()
            ) {
                return;
            }


            autoScrollScheduled =
                true;


            autoScrollTimeout =
                window.setTimeout(
                    () => {

                        autoScrollTimeout =
                            null;


                        if (
                            !userHasLeftTop &&
                            window.scrollY === 0 &&
                            !isReducedMotion()
                        ) {

                            scrollToNames();
                        }

                    },
                    automaticScrollDelay
                );
        }


        // ----------------------------------------
        // USER SCROLL / INPUT
        // ----------------------------------------

        function cancelForUserInteraction() {

            if (autoScrollStarted) {

                userHasLeftTop =
                    true;

                cancelAutomaticScroll();

                return;
            }


            if (
                window.scrollY > 0
            ) {

                userHasLeftTop =
                    true;

                cancelAutomaticScroll();
            }
        }


        renderHero();


        window.addEventListener(
            "scroll",
            () => {

                /*
                 * Programmatic scrolling is allowed
                 * while autoScrollStarted is true.
                 *
                 * Actual manual scrolling before the
                 * automatic sequence begins permanently
                 * cancels it.
                 */
                if (
                    !autoScrollStarted &&
                    window.scrollY > 0
                ) {

                    userHasLeftTop =
                        true;

                    cancelAutomaticScroll();
                }


                renderHero();
            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            () => {

                renderHero();
            }
        );


        /*
         * If the visitor interacts while the
         * automatic scroll is running, stop it.
         */
        [
            "wheel",
            "touchstart",
            "pointerdown",
            "keydown"
        ].forEach(
            eventName => {

                window.addEventListener(
                    eventName,
                    cancelForUserInteraction,
                    {
                        passive:
                            eventName !==
                            "keydown"
                    }
                );

            }
        );


        // ----------------------------------------
        // ANNOUNCEMENT COMPLETION
        // ----------------------------------------

        /*
         * The automatic sequence starts only
         * after the actual CSS animation finishes.
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
                    Vigseln är drop-in från kl. 11:00.
                    Vi vet inte exakt när det blir vår tur,
                    men någon gång från 11 och framåt händer det!
                `,


                plats: `
                    <strong>Vigsel:</strong> Masthuggskyrkan
                    <br>
                    <strong>Fest:</strong> Götaverksgatan
                `,


                kladsel: `
                    <strong>Kavaj</strong> – gärna lite nyårsglitter! ✨
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
