// ========================================
// BRÖLLOPSDAGEN
// ========================================

const weddingDate = new Date(
    "2027-12-31T15:00:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

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
// HERO
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

        const scrollLink =
            document.getElementById(
                "scrollLink"
            );


        // ========================================
        // AUTOMATIC HERO SCROLL
        // ========================================

        let autoScrollStarted = false;


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

            if (
                autoScrollStarted ||
                !hero ||
                !heroNames
            ) {
                return;
            }


            autoScrollStarted = true;


            const namesRect =
                heroNames.getBoundingClientRect();


            const currentScroll =
                window.scrollY;


            /*
             * Put the names roughly in the
             * vertical centre of the screen.
             *
             * This uses the browser's REAL page
             * scroll — there is no transform or
             * second scrolling system involved.
             */

            const namesCenter =
                namesRect.top +
                (
                    namesRect.height / 2
                );


            const targetScroll =
                currentScroll +
                namesCenter -
                (
                    window.innerHeight / 2
                );


            const maxScroll =
                Math.max(
                    0,
                    document.documentElement
                        .scrollHeight -
                    window.innerHeight
                );


            const finalTarget =
                Math.max(
                    0,
                    Math.min(
                        targetScroll,
                        maxScroll
                    )
                );


            const startTime =
                performance.now();


            const duration = 5000;


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


                const eased =
                    easeInOutCubic(
                        progress
                    );


                const position =
                    currentScroll +
                    (
                        finalTarget -
                        currentScroll
                    ) *
                    eased;


                window.scrollTo(
                    0,
                    position
                );


                if (progress < 1) {

                    requestAnimationFrame(
                        animateScroll
                    );

                } else {

                    window.scrollTo(
                        0,
                        finalTarget
                    );
                }
            }


            requestAnimationFrame(
                animateScroll
            );
        }


        /*
         * Start the automatic scroll after
         * "Vi ska gifta oss!" has finished.
         */

        if (heroAnnouncement) {

            heroAnnouncement.addEventListener(
                "animationend",
                (event) => {

                    if (
                        event.animationName ===
                        "announcementIn"
                    ) {

                        setTimeout(
                            scrollToNames,
                            450
                        );
                    }
                }
            );


            /*
             * Fallback in case animationend
             * isn't fired for some reason.
             */

            setTimeout(
                () => {

                    if (!autoScrollStarted) {
                        scrollToNames();
                    }

                },
                3000
            );
        }


        // ========================================
        // SCROLL LINK
        // ========================================

        function updateScrollLink() {

            if (!scrollLink) {
                return;
            }


            const fadeDistance =
                window.innerHeight * 0.35;


            const opacity =
                Math.max(
                    0,
                    1 -
                    (
                        window.scrollY /
                        fadeDistance
                    )
                );


            scrollLink.style.opacity =
                opacity;
        }


        updateScrollLink();


        window.addEventListener(
            "scroll",
            updateScrollLink,
            { passive: true }
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
