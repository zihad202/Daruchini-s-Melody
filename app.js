const audioUpload =
    document.getElementById("audioUpload");

const coverUpload =
    document.getElementById("coverUpload");

const saveMusic =
    document.getElementById("saveMusic");

const audioPlayer =
    document.getElementById("audioPlayer");

const songTitle =
    document.getElementById("songTitle");

const artistName =
    document.getElementById("artistName");

const coverImage =
    document.getElementById("coverImage");
const cover =
    document.querySelector(".cover");
const musicIcon =
    document.querySelector(".music-icon");

const playButton =
    document.querySelector(".play-btn");
const previousButton =
    document.getElementById("previousBtn");
const sleepTimer =
    document.getElementById("sleepTimer");

let sleepTimerID = null;
const nextButton =
    document.getElementById("nextBtn");
const repeatButton =
    document.getElementById("repeatBtn");

const shuffleButton =
    document.getElementById("shuffleBtn");
const progressBar =
    document.querySelector(".progress-bar");

const progress =
    document.querySelector(".progress");

const timeElements =
    document.querySelectorAll(".time span");

const volumeControl =
    document.querySelector(".volume input");

const songList =
    document.getElementById("songList");
const searchInput =
    document.getElementById("searchInput");

const favoriteFilter =
    document.getElementById("favoriteFilter");

let showFavoritesOnly = false;
const songCount =
    document.getElementById("songCount");


let savedSongs = [];

let db;

let currentSongId = null;
let repeatMode = "off";

let shuffleMode = false;
let currentAudioURL = null;

let currentCoverURL = null;

let currentSongIndex = -1;

let playbackQueue = [];
/* ===============================
   Supported Audio Formats
=============================== */

const supportedExtensions = [

    "mp3",
    "m4a",
    "wav",
    "ogg",
    "aac",
    "webm"

];


function getFileExtension(fileName) {

    return fileName
        .split(".")
        .pop()
        .toLowerCase();

}


/* ===============================
   IndexedDB Setup
=============================== */

const request =
    indexedDB.open(
        "MyMusicPlayerDB",
        1
    );


request.onupgradeneeded =
    function (event) {

        db =
            event.target.result;


        if (
            !db.objectStoreNames.contains(
                "songs"
            )
        ) {

            db.createObjectStore(
                "songs",
                {
                    keyPath: "id",
                    autoIncrement: true
                }
            );

        }

    };


request.onsuccess =
    function (event) {

        db =
            event.target.result;


        console.log(
            "Music database ready"
        );


        loadSavedSongs();

    };


request.onerror =
    function () {

        console.error(
            "Database error"
        );

        alert(
            "Unable to open music storage."
        );

    };


/* ===============================
   Upload / Save Music
=============================== */

saveMusic.addEventListener(
    "click",
    function () {

        const audioFile =
            audioUpload.files[0];

        const coverFile =
            coverUpload.files[0];


        /* Check Audio */

        if (!audioFile) {

            alert(
                "Please choose an audio file."
            );

            return;

        }


        /* Check Extension */

        const extension =
            getFileExtension(
                audioFile.name
            );


        if (
            !supportedExtensions.includes(
                extension
            )
        ) {

            alert(
                "This audio format is not supported.\n\n" +
                "Supported formats:\n" +
                "MP3, M4A, WAV, OGG, AAC, WebM"
            );

            return;

        }


        /* Check Cover */

        if (!coverFile) {

            alert(
                "Please choose a cover image."
            );

            return;

        }


        /* Create Song */

        const song = {

    name: audioFile.name,

    artist: "My Library",

    type: audioFile.type,

    audio: audioFile,

    cover: coverFile,

    addedAt: Date.now(),

    favorite: false

};


        /* Save to IndexedDB */

        const transaction =
            db.transaction(
                ["songs"],
                "readwrite"
            );


        const store =
            transaction.objectStore(
                "songs"
            );


        const addRequest =
            store.add(song);


        addRequest.onsuccess =
            function (event) {

                console.log(
                    "Song saved:",
                    audioFile.name
                );


                const savedSong = {

                    ...song,

                    id:
                        event.target.result

                };


                savedSongs.push(
                    savedSong
                );

playbackQueue.push(
    savedSong
);
                renderSongList();

                loadSong(
                    savedSong
                );


                audioUpload.value =
                    "";

                coverUpload.value =
                    "";


                alert(
                    "Music saved successfully!"
                );

            };


        addRequest.onerror =
            function () {

                alert(
                    "Could not save this music."
                );

            };

    }
);


