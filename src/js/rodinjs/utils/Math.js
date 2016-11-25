Math.randomIntIn = (a = 0, b = 1) => {
    return Math.floor(Math.random()*(b-a+1)+a);
};

Math.randomFloatIn = (a = 0, b = 1) => {
    return Math.random()*(b-a)+a;
};

Math.secondsToH_MM_SS = (length, separator = ":") => {
    var length = Math.round(length);
    var hours = Math.floor(length / 3600);
    length %= 3600;
    var minutes = Math.floor(length / 60);
    if(minutes<10 && hours!=0) {
        minutes = "0"+minutes;
    }
    var seconds = length % 60;

    if(seconds<10) {
        seconds = "0"+seconds;
    }
    return ((hours!=0 ? hours+separator:"")+minutes+separator+seconds);
};