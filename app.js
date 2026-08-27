const audioUpload = document.getElementById("audioUpload");
const audioPlayer = document.getElementById("audioPlayer");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

const playButton = document.querySelector(".play-btn");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");

const timeElements = document.querySelectorAll(".time span");
const volumeControl = document.querySelector(".volume input");


// ===============================
// IndexedDB Setup
// ===============================

let db;

const request = indexedDB.open("MyMusicPlayerDB", 1);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    if (!db.objectStoreNames.contains("songs")) {

        db.createObjectStore("songs", {
            keyPath: "id",
            autoIncrement: true
        });

    }
};

request.onsuccess = function (event) {

    db = event.target.result;

    console.log("Music database ready");

};

request.onerror = function () {

    console.error("Database error");

};


// ===============================
// Upload Music
// ===============================

audioUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    const song = {

        name: file.name,

        type: file.type,

        audio: file,

        addedAt: Date.now()

    };


    const transaction = db.transaction(
        ["songs"],
        "readwrite"
    );

    const store = transaction.objectStore("songs");

    store.add(song);


    transaction.oncomplete = function () {

        console.log("Song saved offline:", file.name);

        loadSong(song);

    };

});


// ===============================
// Load Song
// ===============================

function loadSong(song) {

    const audioURL = URL.createObjectURL(song.audio);

    audioPlayer.src = audioURL;

    songTitle.textContent = song.name;

    artistName.textContent = "My Library";

    audioPlayer.load();

}


// ===============================
// Play / Pause
// ===============================

playButton.addEventListener("click", function () {

    if (!audioPlayer.src) {
        return;
    }

    if (audioPlayer.paused) {

        audioPlayer.play();

        playButton.textContent = "❚❚";

    } else {

        audioPlayer.pause();

        playButton.textContent = "▶";

    }

});


// ===============================
// Progress
// ===============================

audioPlayer.addEventListener("timeupdate", function () {

    if (!audioPlayer.duration) {
        return;
    }

    const percentage =
        (audioPlayer.currentTime /
        audioPlayer.duration) * 100;

    progress.style.width = percentage + "%";


    timeElements[0].textContent =
        formatTime(audioPlayer.currentTime);

    timeElements[1].textContent =
        formatTime(audioPlayer.duration);

});


// ===============================
// Seek
// ===============================

progressBar.addEventListener("click", function (event) {

    if (!audioPlayer.duration) {
        return;
    }

    const width = this.clientWidth;

    const clickX = event.offsetX;

    audioPlayer.currentTime =
        (clickX / width) * audioPlayer.duration;

});


// ===============================
// Volume
// ===============================

volumeControl.addEventListener("input", function () {

    audioPlayer.volume =
        this.value / 100;

});


// ===============================
// Song End
// ===============================

audioPlayer.addEventListener("ended", function () {

    playButton.textContent = "▶";

});


// ===============================
// Time Format
// ===============================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return minutes + ":" +
        String(remainingSeconds).padStart(2, "0");

        }