/* ===============================
   Load Saved Songs
=============================== */

function loadSavedSongs() {

    if (!db) {

        return;

    }


    const transaction =
        db.transaction(
            ["songs"],
            "readonly"
        );


    const store =
        transaction.objectStore(
            "songs"
        );


    const getAllRequest =
        store.getAll();


    getAllRequest.onsuccess =
        function () {

            savedSongs =
                getAllRequest.result;

playbackQueue = [...savedSongs];
            /* Old songs compatibility */

            savedSongs.forEach(
    function (song) {

        if (
            typeof song.favorite !==
            "boolean"
        ) {

            song.favorite =
                false;

        }


        if (
            !song.artist
        ) {

            song.artist =
                "My Library";

        }

    }
);


            renderSongList();


            /* Load latest song */

            if (
                savedSongs.length > 0
            ) {

                const latestSong =
                    savedSongs[
                        savedSongs.length - 1
                    ];


                loadSong(
                    latestSong
                );

            }

        };


    getAllRequest.onerror =
        function () {

            console.error(
                "Could not load songs."
            );

        };

}


/* ===============================
   Load Song
=============================== */

function loadSong(song) {

    if (!song) {

        return;

    }


    /* Revoke old audio URL */

    if (currentAudioURL) {

        URL.revokeObjectURL(
            currentAudioURL
        );

    }


    /* Revoke old cover URL */

    if (currentCoverURL) {

        URL.revokeObjectURL(
            currentCoverURL
        );

    }


    /* Create new audio URL */

    currentAudioURL =
        URL.createObjectURL(
            song.audio
        );


    audioPlayer.src =
        currentAudioURL;


    currentSongId =
        song.id;

currentSongIndex =
    playbackQueue.findIndex(
        function (item) {

            return item.id === song.id;

        }
    );
    /* Song Information */

    songTitle.textContent =
        song.name;


    artistName.textContent =
    song.artist || "My Library";

    /* Cover */

    if (song.cover) {

        currentCoverURL =
            URL.createObjectURL(
                song.cover
            );


        coverImage.src =
            currentCoverURL;


        coverImage.style.display =
            "block";


        musicIcon.style.display =
            "none";

    }

    else {

        coverImage.src =
            "";


        coverImage.style.display =
            "none";


        musicIcon.style.display =
            "block";

    }


    /* Reset Player */

    progress.style.width =
        "0%";


    timeElements[0].textContent =
        "0:00";


    timeElements[1].textContent =
        "0:00";


    playButton.textContent =
        "▶";


    audioPlayer.load();

}

updatePlayingSong();

/* ===============================
   Play / Pause
=============================== */

playButton.addEventListener(
    "click",
    function () {

        if (!audioPlayer.src) {

            return;

        }


        if (
            audioPlayer.paused
        ) {

            audioPlayer.play();

            playButton.textContent =
                "❚❚";
updatePlayingSong();
        }

        else {

            audioPlayer.pause();

            playButton.textContent =
                "▶";
updatePlayingSong();
        }

    }
);


/* ===============================
   Progress
=============================== */

audioPlayer.addEventListener(
    "timeupdate",
    function () {

        if (
            !audioPlayer.duration ||
            isNaN(audioPlayer.duration)
        ) {

            return;

        }


        const percentage =
            (
                audioPlayer.currentTime /
                audioPlayer.duration
            ) * 100;


        progress.style.width =
            percentage + "%";


        timeElements[0].textContent =
            formatTime(
                audioPlayer.currentTime
            );


        timeElements[1].textContent =
            formatTime(
                audioPlayer.duration
            );

    }
);


// ===============================
// Seek - Touch + Mouse + Drag
// ===============================

function seekAudio(event) {

    if (!audioPlayer.duration) {
        return;
    }

    const rect =
        progressBar.getBoundingClientRect();

    let clientX;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
    } else {
        clientX = event.clientX;
    }

    let position =
        (clientX - rect.left) / rect.width;

    // Keep between 0 and 1
    position = Math.max(0, Math.min(1, position));

    audioPlayer.currentTime =
        position * audioPlayer.duration;
}


// Click / tap
progressBar.addEventListener(
    "click",
    seekAudio
);


// Touch start
progressBar.addEventListener(
    "touchstart",
    function (event) {
        seekAudio(event);
    },
    { passive: true }
);


// Touch move - dragging
progressBar.addEventListener(
    "touchmove",
    function (event) {
        seekAudio(event);
    },
    { passive: true }
);


/* ===============================
   Volume
=============================== */

volumeControl.addEventListener(
    "input",
    function () {

        audioPlayer.volume =
            this.value / 100;

    }
);


