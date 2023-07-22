const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumenRange = document.getElementById("volumen");
const currentTime = document.getElementById("currentTime")
const totalTime = document.getElementById("totalTime")
const timeline = document.getElementById("timeline")


let volumenValue = 0.5
video.volume = volumenValue

const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause"
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute"
    volumenRange.value = video.muted ? 0 : volumenValue
}

const handleVolumenChange = (event) => {
    const {
        target: { value }
    } = event;
    
    if(value == 0){
        muteBtn.innerText = "Unmute"
        video.muted = true;
    } else {
        muteBtn.innerText = "Mute"
        video.muted = false;
    }
    volumenValue = value;
    video.volume = value;
}


const formatTime = (sec) => { 
    return new Date( sec * 1000 ).toISOString().substring(14, 19);
}

const handleMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration)
}
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime)
}

const handleTimelineChange = (event) => {
    const {
        target: { value }
    } = event;
    video.currentTime = value;
}

playBtn.addEventListener("click", handlePlayClick)
muteBtn.addEventListener("click", handleMute)
volumenRange.addEventListener("input",handleVolumenChange)
video.addEventListener("loadedmetadata", handleMetaData)
video.addEventListener("timeupdate", handleTimeUpdate)
timeline.addEventListener("input", handleTimelineChange)
