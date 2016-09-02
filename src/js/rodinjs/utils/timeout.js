export let timeout = (cb, delay) => {
    let timer = setTimeout(() => {
        cb();
        clearTimeout(timer);
    }, delay);
};