/* ===============================
   Song End
=============================== */

audioPlayer.addEventListener(
    "ended",
    function () {

        /* Repeat One */

        if (repeatMode === "one") {

            audioPlayer.currentTime = 0;

            audioPlayer.play();

            playButton.textContent =
                "❚❚";

            return;

        }


        /* Repeat Off / Repeat All */

        playNextSong();

    }
);

/* ===============================
   Render Library
=============================== */

function renderSongList() {

    songList.innerHTML = "";


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredSongs =
        savedSongs.filter(
            function (song) {

                const matchesSearch =
                    song.name
                        .toLowerCase()
                        .includes(searchText);


                const matchesFavorite =
                    !showFavoritesOnly ||
                    song.favorite === true;


                return (
                    matchesSearch &&
                    matchesFavorite
                );

            }
        );


    songCount.textContent =
        filteredSongs.length +
        " Songs";


    filteredSongs.forEach(
        function (song, index) {

            const songItem =
                document.createElement(
                    "div"
                );


            songItem.className =
                "song-item";


            /* Cover */

            if (song.cover) {

                const cover =
                    document.createElement(
                        "img"
                    );


                cover.className =
                    "song-cover";


                cover.src =
                    URL.createObjectURL(
                        song.cover
                    );


                cover.alt =
                    song.name;


                songItem.appendChild(
                    cover
                );

            }

            else {

                const placeholder =
                    document.createElement(
                        "div"
                    );


                placeholder.className =
                    "song-cover-placeholder";


                placeholder.textContent =
                    "♫";


                songItem.appendChild(
                    placeholder
                );

            }


            /* Song Info */

            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "song-info";


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "song-name";


            name.textContent =
                song.name;


            const artist =
                document.createElement(
                    "div"
                );


            artist.className =
                "song-artist";


            artist.textContent =
                "My Library";


            info.appendChild(
                name
            );


            info.appendChild(
                artist
            );


            /* Actions */

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "song-actions";


            /* Favorite */

            const favoriteButton =
                document.createElement(
                    "button"
                );


            favoriteButton.className =
                "favorite-btn";


            favoriteButton.textContent =
                song.favorite
                    ? "♥"
                    : "♡";


            if (song.favorite) {

                favoriteButton.classList.add(
                    "active"
                );

            }


            favoriteButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    toggleFavorite(
                        song.id
                    );

                }
            );


            /* Play */

            const playButtonSmall =
                document.createElement(
                    "button"
                );


            playButtonSmall.textContent =
                "▶";


            playButtonSmall.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    loadSong(
                        song
                    );


                    audioPlayer.play();


                    playButton.textContent =
                        "❚❚";

                }
            );

/* Edit */

const editButton =
    document.createElement(
        "button"
    );


editButton.className =
    "edit-btn";


editButton.textContent =
    "✏️";


editButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        editSong(song.id);

    }
);


            /* Delete */

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-btn";


            deleteButton.textContent =
                "🗑";


            deleteButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    deleteSong(
                        song.id
                    );

                }
            );


            actions.appendChild(
    favoriteButton
);

actions.appendChild(
    editButton
);

actions.appendChild(
    playButtonSmall
);

actions.appendChild(
    deleteButton
);


            songItem.appendChild(
                info
            );


            songItem.appendChild(
                actions
            );


            /* Click Song */

            songItem.addEventListener(
                "click",
                function () {

                    loadSong(
                        song
                    );

                }
            );


            songList.appendChild(
                songItem
            );

        }
    );

}


/* ===============================
   Favorite
=============================== */

function toggleFavorite(songId) {

    const song =
        savedSongs.find(
            function (item) {

                return item.id === songId;

            }
        );


    if (!song) {

        return;

    }


    song.favorite =
        !song.favorite;


    const transaction =
        db.transaction(
            ["songs"],
            "readwrite"
        );


    const store =
        transaction.objectStore(
            "songs"
        );


    store.put(
        song
    );


    transaction.oncomplete =
        function () {

            renderSongList();

        };

}


/* ===============================
   Delete Song
=============================== */

