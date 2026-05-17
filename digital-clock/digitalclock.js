const time = document.getElementById("time");
const timeformat = document.getElementById("timeformat");

function showTime() {
    const date = new Date();

    let hr = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    const meridiem = hr >= 12 ? "PM" : "AM";

    hr = hr % 12 || 12;

    const hourText = hr < 10 ? `0${hr}` : hr;
    const minuteText = mins < 10 ? `0${mins}` : mins;
    const secondText = secs < 10 ? `0${secs}` : secs;

    time.textContent = `${hourText} : ${minuteText} : ${secondText}`;
    timeformat.textContent = meridiem;
}

document.addEventListener("DOMContentLoaded", () => {
    showTime();
    setInterval(showTime, 1000);
});
