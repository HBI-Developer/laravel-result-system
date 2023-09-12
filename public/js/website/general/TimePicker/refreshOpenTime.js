import diffrentFromNow from "../../GeneralFunctions/TimeFunctions/diffrentFromNow.js";

const refreshOpenTime = (_) => {
    let { year, month, day, hour, minute } = sessionStorage,
        current = new Date();

    year = !isNaN(parseInt(year)) ? parseInt(year) : current.getFullYear();

    month = !isNaN(parseInt(month)) ? parseInt(month) : current.getMonth() + 1;

    day = !isNaN(parseInt(day)) ? parseInt(day) : current.getDate();

    hour = !isNaN(parseInt(hour)) ? parseInt(hour) : "00";

    minute = !isNaN(parseInt(minute)) ? parseInt(minute) : "00";

    let openTime = new Date(year, month, day, hour, minute).getTime(),
        diffrent = diffrentFromNow(openTime, true),
        timeFormat = `${diffrent[0]}:${diffrent[1]}:${diffrent[2]}:${diffrent[3]}`;

    $(".time-picker .until-open > .counter").text(timeFormat);

    setTimeout((_) => {
        if (updatingTime && diffrent !== 0) {
            refreshOpenTime();
        } else {
            updatingTime = false;
        }
    }, 0);
};

export default refreshOpenTime;