function deleteSong(songId) {

    const song =
        savedSongs.find(
            function (item) {

                return item.id === songId;

            }
        );


    if (!song) {

        return;

    }


    const confirmDelete =
        confirm(
            'Delete "' +
            song.name +
            '" from your library?'
        );


    if (!confirmDelete) {

        return;

    }


    const transaction =
        db.transaction(
            ["songs"],
            "readwrite"
        );


    const store =
        transaction.objectStore(
            "songs"
        );


    store.delete(
        songId
    );


    transaction.oncomplete =
        function () {

            savedSongs =
                savedSongs.filter(
                    function (item) {

                        return item.id !== songId;

                    }
                );

playbackQueue =
    playbackQueue.filter(
        function (item) {

            return item.id !== songId;

        }
    );
            renderSongList();


            /* If currently playing */

            if (
                currentSongId ===
                songId
            ) {

                audioPlayer.pause();

                audioPlayer.src =
                    "";


                currentSongId =
                    null;


                songTitle.textContent =
                    "No Song Selected";


                artistName.textContent =
                    "Your Music Library";


                coverImage.src =
                    "";


                coverImage.style.display =
                    "none";


                musicIcon.style.display =
                    "block";


                progress.style.width =
                    "0%";


                timeElements[0].textContent =
                    "0:00";


                timeElements[1].textContent =
                    "0:00";


                playButton.textContent =
                    "▶";

            }

        };

}


/* ===============================
   Format Time
=============================== */

function formatTime(seconds) {

    if (
        isNaN(seconds) ||
        !isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            remainingSeconds
        ).padStart(
            2,
            "0"
        )
    );

                    }

/* ===============================
   Next / Previous
=============================== */


function playNextSong() {

    if (
        playbackQueue.length === 0
    ) {

        return;

    }


    /* Repeat One */

    if (
        repeatMode === "one" &&
        currentSongId !== null
    ) {

        const currentSong =
            playbackQueue.find(
                function (song) {

                    return song.id ===
                        currentSongId;

                }
            );


        if (currentSong) {

            loadSong(currentSong);

            audioPlayer.play();

            playButton.textContent =
                "❚❚";

            return;

        }

    }


    /* Shuffle */

    if (shuffleMode) {

        if (
            playbackQueue.length === 1
        ) {

            loadSong(
                playbackQueue[0]
            );

            audioPlayer.play();

            playButton.textContent =
                "❚❚";

            return;

        }


        let randomIndex;


        do {

            randomIndex =
                Math.floor(
                    Math.random() *
                    playbackQueue.length
                );

        }

        while (
            playbackQueue[randomIndex].id ===
            currentSongId
        );


        const randomSong =
            playbackQueue[randomIndex];


        loadSong(randomSong);

        audioPlayer.play();

        playButton.textContent =
            "❚❚";

        return;

    }


    /* Normal Queue */

    let nextIndex =
        currentSongIndex + 1;


    /* End of Queue */

    if (
        nextIndex >=
        playbackQueue.length
    ) {

        if (
            repeatMode === "all"
        ) {

            nextIndex = 0;

        }

        else {

            playButton.textContent =
                "▶";

            return;

        }

    }


    const nextSong =
        playbackQueue[nextIndex];


    loadSong(nextSong);

    audioPlayer.play();

    playButton.textContent =
        "❚❚";

}


/* ===============================
   Previous Song
=============================== */

function playPreviousSong() {

    if (
        playbackQueue.length === 0
    ) {

        return;

    }


    let previousIndex =
        currentSongIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            playbackQueue.length - 1;

    }


    const previousSong =
        playbackQueue[previousIndex];


    loadSong(previousSong);

    audioPlayer.play();

    playButton.textContent =
        "❚❚";

}


/* ===============================
   Next Button
=============================== */

nextButton.addEventListener(
    "click",
    function () {

        playNextSong();

    }
);


/* ===============================
   Previous Button
=============================== */

previousButton.addEventListener(
    "click",
    function () {

        playPreviousSong();

    }
);

/* ===============================
   Repeat Mode
=============================== */

repeatButton.addEventListener(
    "click",
    function () {

        if (repeatMode === "off") {

            repeatMode = "one";

            repeatButton.textContent =
                "🔂";

        }

        else if (
            repeatMode === "one"
        ) {

            repeatMode = "all";

            repeatButton.textContent =
                "🔁";

        }

        else {

            repeatMode = "off";

            repeatButton.textContent =
                "↶";

        }

    }
);

/* ===============================
   Shuffle
=============================== */

