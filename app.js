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

const musicIcon =
    document.querySelector(".music-icon");

const playButton =
    document.querySelector(".play-btn");

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

const songCount =
    document.getElementById("songCount");


let savedSongs = [];

let db;

let currentSongId = null;

let currentAudioURL = null;

let currentCoverURL = null;


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

            name:
                audioFile.name,

            type:
                audioFile.type,

            audio:
                audioFile,

            cover:
                coverFile,

            addedAt:
                Date.now(),

            favorite:
                false

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


    /* Song Information */

    songTitle.textContent =
        song.name;


    artistName.textContent =
        "My Library";


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

        }

        else {

            audioPlayer.pause();

            playButton.textContent =
                "▶";

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


/* ===============================
   Seek
=============================== */

progressBar.addEventListener(
    "click",
    function (event) {

        if (
            !audioPlayer.duration
        ) {

            return;

        }


        const rect =
            progressBar.getBoundingClientRect();


        const clickX =
            event.clientX -
            rect.left;


        const percentage =
            clickX /
            rect.width;


        audioPlayer.currentTime =
            percentage *
            audioPlayer.duration;

    }
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

        playButton.textContent =
            "▶";

    }
);


/* ===============================
   Render Library
=============================== */

function renderSongList() {

    songList.innerHTML =
        "";


    songCount.textContent =
        savedSongs.length +
        " Songs";


    savedSongs.forEach(
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
