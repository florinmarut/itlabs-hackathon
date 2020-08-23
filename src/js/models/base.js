export const domStrings = {
    navBtn: '.nav__button',
    navMenu: '.nav__menu',
    accordion: '.accordion',
    accordionBar: '.accordion__bar',
    accordionContent: '.accordion__content',
    accordionItem: '.accordion__item',
    circuitCanvas: '.circuit__canvas',
    circuitBackground: '.circuit__background'
}

export const resizeAwait = (callback) => {
    var rtime;
    var timeout = false;
    var delta = 200;

    window.addEventListener('resize', () => {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    const resizeend = () => {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            callback();
        }               
    }
}