shuffleButton.addEventListener(
    "click",
    function () {

        shuffleMode =
            !shuffleMode;


        if (shuffleMode) {

            shuffleButton.textContent =
                "🔀";

            shuffleButton.classList.add(
                "active"
            );

        }

        else {

            shuffleButton.textContent =
                "🔀";

            shuffleButton.classList.remove(
                "active"
            );

        }

    }
);

        searchInput.addEventListener(
    "input",
    function () {

        renderSongList();

    }
);
            favoriteFilter.addEventListener(
    "click",
    function () {

        showFavoritesOnly =
            !showFavoritesOnly;


        if (showFavoritesOnly) {

            favoriteFilter.textContent =
                "♥ Favorites";

            favoriteFilter.classList.add(
                "active"
            );

        }

        else {

            favoriteFilter.textContent =
                "♡ Favorites";

            favoriteFilter.classList.remove(
                "active"
            );

        }


        renderSongList();

    }
);

/* ===============================
   Edit Song
=============================== */

function editSong(songId) {

    const song =
        savedSongs.find(
            function (item) {

                return item.id === songId;

            }
        );


    if (!song) {

        return;

    }


    const newName =
        prompt(
            "Enter song name:",
            song.name
        );


    if (
        newName === null
    ) {

        return;

    }


    const cleanName =
        newName.trim();


    if (
        cleanName === ""
    ) {

        alert(
            "Song name cannot be empty."
        );

        return;

    }


    const newArtist =
        prompt(
            "Enter artist name:",
            song.artist ||
            "My Library"
        );


    if (
        newArtist === null
    ) {

        return;

    }


    const cleanArtist =
        newArtist.trim();


    song.name =
        cleanName;


    song.artist =
        cleanArtist ||
        "My Library";


    const transaction =
        db.transaction(
            ["songs"],
            "readwrite"
        );


    const store =
        transaction.objectStore(
            "songs"
        );


    store.put(song);


    transaction.oncomplete =
        function () {

            renderSongList();


            if (
                currentSongId ===
                songId
            ) {

                songTitle.textContent =
                    song.name;


                artistName.textContent =
                    song.artist;

            }

        };

}

/* ===============================
   Update Playing Song
=============================== */

function updatePlayingSong() {

    const allSongItems =
        document.querySelectorAll(
            ".song-item"
        );


    allSongItems.forEach(
        function (item) {

            item.classList.remove(
                "playing"
            );

        }
    );


    const currentSong =
        savedSongs.find(
            function (song) {

                return song.id ===
                    currentSongId;

            }
        );


    if (!currentSong) {

        cover.classList.remove(
            "playing"
        );

        return;

    }


    /* Find current song in Library */

    allSongItems.forEach(
        function (item) {

            const nameElement =
                item.querySelector(
                    ".song-name"
                );


            if (
                nameElement &&
                nameElement.textContent ===
                    currentSong.name
            ) {

                item.classList.add(
                    "playing"
                );

            }

        }
    );


    /* Cover animation */

    if (
        !audioPlayer.paused
    ) {

        cover.classList.add(
            "playing"
        );

    }

    else {

        cover.classList.remove(
            "playing"
        );

    }

}

/* ===============================
   Sleep Timer
=============================== */

sleepTimer.addEventListener(
    "change",
    function () {

        const minutes =
            Number(this.value);


        /* Clear previous timer */

        if (sleepTimerID) {

            clearTimeout(
                sleepTimerID
            );

            sleepTimerID = null;

        }


        /* Timer Off */

        if (minutes === 0) {

            return;

        }


        /* Convert minutes to milliseconds */

        const milliseconds =
            minutes *
            60 *
            1000;


        sleepTimerID =
            setTimeout(
                function () {

                    audioPlayer.pause();


                    playButton.textContent =
                        "▶";


                    updatePlayingSong();


                    sleepTimer.value =
                        "0";


                    sleepTimerID =
                        null;


                    alert(
                        "Sleep timer finished."
                    );

                },
                milliseconds
            );

    }
);

