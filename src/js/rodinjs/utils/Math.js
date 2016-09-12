Math.randomIntIn = (a = 0, b = 1) => {
    return Math.floor(Math.random()*(b-a+1)+a);
};

Math.randomFloatIn = (a = 0, b = 1) => {
    return Math.random()*(b-a)+a;
};