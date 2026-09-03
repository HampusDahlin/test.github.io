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
                (1000 * 60 * 60 * 24))
            /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (distance %
                (1000 * 60 * 60))
            /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (distance %
                (1000 * 60))
            /
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


        // ==================================
        // USER SCROLL DETECTION
        // ==================================

        let userHasScrolled = false;

        let automaticScrollStarted = false;


        window.addEventListener(
            "scroll",
            () => {

                /*
                 * Once the visitor has manually
                 * started scrolling, we don't want
                 * the automatic scroll to interfere.
                 */

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


        // ==================================
        // HERO ANIMATION
        // ==================================

        function updateHero() {

            const heroHeight =
                hero.offsetHeight;

            const viewportHeight =
                window.innerHeight;


            const maxScroll =
                Math.max(
                    1,
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
                scroll /
                maxScroll;


            // ==================================
            // INTRO FADES OUT
            // ==================================

            const introFade =
                Math.max(
                    0,
                    1 -
                    (progress * 4)
                );


            heroIntro.style.opacity =
                introFade;


            // ==================================
            // NAMES FADE IN
            // ==================================

            /*
             * Names begin appearing after
             * approximately 18% of the
             * hero scroll.
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


            // ==================================
            // SCROLL LINK
            // ==================================

            if (scrollLink) {

                scrollLink.style.opacity =
                    Math.max(
                        0,
                        1 -
                        (progress * 5)
                    );

            }

        }


        // ==================================
        // INITIAL HERO STATE
        // ==================================

        updateHero();


        // ==================================
        // AUTOMATIC SCROLL
        // ==================================

        /*
         * Give the opening animation some time
         * to establish itself first.
         *
         * After 0.5 seconds, smoothly scroll
         * into the hero so the names begin
         * appearing.
         */

        setTimeout(
            () => {

                if (userHasScrolled) {
                    return;
                }


                automaticScrollStarted = true;


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
                 * 20% of the available hero
                 * scroll puts us just before
                 * the names begin appearing.
                 *
                 * This creates a natural transition
                 * from the announcement into the names.
                 */

                const targetScroll =
                    maxScroll * 0.22;


                window.scrollTo({

                    top: targetScroll,

                    behavior: "smooth"

                });

            },

            500
        );


        // ==================================
        // SCROLL LISTENER
        // ==================================

        window.addEventListener(
            "scroll",
            updateHero,
            {
                passive: true
            }
        );


        // ==================================
        // RESIZE LISTENER
        // ==================================

        window.addEventListener(
            "resize",
            updateHero
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
