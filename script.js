"use strict";


/* ==================================================
   CONFIGURATION
================================================== */

const WEDDING_DATE =
    "2026-12-30T00:00:00";

const HERO_NAMES_START =
    0.18;

const HERO_NAMES_DURATION =
    0.35;

const AUTO_SCROLL_DELAY =
    450;

const AUTO_SCROLL_DURATION =
    5000;


/* ==================================================
   DOM
================================================== */

const elements = {
    hero:
        document.querySelector(".hero"),

    heroIntro:
        document.querySelector(".hero-intro"),

    heroNames:
        document.getElementById("heroNames"),

    heroAnnouncement:
        document.getElementById(
            "heroAnnouncement"
        ),

    days:
        document.getElementById("days"),

    hours:
        document.getElementById("hours"),

    minutes:
        document.getElementById("minutes"),

    seconds:
        document.getElementById("seconds"),

    assistantButton:
        document.getElementById(
            "assistantButton"
        ),

    assistantCard:
        document.getElementById(
            "assistantCard"
        ),

    assistantClose:
        document.getElementById(
            "assistantClose"
        ),

    assistantMessage:
        document.getElementById(
            "assistantMessage"
        )
};


/* ==================================================
   HELPERS
================================================== */

function clamp(value, min = 0, max = 1) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}


function padNumber(value) {
    return String(value).padStart(2, "0");
}


/* ==================================================
   COUNTDOWN
================================================== */

const weddingTimestamp =
    new Date(WEDDING_DATE).getTime();


function updateCountdown() {

    const now =
        Date.now();

    const remaining =
        weddingTimestamp - now;


    if (remaining <= 0) {

        elements.days.textContent = "00";
        elements.hours.textContent = "00";
        elements.minutes.textContent = "00";
        elements.seconds.textContent = "00";

        return;
    }


    const days =
        Math.floor(
            remaining /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                remaining %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                remaining %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                remaining %
                (1000 * 60)
            ) /
            1000
        );


    elements.days.textContent =
        padNumber(days);

    elements.hours.textContent =
        padNumber(hours);

    elements.minutes.textContent =
        padNumber(minutes);

    elements.seconds.textContent =
        padNumber(seconds);
}


function startCountdown() {

    updateCountdown();

    window.setInterval(
        updateCountdown,
        1000
    );
}


/* ==================================================
   HERO SCROLL ANIMATION
================================================== */

let userHasLeftTop =
    window.scrollY > 0;

let autoScrollScheduled = false;

let autoScrollStarted = false;


function getHeroMaxScroll() {

    if (!elements.hero) {
        return 0;
    }


    return Math.max(
        0,
        elements.hero.offsetHeight -
        window.innerHeight
    );
}


function getHeroProgress() {

    const maxScroll =
        getHeroMaxScroll();


    if (maxScroll === 0) {
        return 0;
    }


    return clamp(
        window.scrollY / maxScroll
    );
}


function updateHero() {

    if (
        !elements.hero ||
        !elements.heroIntro ||
        !elements.heroNames
    ) {
        return;
    }


    const progress =
        getHeroProgress();


    /*
     * Fade the opening message away as
     * the visitor moves through the hero.
     */
    const introOpacity =
        clamp(
            1 - progress * 4
        );


    elements.heroIntro.style.opacity =
        introOpacity;


    /*
     * Reveal the names based on scroll progress.
     *
     * These values control the visual entrance only.
     * They are NOT used to calculate the automatic
     * scroll destination.
     */
    const namesProgress =
        clamp(
            (
                progress -
                HERO_NAMES_START
            ) /
            HERO_NAMES_DURATION
        );


    const translateY =
        100 -
        (namesProgress * 100);


    const scale =
        0.96 +
        (namesProgress * 0.04);


    elements.heroNames.style.opacity =
        namesProgress;


    elements.heroNames.style.transform =
        `translateY(${translateY}px) scale(${scale})`;
}


/* ==================================================
   AUTO-SCROLL TARGET
================================================== */

function getNamesCenteredTarget() {

    if (
        !elements.hero ||
        !elements.heroNames
    ) {
        return null;
    }


    /*
     * The names element is absolutely positioned inside
     * the sticky hero viewport.
     *
     * To find the correct target, temporarily place it
     * in its final visual state and measure the actual
     * rendered rectangle.
     */
    const previousOpacity =
        elements.heroNames.style.opacity;

    const previousTransform =
        elements.heroNames.style.transform;


    elements.heroNames.style.opacity =
        "1";

    elements.heroNames.style.transform =
        "translateY(0) scale(1)";


    const rect =
        elements.heroNames.getBoundingClientRect();


    const elementCenter =
        rect.top +
        (rect.height / 2);

    const viewportCenter =
        window.innerHeight / 2;


    const target =
        window.scrollY +
        elementCenter -
        viewportCenter;


    elements.heroNames.style.opacity =
        previousOpacity;

    elements.heroNames.style.transform =
        previousTransform;


    return clampScrollTarget(target);
}


