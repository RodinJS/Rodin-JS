export let timeout = (cb = function () {
}, delay = 1000) => {
    let timer = setTimeout(() => {
        cb();
        clearTimeout(timer);
    }, delay);
    return timer;
};