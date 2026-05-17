let TimerDisplay = document.querySelector(".timer-display");
let stopBtn = document.getElementById("stopBtn");
let starBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");

let msecs = 00;
let secs = 00;
let mins = 00;

let timerId = null;


    starBtn.addEventListener("click",function(){
        if(timerId !== null){
            clearInterval(timerId);
        }
      timerId =  setInterval(startTimer,10)
    })

    stopBtn.addEventListener("click",()=>{
        clearInterval(timerId);
    })
    resetBtn.addEventListener('click',function(){
        clearInterval(timerId);
        TimerDisplay.innerHTML = `00:00:00`;
        msecs = secs = mins = 0;
    })

    function startTimer(){
        msecs++;
        if(msecs == 100){
            msecs == 0;
            secs++;
            if(secs == 60){
                secs=0;
                mins = mins++;
                
            }
        }
let msecsString = msecs < 10 ? `0${msecs}`:msecs;
let secsString = secs<10?`0${secs}`:secs;
let minsString = mins <10 ? `0${mins}`: mins;

TimerDisplay.innerHTML = `${minsString} : ${secsString} : ${msecsString}`;
    }