function clampScrollTarget(target) {

    const maxScroll =
        getHeroMaxScroll();


    return Math.max(
        0,
        Math.min(
            target,
            maxScroll
        )
    );
}


/* ==================================================
   AUTO-SCROLL
================================================== */

function easeInOutCubic(progress) {

    if (progress < 0.5) {

        return (
            4 *
            progress *
            progress *
            progress
        );
    }


    return (
        1 -
        (
            Math.pow(
                -2 * progress + 2,
                3
            ) / 2
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
     * The stylesheet uses smooth scrolling globally.
     * Disable it temporarily so it cannot interfere
     * with our own animation.
     */
    html.style.scrollBehavior =
        "auto";


    const start =
        window.scrollY;

    const distance =
        target - start;

    const startTime =
        performance.now();


    function finish() {

        window.scrollTo({
            top: target,
            left: 0,
            behavior: "auto"
        });


        html.style.scrollBehavior =
            previousScrollBehavior;


        updateHero();
    }


    function animate(now) {

        /*
         * If the visitor interacts with the page,
         * permanently cancel the automatic scroll.
         */
        if (userHasLeftTop) {

            html.style.scrollBehavior =
                previousScrollBehavior;

            return;
        }


        const elapsed =
            now - startTime;


        const progress =
            clamp(
                elapsed /
                AUTO_SCROLL_DURATION
            );


        const eased =
            easeInOutCubic(
                progress
            );


        const currentPosition =
            start +
            distance * eased;


        window.scrollTo({
            top: currentPosition,
            left: 0,
            behavior: "auto"
        });


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

            return;
        }


        finish();
    }


    requestAnimationFrame(
        animate
    );
}


function scheduleAutoScroll() {

    if (
        autoScrollScheduled ||
        autoScrollStarted ||
        userHasLeftTop
    ) {
        return;
    }


    autoScrollScheduled = true;


    window.setTimeout(
        () => {

            if (
                !userHasLeftTop &&
                window.scrollY === 0
            ) {
                scrollToNames();
            }

        },
        AUTO_SCROLL_DELAY
    );
}


/* ==================================================
   HERO EVENTS
================================================== */

function setupHero() {

    if (
        !elements.hero ||
        !elements.heroNames
    ) {
        return;
    }


    updateHero();


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 0) {
                userHasLeftTop = true;
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


    if (elements.heroAnnouncement) {

        elements.heroAnnouncement.addEventListener(
            "animationend",
            event => {

                if (
                    event.animationName ===
                    "announcement-in"
                ) {
                    scheduleAutoScroll();
                }

            }
        );


        /*
         * Fallback in case animationend is not fired.
         */
        window.setTimeout(
            scheduleAutoScroll,
            3000
        );
    }
}


/* ==================================================
   WEDDING ASSISTANT
================================================== */

const assistantAnswers = {

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


function setAssistantOpen(isOpen) {

    if (
        !elements.assistantCard ||
        !elements.assistantButton
    ) {
        return;
    }


    elements.assistantCard.classList.toggle(
        "open",
        isOpen
    );


    elements.assistantCard.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );


    elements.assistantButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}


function setupAssistant() {

    if (
        !elements.assistantButton ||
        !elements.assistantCard ||
        !elements.assistantClose ||
        !elements.assistantMessage
    ) {
        return;
    }


    elements.assistantButton.addEventListener(
        "click",
        () => {

            const isOpen =
                elements.assistantCard.classList.contains(
                    "open"
                );

            setAssistantOpen(!isOpen);
        }
    );


    elements.assistantClose.addEventListener(
        "click",
        () => {
            setAssistantOpen(false);
        }
    );


    elements.assistantCard
        .querySelectorAll(
            "[data-answer]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const answer =
                        assistantAnswers[
                            button.dataset.answer
                        ];


                    if (!answer) {
                        return;
                    }


                    elements.assistantMessage.innerHTML =
                        answer;
                }
            );
        });


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {
                setAssistantOpen(false);
            }
        }
    );
}


/* ==================================================
   INITIALIZE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startCountdown();

        setupHero();

        setupAssistant();

    }
);
