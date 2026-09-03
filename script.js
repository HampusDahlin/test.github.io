/* ==================================================
   BRÖLLOPSDAGEN
================================================== */

/*
   Wedding date:
   31 December 2027 at 15:00
*/

const weddingDate = new Date(
    "2027-12-31T15:00:00"
).getTime();


/* ==================================================
   COUNTDOWN
================================================== */

function updateCountdown() {

    const now = new Date().getTime();

    const distance =
        weddingDate - now;


    /*
       Wedding day has arrived.
    */

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


/* ==================================================
   HERO SCROLL ANIMATION
================================================== */

/*
   The hero has a height of 180vh.

   While the visitor scrolls through that space,
   the content itself stays in place.

   Scroll progression:

   0%
   └── HURRA + VI SKA GIFTA OSS

   ~15%
   └── Intro begins fading

   ~15–50%
   └── NAME & NAME enters

   ~50–100%
   └── NAME & NAME + DATE remain visible
*/


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


        /*
           Safety check.
        */

        if (
            !hero ||
            !heroIntro ||
            !heroNames
        ) {

            console.error(
                "Hero elements could not be found."
            );

            return;
        }


        let ticking = false;


        function clamp(
            value,
            min,
            max
        ) {

            return Math.min(
                Math.max(
                    value,
                    min
                ),
                max
            );
        }


        function updateHero() {

            /*
               How much scrollable space exists
               inside the hero?
            */

            const heroHeight =
                hero.offsetHeight;


            const viewportHeight =
                window.innerHeight;


            const scrollDistance =
                Math.max(
                    heroHeight -
                    viewportHeight,
                    1
                );


            /*
               Position relative to the beginning
               of the hero.
            */

            const heroTop =
                hero.getBoundingClientRect().top;


            const heroScroll =
                clamp(
                    -heroTop,
                    0,
                    scrollDistance
                );


            /*
               Convert to 0 → 1.
            */

            const progress =
                heroScroll /
                scrollDistance;


            /* ======================================
               INTRO
            ====================================== */

            /*
               Intro stays fully visible initially.

               It then fades away between roughly
               5% and 25% of the hero scroll.
            */

            const introProgress =
                clamp(
                    (
                        progress - 0.05
                    ) / 0.20,
                    0,
                    1
                );


            const introOpacity =
                1 - introProgress;


            heroIntro.style.opacity =
                introOpacity;


            /* ======================================
               NAMES
            ====================================== */

            /*
               Names begin entering at around 15%.

               They are fully visible by around 50%.
            */

            const namesProgress =
                clamp(
                    (
                        progress - 0.15
                    ) / 0.35,
                    0,
                    1
                );


            const namesOpacity =
                namesProgress;


            const namesTranslate =
                100 -
                (
                    namesProgress * 100
                );


            const namesScale =
                0.96 +
                (
                    namesProgress * 0.04
                );


            heroNames.style.opacity =
                namesOpacity;


            heroNames.style.transform =
                `
                translateY(${namesTranslate}px)
                scale(${namesScale})
                `;


            /* ======================================
               SCROLL LINK
            ====================================== */

            /*
               The "Välkommen" hint disappears
               shortly after the visitor starts scrolling.
            */

            if (scrollLink) {

                const scrollOpacity =
                    clamp(
                        1 -
                        (
                            progress * 6
                        ),
                        0,
                        1
                    );


                scrollLink.style.opacity =
                    scrollOpacity;
            }


            ticking = false;
        }


        /*
           Use requestAnimationFrame so the scroll
           handler doesn't constantly force layout
           updates.
        */

        function requestHeroUpdate() {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHero
                );

                ticking = true;
            }
        }


        /*
           Initial state.
        */

        updateHero();


        /*
           Scroll.
        */

        window.addEventListener(
            "scroll",
            requestHeroUpdate,
            {
                passive: true
            }
        );


        /*
           Resize.
        */

        window.addEventListener(
            "resize",
            requestHeroUpdate
        );


        /* ==========================================
           WEDDING ASSISTANT
        ========================================== */

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


            /*
               Open / close assistant.
            */

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


            /*
               Assistant answers.
            */

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


            /*
               Assistant buttons.
            */

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
