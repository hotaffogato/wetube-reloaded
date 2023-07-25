const startBtn = document.getElementById("startBtn")
const video = document.getElementById("preview")

const handleStart = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
    });
    console.log(stream)

    video.srcObject = stream;
    video.play();

    try {

        /* use the stream */
    } catch (err) {

        /* handle the error */
    }
}

startBtn.addEventListener("click", handleStart)