/* =========================================================
 /* =========================================
   STEP 9 — PLAYER FUNCTIONALITY POLISH
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- ELEMENTS ---------- */

    const bottomPlay = document.getElementById("bottomPlay");
    const bottomPrevious = document.getElementById("bottomPrevious");
    const bottomNext = document.getElementById("bottomNext");
    const bottomShuffle = document.getElementById("bottomShuffle");
    const bottomRepeat = document.getElementById("bottomRepeat");
    const bottomFavorite = document.getElementById("bottomFavorite");
    const bottomVolume = document.getElementById("bottomVolume");

    const coverFavorite = document.getElementById("coverFavorite");

    const sideCoverImage = document.getElementById("sideCoverImage");
    const sideSongTitle = document.getElementById("sideSongTitle");
    const sideArtistName = document.getElementById("sideArtistName");

    const bottomCoverImage = document.getElementById("bottomCoverImage");
    const bottomSongTitle = document.getElementById("bottomSongTitle");
    const bottomArtistName = document.getElementById("bottomArtistName");

    const extraShuffle = document.getElementById("extraShuffle");
    const extraRepeat = document.getElementById("extraRepeat");

    const libraryNav = document.getElementById("libraryNav");
    const favoritesNav = document.getElementById("favoritesNav");

    const libraryFilterButton =
        document.getElementById("libraryFilterButton");

    const themeButton =
        document.getElementById("themeButton");


    /* ---------- SYNC NOW PLAYING ---------- */

    function syncNowPlayingUI() {

        if (!currentSongId || !savedSongs.length) {
            return;
        }

        const song = savedSongs.find(
            s => s.id === currentSongId
        );

        if (!song) return;


        /* Title */

        if (sideSongTitle) {
            sideSongTitle.textContent = song.name;
        }

        if (bottomSongTitle) {
            bottomSongTitle.textContent = song.name;
        }


        /* Artist */

        if (sideArtistName) {
            sideArtistName.textContent =
                song.artist || "My Library";
        }

        if (bottomArtistName) {
            bottomArtistName.textContent =
                song.artist || "My Library";
        }


        /* Cover */

        if (song.cover) {

            const url = URL.createObjectURL(song.cover);

            if (sideCoverImage) {
                sideCoverImage.src = url;
                sideCoverImage.style.display = "block";
            }

            if (bottomCoverImage) {
                bottomCoverImage.src = url;
                bottomCoverImage.style.display = "block";
            }
        }


        /* Favorite */

        const favorite =
            song.favorite === true;

        if (coverFavorite) {
            coverFavorite.textContent =
                favorite ? "♥" : "♡";

            coverFavorite.classList.toggle(
                "active",
                favorite
            );
        }

        if (bottomFavorite) {
            bottomFavorite.textContent =
                favorite ? "♥" : "♡";

            bottomFavorite.classList.toggle(
                "active",
                favorite
            );
        }
    }


    /* ---------- BOTTOM PLAYER ---------- */

    if (bottomPlay) {

        bottomPlay.addEventListener(
            "click",
            function () {

                if (!currentSongId) return;

                if (audioPlayer.paused) {
                    audioPlayer.play();
                } else {
                    audioPlayer.pause();
                }
            }
        );
    }


    if (bottomPrevious) {

        bottomPrevious.addEventListener(
            "click",
            function () {

                if (typeof playPreviousSong === "function") {
                    playPreviousSong();
                } else if (
                    typeof previousSong === "function"
                ) {
                    previousSong();
                }
            }
        );
    }


    if (bottomNext) {

        bottomNext.addEventListener(
            "click",
            function () {

                if (typeof playNextSong === "function") {
                    playNextSong();
                }
            }
        );
    }


    /* ---------- SHUFFLE ---------- */

    function syncShuffleUI() {

        if (bottomShuffle) {
            bottomShuffle.classList.toggle(
                "active",
                shuffleMode
            );
        }

        if (extraShuffle) {
            extraShuffle.classList.toggle(
                "active",
                shuffleMode
            );
        }

        if (shuffleButton) {
            shuffleButton.classList.toggle(
                "active",
                shuffleMode
            );
        }
    }


    if (bottomShuffle) {

        bottomShuffle.addEventListener(
            "click",
            function () {

                shuffleMode = !shuffleMode;

                syncShuffleUI();
            }
        );
    }


    if (extraShuffle) {

        extraShuffle.addEventListener(
            "click",
            function () {

                shuffleMode = !shuffleMode;

                syncShuffleUI();
            }
        );
    }


    /* ---------- REPEAT ---------- */

    function syncRepeatUI() {

        if (bottomRepeat) {
            bottomRepeat.classList.toggle(
                "active",
                repeatMode !== "off"
            );
        }

        if (extraRepeat) {
            extraRepeat.classList.toggle(
                "active",
                repeatMode !== "off"
            );
        }

        if (repeatButton) {
            repeatButton.classList.toggle(
                "active",
                repeatMode !== "off"
            );
        }
    }


    /* ---------- VOLUME ---------- */

    function syncVolume(value) {

        let volume = Number(value);

        /*
         * Support both:
         * 0-1
         * and
         * 0-100
         */

        if (volume > 1) {
            volume = volume / 100;
        }

        volume = Math.max(
            0,
            Math.min(1, volume)
        );

        audioPlayer.volume = volume;


        if (volumeBar) {

            if (Number(volumeBar.max) > 1) {
                volumeBar.value =
                    Math.round(volume * 100);
            } else {
                volumeBar.value = volume;
            }
        }

        if (bottomVolume) {

            if (Number(bottomVolume.max) > 1) {
                bottomVolume.value =
                    Math.round(volume * 100);
            } else {
                bottomVolume.value = volume;
            }
        }
    }


    if (bottomVolume) {

        bottomVolume.addEventListener(
            "input",
            function () {
                syncVolume(this.value);
            }
        );
    }


    /* ---------- FAVORITE ---------- */

    function updateFavoriteUI() {

        if (!currentSongId) return;

        const song = savedSongs.find(
            s => s.id === currentSongId
        );

        if (!song) return;

        const isFavorite =
            song.favorite === true;

        if (coverFavorite) {
            coverFavorite.textContent =
                isFavorite ? "♥" : "♡";

            coverFavorite.classList.toggle(
                "active",
                isFavorite
            );
        }

        if (bottomFavorite) {
            bottomFavorite.textContent =
                isFavorite ? "♥" : "♡";

            bottomFavorite.classList.toggle(
                "active",
                isFavorite
            );
        }
    }


    function favoriteCurrentSong() {

        if (!currentSongId) return;

        if (typeof toggleFavorite === "function") {
            toggleFavorite(currentSongId);
        }

        setTimeout(
            updateFavoriteUI,
            100
        );
    }


    if (coverFavorite) {

        coverFavorite.addEventListener(
            "click",
            favoriteCurrentSong
        );
    }


    if (bottomFavorite) {

        bottomFavorite.addEventListener(
            "click",
            favoriteCurrentSong
        );
    }


    /* ---------- LIBRARY / FAVORITES ---------- */

    function showLibrary() {

        if (typeof showFavoritesOnly !== "undefined") {
            showFavoritesOnly = false;
        }

        if (typeof renderSongList === "function") {
            renderSongList();
        }

        if (libraryNav) {
            libraryNav.classList.add("active");
        }

        if (favoritesNav) {
            favoritesNav.classList.remove("active");
        }
    }


    function showFavorites() {

        if (typeof showFavoritesOnly !== "undefined") {
            showFavoritesOnly = true;
        }

        if (typeof renderSongList === "function") {
            renderSongList();
        }

        if (favoritesNav) {
            favoritesNav.classList.add("active");
        }

        if (libraryNav) {
            libraryNav.classList.remove("active");
        }
    }


    if (libraryNav) {
        libraryNav.addEventListener(
            "click",
            showLibrary
        );
    }


    if (favoritesNav) {
        favoritesNav.addEventListener(
            "click",
            showFavorites
        );
    }


    if (libraryFilterButton) {

        libraryFilterButton.addEventListener(
            "click",
            function () {

                if (
                    typeof showFavoritesOnly !==
                    "undefined"
                ) {

                    showFavoritesOnly =
                        !showFavoritesOnly;

                    renderSongList();

                    this.classList.toggle(
                        "active",
                        showFavoritesOnly
                    );
                }
            }
        );
    }


    /* ---------- THEME ---------- */

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "soft-dark"
                );

                this.classList.toggle(
                    "active"
                );
            }
        );
    }


    /* ---------- AUDIO EVENTS ---------- */

    audioPlayer.addEventListener(
        "play",
        function () {

            if (playButton) {
                playButton.textContent = "❚❚";
            }

            if (bottomPlay) {
                bottomPlay.textContent = "❚❚";
            }

            if (cover) {
                cover.classList.add("playing");
            }

            updateFavoriteUI();
        }
    );


    audioPlayer.addEventListener(
        "pause",
        function () {

            if (playButton) {
                playButton.textContent = "▶";
            }

            if (bottomPlay) {
                bottomPlay.textContent = "▶";
            }

            if (cover) {
                cover.classList.remove("playing");
            }
        }
    );


    audioPlayer.addEventListener(
        "loadedmetadata",
        function () {

            syncNowPlaying();
        }
    );


    audioPlayer.addEventListener(
        "timeupdate",
        function () {

            syncNowPlayingUI();
        }
    );


    /* ---------- INITIAL STATE ---------- */

    setTimeout(
        function () {

            syncShuffleUI();
            syncRepeatUI();
            syncNowPlayingUI();

        },
        300
    );

});           

