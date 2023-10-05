class ViewportObserver {
    constructor(selector) {
        const elements = document.querySelectorAll(selector);
        const elementsArray = Array.from(elements);
        if (elementsArray.length === 0) {
            throw new Error('No elements found');
        } else {
            this.#init(elementsArray);
        }
    }

    #init(elements = []) {
        window.addEventListener('scroll', () => {
            elements.forEach(element => {
                const { top } = element.getBoundingClientRect();
                let point = innerHeight - top

                if (point <= 0) {
                    if (!element.classList.contains('idle')) {
                        this.#onScroll(element, 0);
                        element.classList.add('idle');
                        this.#onIdle(element, 0);
                    }
                } else if (point >= innerHeight) {
                    if (!element.classList.contains('idle')) {
                        this.#onScroll(element, innerHeight);
                        element.classList.add('idle');
                        this.#onIdle(element, innerHeight);
                    }
                } else {
                    element.classList.remove('idle');
                    this.#onScroll(element, point);
                }
            })
        });
    }

    #onScroll(element, point) {
        const percentag = (point / innerHeight) * 100;
        const event = new CustomEvent('vo.run', {
            detail: {
                target: element,
                point: percentag,
            }
        });

        element.dispatchEvent(event);
    }

    #onIdle(element, point) {
        const percentag = (point / innerHeight) * 100;
        const event = new CustomEvent('vo.idle', {
            detail: {
                target: element,
                point: percentag,
            }
        });

        element.dispatchEvent(event);
    }
}


/**
 * Output 
 */
new ViewportObserver('#one');

const one = document.querySelector('#one');
// const two = document.querySelector('.two');



function opacityHandler(target, point) {
    const opacity = (point / 50) * 1;

    if (opacity <= 0) {
        target.style.opacity = 0;
    } else if (opacity >= 1) {
        target.style.opacity = 1;
    } else {
        target.style.opacity = opacity;
    }
}


function transformHandler(target, point) {
    const roate = (point / 100) * 360;
    if (roate <= 0) {
        target.animate({ transform: `rotate(0deg)` }, {
            duration: 200,
            fill: 'forwards'
        })
    } else if (roate >= 360) {
        target.animate({ transform: `rotate(360deg)` }, {
            duration: 200,
            fill: 'forwards'
        })
    } else {
        target.animate({ transform: `rotate(${roate}deg)` }, {
            duration: 200,
            fill: 'forwards'
        })
    }
}


one.addEventListener('vo.run', (ev) => {
    const { target, point } = ev.detail;
    opacityHandler(target, point);
    transformHandler(target, point);
})


// two.addEventListener('vo.run', (ev) => {
//     const { target, point } = ev.detail;
//     opacityHandler(target, point);
//     transformHandler(target, point);
// })