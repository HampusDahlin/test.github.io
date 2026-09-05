// ========================================
// BRÖLLOPSDAGEN
// ========================================
//
// Datum: 30 december 2026
// Tid: Eftermiddag — mer information kommer senare
//
// Eftersom den exakta tiden ännu inte är
// bestämd räknar countdownen tills vidare
// mot början av den 30 december 2026.
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
        distance /
        (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        (
            distance %
            (1000 * 60 * 60 * 24)
        ) /
        (1000 * 60 * 60)
    );


    const minutes = Math.floor(
        (
            distance %
            (1000 * 60 * 60)
        ) /
        (1000 * 60)
    );


    const seconds = Math.floor(
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


            // Slow, deliberate scroll
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


        // ========================================
        // START AUTO SCROLL
        // ========================================
        //
        // Wait for "Vi ska gifta oss!"
        // to finish entering, then wait
        // another 450ms before scrolling.
        //

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


            // Fallback in case animationend
            // doesn't fire for some reason.

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
                    på eftermiddagen
                    den <strong>30 december 2026</strong>.
                    <br><br>
                    Mer information om exakt tid
                    kommer senare.
                `,


                plats: `
                    Vi kommer att vara i
                    <strong>Göteborg</strong>.
                    <br><br>
                    Lokal:
                    <strong>TBA</strong>.
                    <br><br>
                    Mer information kommer senare.
                `,


                kladsel: `
                    Klädkoden är
                    <strong>kavaj</strong>.
                    <br><br>
                    Vi ser fram emot att fira
                    tillsammans med er!
                `,


                osa: `
                    Du kan svara på vår inbjudan
                    senast
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