/* =========================================
   STEP 10 — EQUALIZER PANEL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const equalizerButton =
        document.getElementById("equalizerButton");

    if (!equalizerButton) return;


    /* Create Equalizer Panel */

    const panel = document.createElement("div");

    panel.id = "equalizerPanel";

    panel.innerHTML = `
        <div class="eq-header">
            <div>
                <strong>Sound & Equalizer</strong>
                <small>Choose your mood</small>
            </div>

            <button id="closeEqualizer">
                ×
            </button>
        </div>

        <div class="eq-presets">

            <button data-preset="normal">
                🎵
                <span>Normal</span>
            </button>

            <button data-preset="bass">
                🔥
                <span>Bass</span>
            </button>

            <button data-preset="vocal">
                🎤
                <span>Vocal</span>
            </button>

            <button data-preset="soft">
                🌙
                <span>Soft</span>
            </button>

            <button data-preset="rock">
                🎸
                <span>Rock</span>
            </button>

            <button data-preset="romantic">
                💗
                <span>Romantic</span>
            </button>

        </div>
    `;


    document.body.appendChild(panel);


    /* Open */

    equalizerButton.addEventListener(
        "click",
        function () {

            panel.classList.add("show");

        }
    );


    /* Close */

    document
        .getElementById("closeEqualizer")
        .addEventListener(
            "click",
            function () {

                panel.classList.remove("show");

            }
        );


    /* Close when clicking outside */

    panel.addEventListener(
        "click",
        function (event) {

            if (event.target === panel) {

                panel.classList.remove("show");

            }

        }
    );


    /* Presets */

    const presetButtons =
        panel.querySelectorAll(
            "[data-preset]"
        );


    presetButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    presetButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    this.classList.add(
                        "active"
                    );


                    const preset =
                        this.dataset.preset;


                    applyEqualizerPreset(
                        preset
                    );

                }
            );

        }
    );


    /* Equalizer logic */

    function applyEqualizerPreset(preset) {

        /*
         * Browser audio processing will be
         * connected in the next part.
         */

        console.log(
            "Equalizer preset:",
            preset
        );

    }

});

