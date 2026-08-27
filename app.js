const audioUpload = document.getElementById("audioUpload");
const audioPlayer = document.getElementById("audioPlayer");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

const playButton = document.querySelector(".play-btn");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");

const timeElements = document.querySelectorAll(".time span");

const volumeControl = document.querySelector(".volume input");


audioUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    const audioURL = URL.createObjectURL(file);

    audioPlayer.src = audioURL;

    songTitle.textContent = file.name;
    artistName.textContent = "My Library";

    audioPlayer.load();

});


playButton.addEventListener("click", function () {

    if (audioPlayer.paused) {

        audioPlayer.play();

        playButton.textContent = "❚❚";

    } else {

        audioPlayer.pause();

        playButton.textContent = "▶";

    }

});


audioPlayer.addEventListener("timeupdate", function () {

    if (!audioPlayer.duration) {
        return;
    }

    const percentage =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progress.style.width = percentage + "%";

    timeElements[0].textContent =
        formatTime(audioPlayer.currentTime);

    timeElements[1].textContent =
        formatTime(audioPlayer.duration);

});


progressBar.addEventListener("click", function (event) {

    if (!audioPlayer.duration) {
        return;
    }

    const width = this.clientWidth;

    const clickX = event.offsetX;

    const newTime =
        (clickX / width) * audioPlayer.duration;

    audioPlayer.currentTime = newTime;

});


volumeControl.addEventListener("input", function () {

    audioPlayer.volume = this.value / 100;

});


audioPlayer.addEventListener("ended", function () {

    playButton.textContent = "▶";

});


function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return minutes + ":" +
        String(remainingSeconds).padStart(2, "0");
    }
