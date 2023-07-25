const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const playBtnIcon = playBtn.querySelector("i");
const muteBtnIcon = muteBtn.querySelector("i");
const volumenRange = document.getElementById("volumen");
const currentTime = document.getElementById("currentTime")
const totalTime = document.getElementById("totalTime")
const timeline = document.getElementById("timelinebar")
const fullScreenBtn = document.getElementById("fullScreen")
const fullScreenBtnIcon = fullScreenBtn.querySelector("i")
const videoContainer = document.getElementById("videoContainer")
const videoControls = document.getElementById("videoControls")

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumenValue = 0.5;
video.volume = volumenValue
playBtnIcon.classList = "fas fa-play"
muteBtnIcon.classList = "fas fa-volume-up"
fullScreenBtnIcon.classList = "fas fa-expand"

const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
}

const handlePlaySpace = (event) => {
    event.preventDefault();
    if(event.keyCode===32){
        if(video.paused){
            video.play();
        } else {
            video.pause();
        }
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up"
    volumenRange.value = video.muted ? 0 : volumenValue
}

const handleVolumenChange = (event) => {
    const {
        target: { value }
    } = event;
    
    if(value == 0){
        muteBtnIcon.classList = "fas fa-volume-mute"
        video.muted = true;
    } else {
        muteBtnIcon.classList = "fas fa-volume-up"
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

const handleFullScreen = (e) => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen()
    }
    fullScreenBtnIcon.classList = fullscreen ? "fas fa-expand" : "fas fa-compress";
}

const hideControls = () => {
    videoControls.classList.remove("showing")
}

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout)
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout)
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing")
    controlsMovementTimeout = setTimeout(hideControls, 2000)
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(()=>{
        videoControls.classList.remove("showing")
    },2000)
}

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`,{
        method:"POST",
    })
}

playBtn.addEventListener("click", handlePlayClick)
video.addEventListener("click", handlePlayClick)
document.addEventListener("keyup", handlePlaySpace)
muteBtn.addEventListener("click", handleMute)
volumenRange.addEventListener("input",handleVolumenChange)
video.addEventListener("loadedmetadata", handleMetaData)
video.addEventListener("timeupdate", handleTimeUpdate)
timeline.addEventListener("input", handleTimelineChange)
fullScreenBtn.addEventListener("click", handleFullScreen)
videoContainer.addEventListener("mousemove", handleMouseMove)
videoContainer.addEventListener("mouseleave", handleMouseLeave)
video.addEventListener("ended", handleEnded )