/* =========================================
   STEP 10 — REAL AUDIO EQUALIZER
========================================= */

(function () {

    let audioContext = null;
    let sourceNode = null;

    let bassFilter = null;
    let midFilter = null;
    let trebleFilter = null;


    function setupAudioEngine() {

        if (audioContext) {
            return;
        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            console.warn(
                "Web Audio API is not supported."
            );

            return;
        }


        audioContext =
            new AudioContext();


        sourceNode =
            audioContext.createMediaElementSource(
                audioPlayer
            );


        /* Bass */

        bassFilter =
            audioContext.createBiquadFilter();

        bassFilter.type =
            "lowshelf";

        bassFilter.frequency.value =
            200;

        bassFilter.gain.value =
            0;


        /* Mid */

        midFilter =
            audioContext.createBiquadFilter();

        midFilter.type =
            "peaking";

        midFilter.frequency.value =
            1000;

        midFilter.Q.value =
            1;

        midFilter.gain.value =
            0;


        /* Treble */

        trebleFilter =
            audioContext.createBiquadFilter();

        trebleFilter.type =
            "highshelf";

        trebleFilter.frequency.value =
            4000;

        trebleFilter.gain.value =
            0;


        /* Connect */

        sourceNode
            .connect(bassFilter)
            .connect(midFilter)
            .connect(trebleFilter)
            .connect(audioContext.destination);

    }


    function applyPreset(preset) {

        setupAudioEngine();


        if (!audioContext) {
            return;
        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        let bass = 0;
        let mid = 0;
        let treble = 0;


        switch (preset) {

            case "normal":

                bass = 0;
                mid = 0;
                treble = 0;

                break;


            case "bass":

                bass = 8;
                mid = 2;
                treble = 3;

                break;


            case "vocal":

                bass = -2;
                mid = 7;
                treble = 3;

                break;


            case "soft":

                bass = 2;
                mid = -2;
                treble = -3;

                break;


            case "rock":

                bass = 6;
                mid = -1;
                treble = 6;

                break;


            case "romantic":

                bass = 4;
                mid = 3;
                treble = 4;

                break;

        }


        bassFilter.gain.value =
            bass;

        midFilter.gain.value =
            mid;

        trebleFilter.gain.value =
            treble;

    }


    /* -----------------------------------------
       Connect Equalizer Presets
    ----------------------------------------- */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-preset]"
                );


            if (!button) {
                return;
            }


            const preset =
                button.dataset.preset;


            applyPreset(
                preset
            );

        }
    );


    /* -----------------------------------------
       Initialize on first play
    ----------------------------------------- */

    audioPlayer.addEventListener(
        "play",
        function () {

            setupAudioEngine();

            if (
                audioContext &&
                audioContext.state ===
                "suspended"
            ) {

                audioContext.resume();

            }

        },
        { once: false }
    );

})();
