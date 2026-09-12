/* =====================================================
   BLOOM MUSIC
   V3
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const audio = document.getElementById("audioPlayer");

const fileInput = document.getElementById("fileInput");
const importBtn = document.getElementById("importBtn");

const songList = document.getElementById("songList");
const recentList = document.getElementById("recentList");
const playlistList = document.getElementById("playlistList");

const songCount = document.getElementById("songCount");
const playlistCount = document.getElementById("playlistCount");

const searchInput = document.getElementById("searchInput");

const pageTitle = document.getElementById("pageTitle");
const listTitle = document.getElementById("listTitle");

const recentSection = document.getElementById("recentSection");
const playlistSection = document.getElementById("playlistSection");


/* PLAYER */

const playerScreen = document.getElementById("playerScreen");

const closePlayer = document.getElementById("closePlayer");

const playBtn = document.getElementById("playBtn");
const miniPlayBtn = document.getElementById("miniPlayBtn");

const miniPrevious = document.getElementById("miniPrevious");
const miniNext = document.getElementById("miniNext");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const back5Btn = document.getElementById("back5Btn");
const forward5Btn = document.getElementById("forward5Btn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniPlayer =
    document.getElementById("miniPlayer");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

const miniCover = document.getElementById("miniCover");
const bigCover = document.getElementById("bigCover");

const favoriteBtn = document.getElementById("favoriteBtn");
const editBtn = document.getElementById("editBtn");

const addPlaylistFromPlayer =
    document.getElementById("addPlaylistFromPlayer");


/* VOLUME */

const volumeBar =
    document.getElementById("volumeBar");

const muteBtn =
    document.getElementById("muteBtn");


/* QUEUE */

const queueScreen =
    document.getElementById("queueScreen");

const queueList =
    document.getElementById("queueList");

const openQueueBtn =
    document.getElementById("openQueueBtn");

const playerQueueBtn =
    document.getElementById("playerQueueBtn");

const closeQueue =
    document.getElementById("closeQueue");


/* EDIT */

const editModal =
    document.getElementById("editModal");

const closeEdit =
    document.getElementById("closeEdit");

const editTitle =
    document.getElementById("editTitle");

const editArtist =
    document.getElementById("editArtist");

const editAlbum =
    document.getElementById("editAlbum");

const editCover =
    document.getElementById("editCover");

const saveEdit =
    document.getElementById("saveEdit");


/* PLAYLIST */

const playlistBtn =
    document.getElementById("playlistBtn");

const playlistModal =
    document.getElementById("playlistModal");

const closePlaylist =
    document.getElementById("closePlaylist");

const playlistName =
    document.getElementById("playlistName");

const createPlaylist =
    document.getElementById("createPlaylist");


/* PLAYLIST SELECTOR */

const playlistSelector =
    document.getElementById("playlistSelector");

const selectorList =
    document.getElementById("selectorList");

const closeSelector =
    document.getElementById("closeSelector");

const createPlaylistFromSelector =
    document.getElementById(
        "createPlaylistFromSelector"
    );


/* PLAYLIST SCREEN */

const playlistScreen =
    document.getElementById("playlistScreen");

const closePlaylistScreen =
    document.getElementById(
        "closePlaylistScreen"
    );

const playlistViewTitle =
    document.getElementById(
        "playlistViewTitle"
    );

const playlistViewContent =
    document.getElementById(
        "playlistViewContent"
    );

const playlistViewMenu =
    document.getElementById(
        "playlistViewMenu"
    );


/* PLAYLIST MENU */

const playlistMenu =
    document.getElementById("playlistMenu");

const playlistMenuTitle =
    document.getElementById(
        "playlistMenuTitle"
    );

const renamePlaylistBtn =
    document.getElementById(
        "renamePlaylistBtn"
    );

const deletePlaylistBtn =
    document.getElementById(
        "deletePlaylistBtn"
    );

const closePlaylistMenu =
    document.getElementById(
        "closePlaylistMenu"
    );


/* SONG MENU */

const songMenu =
    document.getElementById("songMenu");

const menuSongTitle =
    document.getElementById(
        "menuSongTitle"
    );

const menuEdit =
    document.getElementById("menuEdit");

const menuFavorite =
    document.getElementById(
        "menuFavorite"
    );

const menuPlaylist =
    document.getElementById(
        "menuPlaylist"
    );

const menuDelete =
    document.getElementById(
        "menuDelete"
    );

const menuClose =
    document.getElementById(
        "menuClose"
    );


/* SORT */

const sortBtn =
    document.getElementById("sortBtn");

const sortMenu =
    document.getElementById("sortMenu");

const sortClose =
    document.getElementById("sortClose");


/* VISUALIZER */

const visualizer =
    document.getElementById("visualizer");


/* =====================================================
   DATABASE
===================================================== */

const DB_NAME = "BloomMusicDB";

const DB_VERSION = 3;

const SONG_STORE = "songs";

const PLAYLIST_STORE = "playlists";

let db;


/* =====================================================
   STATE
===================================================== */

let songs = [];

let playlists = [];

let currentIndex = -1;

let menuSongIndex = -1;

let selectedPlaylistSong = -1;

let currentPlaylistId = null;

let currentObjectURL = null;

let shuffleMode = false;

let repeatMode = "all";

let sortMode = "recent";

let queue = [];

let queuePosition = -1;

let previousVolume = 1;


/* =====================================================
   DATABASE
===================================================== */

function openDatabase() {

    return new Promise(
        (resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                event => {

                    const database =
                        event.target.result;


                    if (
                        !database.objectStoreNames.contains(
                            SONG_STORE
                        )
                    ) {

                        database.createObjectStore(
                            SONG_STORE,
                            {
                                keyPath: "id"
                            }
                        );

                    }


                    if (
                        !database.objectStoreNames.contains(
                            PLAYLIST_STORE
                        )
                    ) {

                        database.createObjectStore(
                            PLAYLIST_STORE,
                            {
                                keyPath: "id"
                            }
                        );

                    }

                };


            request.onsuccess =
                event => {

                    db =
                        event.target.result;

                    resolve(db);

                };


            request.onerror =
                () => reject(request.error);

        }
    );

}


/* =====================================================
   DB PUT
===================================================== */

function dbPut(
    storeName,
    object
) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    storeName,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    storeName
                );

            const request =
                store.put(object);


            request.onsuccess =
                () => resolve();

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}


/* =====================================================
   DB GET
===================================================== */

function dbGetAll(
    storeName
) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    storeName,
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    storeName
                );

            const request =
                store.getAll();


            request.onsuccess =
                () =>
                    resolve(
                        request.result
                    );

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}


/* =====================================================
   DB DELETE
===================================================== */

function dbDelete(
    storeName,
    id
) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    storeName,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    storeName
                );

            const request =
                store.delete(id);


            request.onsuccess =
                () => resolve();

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}


/* =====================================================
   INIT
===================================================== */

async function init() {

    try {

        await openDatabase();

        songs =
            await dbGetAll(
                SONG_STORE
            );

        playlists =
            await dbGetAll(
                PLAYLIST_STORE
            );


        buildQueue();

        renderAll();

        audio.volume = 1;

    }

    catch(error) {

        console.error(
            "Database error:",
            error
        );

        alert(
            "Storage could not be initialized."
        );

    }

}


/* =====================================================
   RENDER ALL
===================================================== */

function renderAll() {

    renderSongs();

    renderRecent();

    renderPlaylists();

    renderQueue();

}


/* =====================================================
   IMPORT MUSIC
===================================================== */

importBtn.addEventListener(
    "click",
    () => fileInput.click()
);


fileInput.addEventListener(
    "change",
    async () => {

        const files =
            Array.from(
                fileInput.files
            );


        if (!files.length)
            return;


        let added = 0;


        for (
            const file of files
        ) {

            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {

                continue;

            }


            const song = {

                id:
                    crypto.randomUUID(),

                title:
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ),

                artist:
                    "Unknown Artist",

                album:
                    "My Music",

                favorite:
                    false,

                createdAt:
                    Date.now(),

                audioBlob:
                    file,

                cover:
                    null

            };


            await dbPut(
                SONG_STORE,
                song
            );


            songs.push(song);

            added++;

        }


        fileInput.value = "";


        buildQueue();

        renderAll();


        if (added) {

            alert(
                `${added} song${added > 1 ? "s" : ""} added 🌸`
            );

        }

    }
);


/* =====================================================
   SORT
===================================================== */

function getSortedSongs(list) {

    const result =
        [...list];


    if (
        sortMode ===
        "title"
    ) {

        result.sort(
            (a,b) =>
                a.title.localeCompare(
                    b.title
                )
        );

    }


    else if (
        sortMode ===
        "artist"
    ) {

        result.sort(
            (a,b) =>
                a.artist.localeCompare(
                    b.artist
                )
        );

    }


    else if (
        sortMode ===
        "favorite"
    ) {

        result.sort(
            (a,b) =>
                Number(b.favorite) -
                Number(a.favorite)
        );

    }


    else {

        result.sort(
            (a,b) =>
                b.createdAt -
                a.createdAt
        );

    }


    return result;

}


/* =====================================================
   RENDER SONGS
===================================================== */

function renderSongs(
    customList = null
) {

    let list =
        customList ||
        songs;


    list =
        getSortedSongs(
            list
        );


    songList.innerHTML = "";


    songCount.textContent =
        `${list.length} song${list.length !== 1 ? "s" : ""}`;


    if (!list.length) {

        songList.innerHTML = `

            <div class="empty">

                <span>🌸</span>

                <p>No music found.</p>

            </div>

        `;

        return;

    }


    list.forEach(
        song => {

            const actualIndex =
                songs.findIndex(
                    item =>
                        item.id ===
                        song.id
                );


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "song-item";


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "song-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "song-info";


            info.innerHTML = `

                <strong>
                    ${escapeHTML(song.title)}
                </strong>

                <span>
                    ${escapeHTML(song.artist)}
                    ${song.album
                        ? " • " +
                          escapeHTML(song.album)
                        : ""}
                </span>

            `;


            const menu =
                document.createElement(
                    "button"
                );

            menu.className =
                "song-menu";


            menu.textContent =
                song.favorite
                    ? "♥"
                    : "⋮";


            if (song.favorite) {

                menu.classList.add(
                    "favorite"
                );

            }


            menu.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openSongMenu(
                        actualIndex
                    );

                }
            );


            item.appendChild(
                cover
            );

            item.appendChild(
                info
            );

            item.appendChild(
                menu
            );


            item.addEventListener(
                "click",
                () =>
                    playSong(
                        actualIndex
                    )
            );


            songList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   RECENT
===================================================== */

function renderRecent() {

    recentList.innerHTML = "";


    const recent =
        [...songs]
            .sort(
                (a,b) =>
                    b.createdAt -
                    a.createdAt
            )
            .slice(0,6);


    if (!recent.length) {

        recentList.innerHTML = `

            <div class="empty">
                <span>🎵</span>
                Add your first song.
            </div>

        `;

        return;

    }


    recent.forEach(
        song => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "recent-card";


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "recent-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                song.title;


            const artist =
                document.createElement(
                    "span"
                );

            artist.textContent =
                song.artist;


            card.appendChild(
                cover
            );

            card.appendChild(
                title
            );

            card.appendChild(
                artist
            );


            card.addEventListener(
                "click",
                () => {

                    const index =
                        songs.findIndex(
                            item =>
                                item.id ===
                                song.id
                        );

                    playSong(index);

                }
            );


            recentList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PLAYLISTS
===================================================== */

function renderPlaylists() {

    playlistList.innerHTML = "";


    playlistCount.textContent =
        playlists.length;


    if (!playlists.length) {

        playlistList.innerHTML = `

            <div class="empty">
                <span>♡</span>
                Create your first playlist.
            </div>

        `;

        return;

    }


    playlists.forEach(
        playlist => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "playlist-card";


            card.innerHTML = `

                <div class="playlist-icon">
                    ♫
                </div>

                <strong>
                    ${escapeHTML(
                        playlist.name
                    )}
                </strong>

                <span>
                    ${playlist.songIds.length} songs
                </span>

            `;


            card.addEventListener(
                "click",
                () =>
                    openPlaylist(
                        playlist.id
                    )
            );


            playlistList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   QUEUE
===================================================== */

function buildQueue() {

    if (!songs.length) {

        queue = [];

        queuePosition = -1;

        return;

    }


    let ordered;


    if (shuffleMode) {

        ordered =
            [...songs]
                .sort(
                    () =>
                        Math.random() -
                        0.5
                );

    }

    else {

        ordered =
            [...songs];

    }


    queue =
        ordered.map(
            song =>
                song.id
        );


    if (
        currentIndex >= 0 &&
        songs[currentIndex]
    ) {

        const currentId =
            songs[currentIndex].id;


        const position =
            queue.indexOf(
                currentId
            );


        if (position >= 0) {

            queuePosition =
                position;

        }

        else {

            queue.unshift(
                currentId
            );

            queuePosition = 0;

        }

    }

    else {

        queuePosition = 0;

    }


    renderQueue();

}


/* =====================================================
   RENDER QUEUE
===================================================== */

function renderQueue() {

    queueList.innerHTML = "";


    if (!queue.length) {

        queueList.innerHTML = `

            <div class="empty">
                <span>🎵</span>
                Queue is empty.
            </div>

        `;

        return;

    }


    queue.forEach(
        (id,index) => {

            const song =
                songs.find(
                    item =>
                        item.id === id
                );


            if (!song)
                return;


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "queue-song";


            if (
                index === queuePosition
            ) {

                item.classList.add(
                    "active"
                );

            }


            const number =
                document.createElement(
                    "span"
                );

            number.className =
                "queue-number";

            number.textContent =
                index === queuePosition
                    ? "▶"
                    : index + 1;


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "queue-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "queue-info";


            info.innerHTML = `

                <strong>
                    ${escapeHTML(
                        song.title
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        song.artist
                    )}
                </span>

            `;


            item.appendChild(
                number
            );

            item.appendChild(
                cover
            );

            item.appendChild(
                info
            );


            item.addEventListener(
                "click",
                () => {

                    const songIndex =
                        songs.findIndex(
                            item =>
                                item.id ===
                                song.id
                        );


                    queuePosition =
                        index;


                    playSong(
                        songIndex,
                        false
                    );

                }
            );


            queueList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   PLAY SONG
===================================================== */

function playSong(
    index,
    updateQueue = true
) {

    if (
        !songs[index]
    )
        return;


    currentIndex =
        index;


    const song =
        songs[currentIndex];


    if (updateQueue) {

        const position =
            queue.indexOf(
                song.id
            );


        if (position >= 0) {

            queuePosition =
                position;

        }

        else {

            queue.unshift(
                song.id
            );

            queuePosition = 0;

        }

    }


    if (currentObjectURL) {

        URL.revokeObjectURL(
            currentObjectURL
        );

    }


    currentObjectURL =
        URL.createObjectURL(
            song.audioBlob
        );


    audio.src =
        currentObjectURL;


    updatePlayerUI();

    renderQueue();


    playerScreen.classList.add(
        "show"
    );


    audio.play()
        .then(
            () => {

                updatePlayButtons();

                playerScreen.classList.add(
                    "playing"
                );

            }
        )
        .catch(
            console.error
        );

}


/* =====================================================
   PLAYER UI
===================================================== */

function updatePlayerUI() {

    if (
        currentIndex < 0 ||
        !songs[currentIndex]
    )
        return;


    const song =
        songs[currentIndex];


    miniTitle.textContent =
        song.title;

    miniArtist.textContent =
        song.artist;


    playerTitle.textContent =
        song.title;

    playerArtist.textContent =
        song.artist;


    setCover(
        miniCover,
        song.cover
    );

    setCover(
        bigCover,
        song.cover
    );


    favoriteBtn.textContent =
        song.favorite
            ? "♥ Remove favorite"
            : "♡ Favorite";

}


/* =====================================================
   COVER
===================================================== */

function setCover(
    element,
    cover
) {

    if (cover) {

        element.innerHTML =
            `<img src="${cover}" alt="">`;

    }

    else {

        element.textContent =
            "♪";

    }

}


/* =====================================================
   PLAY PAUSE
===================================================== */

function togglePlay() {

    if (!audio.src) {

        if (songs.length) {

            playSong(0);

        }

        return;

    }


    if (audio.paused) {

        audio.play();

    }

    else {

        audio.pause();

    }

}


playBtn.addEventListener(
    "click",
    togglePlay
);

miniPlayBtn.addEventListener(
    "click",
    togglePlay
);


audio.addEventListener(
    "play",
    () => {

        updatePlayButtons();

        playerScreen.classList.add(
            "playing"
        );

        startVisualizer();

    }
);


audio.addEventListener(
    "pause",
    () => {

        updatePlayButtons();

        playerScreen.classList.remove(
            "playing"
        );

    }
);


function updatePlayButtons() {

    const playing =
        !audio.paused;


    playBtn.textContent =
        playing
            ? "❚❚"
            : "▶";


    miniPlayBtn.textContent =
        playing
            ? "❚❚"
            : "▶";

}


/* =====================================================
   PREVIOUS
===================================================== */

function previousSong() {

    if (!songs.length)
        return;


    if (
        audio.currentTime > 5
    ) {

        audio.currentTime =
            0;

        return;

    }


    if (
        queue.length &&
        queuePosition > 0
    ) {

        queuePosition--;

        const id =
            queue[queuePosition];

        const index =
            songs.findIndex(
                song =>
                    song.id === id
            );


        if (index >= 0) {

            playSong(
                index,
                false
            );

            return;

        }

    }


    let index =
        currentIndex - 1;


    if (index < 0) {

        index =
            songs.length - 1;

    }


    playSong(index);

}


previousBtn.addEventListener(
    "click",
    previousSong
);

miniPrevious.addEventListener(
    "click",
    previousSong
);


/* =====================================================
   NEXT
===================================================== */

function nextSong() {

    if (!songs.length)
        return;


    if (
        repeatMode === "one"
    ) {

        audio.currentTime = 0;

        audio.play();

        return;

    }


    if (
        queue.length &&
        queuePosition <
        queue.length - 1
    ) {

        queuePosition++;


        const id =
            queue[queuePosition];


        const index =
            songs.findIndex(
                song =>
                    song.id === id
            );


        if (index >= 0) {

            playSong(
                index,
                false
            );

            return;

        }

    }


    if (
        repeatMode === "off"
    ) {

        audio.pause();

        return;

    }


    if (shuffleMode) {

        let index;

        do {

            index =
                Math.floor(
                    Math.random() *
                    songs.length
                );

        }
        while (
            songs.length > 1 &&
            index === currentIndex
        );


        playSong(index);

        return;

    }


    let index =
        currentIndex + 1;


    if (
        index >= songs.length
    ) {

        index = 0;

    }


    playSong(index);

}


nextBtn.addEventListener(
    "click",
    nextSong
);

miniNext.addEventListener(
    "click",
    nextSong
);


/* =====================================================
   5 SEC
===================================================== */

back5Btn.addEventListener(
    "click",
    () => {

        audio.currentTime =
            Math.max(
                0,
                audio.currentTime - 5
            );

    }
);


forward5Btn.addEventListener(
    "click",
    () => {

        audio.currentTime =
            Math.min(
                audio.duration || 0,
                audio.currentTime + 5
            );

    }
);


/* =====================================================
   PROGRESS
===================================================== */

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration)
            return;


        progressBar.value =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


progressBar.addEventListener(
    "input",
    () => {

        if (!audio.duration)
            return;


        audio.currentTime =
            (
                progressBar.value /
                100
            ) *
            audio.duration;

    }
);


/* =====================================================
   SONG END
===================================================== */

audio.addEventListener(
    "ended",
    () => {

        if (
            repeatMode ===
            "one"
        ) {

            audio.currentTime =
                0;

            audio.play();

            return;

        }


        nextSong();

    }
);


/* =====================================================
   SHUFFLE
===================================================== */

shuffleBtn.addEventListener(
    "click",
    () => {

        shuffleMode =
            !shuffleMode;


        shuffleBtn.style.color =
            shuffleMode
                ? "var(--pink)"
                : "";


        buildQueue();

    }
);


/* =====================================================
   REPEAT
===================================================== */

repeatBtn.addEventListener(
    "click",
    () => {

        if (
            repeatMode === "all"
        ) {

            repeatMode =
                "one";

            repeatBtn.textContent =
                "🔂";

        }

        else if (
            repeatMode === "one"
        ) {

            repeatMode =
                "off";

            repeatBtn.textContent =
                "↪";

        }

        else {

            repeatMode =
                "all";

            repeatBtn.textContent =
                "🔁";

        }

    }
);


/* =====================================================
   VOLUME
===================================================== */

volumeBar.addEventListener(
    "input",
    () => {

        const value =
            Number(
                volumeBar.value
            );


        audio.volume =
            value;


        if (value > 0) {

            previousVolume =
                value;

            muteBtn.textContent =
                "🔊";

        }

        else {

            muteBtn.textContent =
                "🔇";

        }

    }
);


muteBtn.addEventListener(
    "click",
    () => {

        if (
            audio.volume > 0
        ) {

            previousVolume =
                audio.volume;

            audio.volume = 0;

            volumeBar.value = 0;

            muteBtn.textContent =
                "🔇";

        }

        else {

            audio.volume =
                previousVolume || 1;

            volumeBar.value =
                audio.volume;

            muteBtn.textContent =
                "🔊";

        }

    }
);


/* =====================================================
   FAVORITE
===================================================== */

favoriteBtn.addEventListener(
    "click",
    async () => {

        if (
            currentIndex < 0
        )
            return;


        await toggleFavorite(
            currentIndex
        );


        updatePlayerUI();

    }
);


async function toggleFavorite(index) {

    if (!songs[index])
        return;


    songs[index].favorite =
        !songs[index].favorite;


    await dbPut(
        SONG_STORE,
        songs[index]
    );


    renderAll();

}


/* =====================================================
   SONG MENU
===================================================== */

function openSongMenu(index) {

    if (!songs[index])
        return;


    menuSongIndex =
        index;


    const song =
        songs[index];


    menuSongTitle.textContent =
        song.title;


    menuFavorite.textContent =
        song.favorite
            ? "♥ Remove from favorites"
            : "♡ Add to favorites";


    songMenu.classList.add(
        "show"
    );

}


function closeSongMenu() {

    songMenu.classList.remove(
        "show"
    );

}


menuClose.addEventListener(
    "click",
    closeSongMenu
);


menuEdit.addEventListener(
    "click",
    () => {

        if (
            menuSongIndex < 0
        )
            return;


        openEdit(
            menuSongIndex
        );

        closeSongMenu();

    }
);


menuFavorite.addEventListener(
    "click",
    async () => {

        if (
            menuSongIndex < 0
        )
            return;


        await toggleFavorite(
            menuSongIndex
        );


        closeSongMenu();

    }
);


menuPlaylist.addEventListener(
    "click",
    () => {

        if (
            menuSongIndex < 0
        )
            return;


        selectedPlaylistSong =
            menuSongIndex;


        closeSongMenu();

        openPlaylistSelector();

    }
);


/* =====================================================
   DELETE SONG
===================================================== */

menuDelete.addEventListener(
    "click",
    async () => {

        if (
            menuSongIndex < 0
        )
            return;


        const song =
            songs[menuSongIndex];


        const confirmed =
            confirm(
                `Delete "${song.title}" from your library?`
            );


        if (!confirmed)
            return;


        await dbDelete(
            SONG_STORE,
            song.id
        );


        for (
            const playlist of playlists
        ) {

            playlist.songIds =
                playlist.songIds.filter(
                    id =>
                        id !== song.id
                );


            await dbPut(
                PLAYLIST_STORE,
                playlist
            );

        }


        if (
            currentIndex ===
            menuSongIndex
        ) {

            audio.pause();

            audio.src = "";

            currentIndex = -1;

            miniTitle.textContent =
                "No song selected";

            miniArtist.textContent =
                "Choose a song";

            miniCover.textContent =
                "♪";

            bigCover.textContent =
                "♪";

        }


        songs.splice(
            menuSongIndex,
            1
        );


        buildQueue();

        renderAll();

        closeSongMenu();

    }
);


/* =====================================================
   EDIT SONG
===================================================== */

function openEdit(index) {

    const song =
        songs[index];


    if (!song)
        return;


    menuSongIndex =
        index;


    editTitle.value =
        song.title;

    editArtist.value =
        song.artist;

    editAlbum.value =
        song.album || "";


    editModal.classList.add(
        "show"
    );

}


editBtn.addEventListener(
    "click",
    () => {

        if (
            currentIndex < 0
        )
            return;


        openEdit(
            currentIndex
        );

    }
);


closeEdit.addEventListener(
    "click",
    () => {

        editModal.classList.remove(
            "show"
        );

    }
);


saveEdit.addEventListener(
    "click",
    async () => {

        if (
            menuSongIndex < 0
        )
            return;


        const song =
            songs[menuSongIndex];


        song.title =
            editTitle.value.trim()
            || "Untitled";


        song.artist =
            editArtist.value.trim()
            || "Unknown Artist";


        song.album =
            editAlbum.value.trim()
            || "My Music";


        const imageFile =
            editCover.files[0];


        if (imageFile) {

            song.cover =
                await fileToDataURL(
                    imageFile
                );

        }


        await dbPut(
            SONG_STORE,
            song
        );


        renderAll();


        if (
            currentIndex ===
            menuSongIndex
        ) {

            updatePlayerUI();

        }


        editCover.value = "";

        editModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   FILE TO DATA URL
===================================================== */

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () =>
                    resolve(
                        reader.result
                    );


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   CREATE PLAYLIST
===================================================== */

playlistBtn.addEventListener(
    "click",
    () => {

        playlistModal.classList.add(
            "show"
        );

    }
);


closePlaylist.addEventListener(
    "click",
    () => {

        playlistModal.classList.remove(
            "show"
        );

    }
);


createPlaylist.addEventListener(
    "click",
    createNewPlaylist
);


async function createNewPlaylist() {

    const name =
        playlistName.value.trim();


    if (!name) {

        alert(
            "Please enter a playlist name."
        );

        return;

    }


    const playlist = {

        id:
            crypto.randomUUID(),

        name:
            name,

        songIds: [],

        createdAt:
            Date.now()

    };


    await dbPut(
        PLAYLIST_STORE,
        playlist
    );


    playlists.push(
        playlist
    );


    playlistName.value = "";


    playlistModal.classList.remove(
        "show"
    );


    renderPlaylists();

}


/* =====================================================
   PLAYLIST SELECTOR
===================================================== */

function openPlaylistSelector() {

    selectorList.innerHTML = "";


    if (!playlists.length) {

        selectorList.innerHTML = `

            <div class="empty">
                <span>♡</span>
                No playlists yet.
            </div>

        `;

    }


    playlists.forEach(
        playlist => {

            const item =
                document.createElement(
                    "button"
                );

            item.className =
                "selector-item";


            const song =
                songs[
                    selectedPlaylistSong
                ];


            const exists =
                song &&
                playlist.songIds.includes(
                    song.id
                );


            if (exists) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `

                <span>
                    ${escapeHTML(
                        playlist.name
                    )}
                </span>

                <small>
                    ${playlist.songIds.length} songs
                </small>

            `;


            item.addEventListener(
                "click",
                async () => {

                    await toggleSongInPlaylist(
                        playlist.id
                    );

                }
            );


            selectorList.appendChild(
                item
            );

        }
    );


    playlistSelector.classList.add(
        "show"
    );

}


closeSelector.addEventListener(
    "click",
    () => {

        playlistSelector.classList.remove(
            "show"
        );

    }
);


async function toggleSongInPlaylist(
    playlistId
) {

    if (
        selectedPlaylistSong < 0
    )
        return;


    const song =
        songs[
            selectedPlaylistSong
        ];


    if (!song)
        return;


    const playlist =
        playlists.find(
            item =>
                item.id ===
                playlistId
        );


    if (!playlist)
        return;


    const position =
        playlist.songIds.indexOf(
            song.id
        );


    if (position >= 0) {

        playlist.songIds.splice(
            position,
            1
        );

    }

    else {

        playlist.songIds.push(
            song.id
        );

    }


    await dbPut(
        PLAYLIST_STORE,
        playlist
    );


    renderPlaylists();

    openPlaylistSelector();

}


/* =====================================================
   PLAYER PLAYLIST
===================================================== */

addPlaylistFromPlayer.addEventListener(
    "click",
    () => {

        if (
            currentIndex < 0
        )
            return;


        selectedPlaylistSong =
            currentIndex;


        openPlaylistSelector();

    }
);


/* =====================================================
   OPEN PLAYLIST
===================================================== */

function openPlaylist(id) {

    const playlist =
        playlists.find(
            item =>
                item.id === id
        );


    if (!playlist)
        return;


    currentPlaylistId =
        id;


    playlistViewTitle.textContent =
        playlist.name;


    playlistMenuTitle.textContent =
        playlist.name;


    playlistViewContent.innerHTML = "";


    const hero =
        document.createElement(
            "div"
        );

    hero.className =
        "playlist-hero";


    hero.innerHTML = `

        <div class="playlist-big-icon">
            ♫
        </div>

        <div class="playlist-meta">

            <strong>
                ${escapeHTML(
                    playlist.name
                )}
            </strong>

            <span>
                ${playlist.songIds.length} songs
            </span>

        </div>

    `;


    playlistViewContent.appendChild(
        hero
    );


    const list =
        document.createElement(
            "div"
        );

    list.className =
        "song-list";


    playlist.songIds.forEach(
        songId => {

            const index =
                songs.findIndex(
                    song =>
                        song.id ===
                        songId
                );


            if (index < 0)
                return;


            const song =
                songs[index];


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "song-item";


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "song-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "song-info";


            info.innerHTML = `

                <strong>
                    ${escapeHTML(
                        song.title
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        song.artist
                    )}
                </span>

            `;


            const remove =
                document.createElement(
                    "button"
                );

            remove.className =
                "song-menu";

            remove.textContent =
                "−";


            remove.addEventListener(
                "click",
                async event => {

                    event.stopPropagation();


                    const position =
                        playlist.songIds.indexOf(
                            song.id
                        );


                    if (
                        position >= 0
                    ) {

                        playlist.songIds.splice(
                            position,
                            1
                        );

                    }


                    await dbPut(
                        PLAYLIST_STORE,
                        playlist
                    );


                    openPlaylist(
                        playlist.id
                    );

                    renderPlaylists();

                }
            );


            item.appendChild(
                cover
            );

            item.appendChild(
                info
            );

            item.appendChild(
                remove
            );


            item.addEventListener(
                "click",
                () =>
                    playSong(index)
            );


            list.appendChild(
                item
            );

        }
    );


    if (
        !playlist.songIds.length
    ) {

        list.innerHTML = `

            <div class="empty">

                <span>🎵</span>

                This playlist is empty.

            </div>

        `;

    }


    playlistViewContent.appendChild(
        list
    );


    playlistScreen.classList.add(
        "show"
    );

}


closePlaylistScreen.addEventListener(
    "click",
    () => {

        playlistScreen.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   PLAYLIST MENU
===================================================== */

playlistViewMenu.addEventListener(
    "click",
    () => {

        if (
            !currentPlaylistId
        )
            return;


        const playlist =
            playlists.find(
                item =>
                    item.id ===
                    currentPlaylistId
            );


        if (!playlist)
            return;


        playlistMenuTitle.textContent =
            playlist.name;


        playlistMenu.classList.add(
            "show"
        );

    }
);


closePlaylistMenu.addEventListener(
    "click",
    () => {

        playlistMenu.classList.remove(
            "show"
        );

    }
);


/* RENAME */

renamePlaylistBtn.addEventListener(
    "click",
    async () => {

        const playlist =
            playlists.find(
                item =>
                    item.id ===
                    currentPlaylistId
            );


        if (!playlist)
            return;


        const newName =
            prompt(
                "Enter new playlist name:",
                playlist.name
            );


        if (
            !newName ||
            !newName.trim()
        )
            return;


        playlist.name =
            newName.trim();


        await dbPut(
            PLAYLIST_STORE,
            playlist
        );


        playlistViewTitle.textContent =
            playlist.name;


        playlistMenu.classList.remove(
            "show"
        );


        renderPlaylists();

        openPlaylist(
            playlist.id
        );

    }
);


/* DELETE PLAYLIST */

deletePlaylistBtn.addEventListener(
    "click",
    async () => {

        const playlist =
            playlists.find(
                item =>
                    item.id ===
                    currentPlaylistId
            );


        if (!playlist)
            return;


        const confirmed =
            confirm(
                `Delete playlist "${playlist.name}"?`
            );


        if (!confirmed)
            return;


        await dbDelete(
            PLAYLIST_STORE,
            playlist.id
        );


        playlists =
            playlists.filter(
                item =>
                    item.id !==
                    playlist.id
            );


        currentPlaylistId =
            null;


        playlistMenu.classList.remove(
            "show"
        );

        playlistScreen.classList.remove(
            "show"
        );


        renderPlaylists();

    }
);


/* =====================================================
   QUEUE OPEN/CLOSE
===================================================== */

openQueueBtn.addEventListener(
    "click",
    () =>
        queueScreen.classList.add(
            "show"
        )
);


playerQueueBtn.addEventListener(
    "click",
    () =>
        queueScreen.classList.add(
            "show"
        )
);


closeQueue.addEventListener(
    "click",
    () =>
        queueScreen.classList.remove(
            "show"
        )
);


/* =====================================================
   CLOSE PLAYER
===================================================== */

closePlayer.addEventListener(
    "click",
    () => {

        playerScreen.classList.remove(
            "show"
        );

    }
);

/* =====================================================
   MINI PLAYER → NOW PLAYING
===================================================== */

miniPlayer.addEventListener(
    "click",
    event => {

        /*
         * Mini player-এর Play,
         * Previous এবং Next button-এ
         * চাপলে Now Playing খুলবে না।
         */
        if (
            event.target.closest("#miniPlayBtn") ||
            event.target.closest("#miniPrevious") ||
            event.target.closest("#miniNext")
        ) {
            return;
        }


        /*
         * কোনো গান selected না থাকলে
         * কিছুই করবে না।
         */
        if (
            currentIndex < 0 ||
            !songs[currentIndex]
        ) {
            return;
        }


        /*
         * শুধু Now Playing screen খুলবে।
         *
         * এখানে playSong() ব্যবহার করা হচ্ছে না।
         * তাই গান আবার শুরু হবে না।
         */
        updatePlayerUI();

        updatePlayButtons();

        playerScreen.classList.add(
            "show"
        );

    }
);

/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!query) {

            renderSongs();

            return;

        }


        const filtered =
            songs.filter(
                song =>

                    song.title
                        .toLowerCase()
                        .includes(query)

                    ||

                    song.artist
                        .toLowerCase()
                        .includes(query)

                    ||

                    (
                        song.album || ""
                    )
                    .toLowerCase()
                    .includes(query)
            );


        renderSongs(
            filtered
        );

    }
);


/* =====================================================
   SORT
===================================================== */

sortBtn.addEventListener(
    "click",
    () => {

        sortMenu.classList.add(
            "show"
        );

    }
);


sortClose.addEventListener(
    "click",
    () => {

        sortMenu.classList.remove(
            "show"
        );

    }
);


sortMenu
    .querySelectorAll(
        "[data-sort]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    sortMode =
                        button.dataset.sort;


                    renderSongs();


                    sortMenu.classList.remove(
                        "show"
                    );

                }
            );

        }
    );


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    const page =
                        button.dataset.page;


                    if (
                        page === "home"
                    ) {

                        pageTitle.textContent =
                            "My Music 🌸";

                        listTitle.textContent =
                            "All Songs";

                        recentSection.style.display =
                            "";

                        playlistSection.style.display =
                            "";

                        renderSongs();

                    }


                    if (
                        page === "songs"
                    ) {

                        pageTitle.textContent =
                            "All Songs";

                        listTitle.textContent =
                            "All Songs";

                        recentSection.style.display =
                            "none";

                        playlistSection.style.display =
                            "none";

                        renderSongs();

                    }


                    if (
                        page === "favorites"
                    ) {

                        pageTitle.textContent =
                            "Favorites ♡";

                        listTitle.textContent =
                            "Favorite Songs";

                        recentSection.style.display =
                            "none";

                        playlistSection.style.display =
                            "none";


                        renderSongs(
                            songs.filter(
                                song =>
                                    song.favorite
                            )
                        );

                    }


                    if (
                        page === "playlists"
                    ) {

                        pageTitle.textContent =
                            "Playlists ♡";

                        listTitle.textContent =
                            "All Songs";

                        recentSection.style.display =
                            "none";

                        playlistSection.style.display =
                            "";

                        renderPlaylists();

                        renderSongs();

                    }

                }
            );

        }
    );


/* =====================================================
   SEE ALL
===================================================== */

document
    .getElementById(
        "seeAllBtn"
    )
    .addEventListener(
        "click",
        () => {

            pageTitle.textContent =
                "All Songs";

            listTitle.textContent =
                "All Songs";

            recentSection.style.display =
                "none";

            playlistSection.style.display =
                "none";


            document
                .querySelectorAll(
                    ".nav-item"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            document
                .querySelector(
                    '[data-page="songs"]'
                )
                .classList.add(
                    "active"
                );


            renderSongs();

        }
    );


/* =====================================================
   VISUALIZER
===================================================== */

let audioContext = null;

let analyser = null;

let sourceNode = null;

let visualizerStarted = false;


function setupVisualizer() {

    if (visualizerStarted)
        return;


    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        analyser =
            audioContext.createAnalyser();


        analyser.fftSize =
            64;


        sourceNode =
            audioContext.createMediaElementSource(
                audio
            );


        sourceNode.connect(
            analyser
        );


        analyser.connect(
            audioContext.destination
        );


        visualizerStarted =
            true;

    }

    catch(error) {

        console.log(
            "Visualizer unavailable:",
            error
        );

    }

}


function startVisualizer() {

    setupVisualizer();


    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {

        audioContext.resume();

    }


    drawVisualizer();

}


function drawVisualizer() {

    if (
        !visualizerStarted ||
        !analyser
    )
        return;


    const canvas =
        visualizer;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    const bufferLength =
        analyser.frequencyBinCount;


    const dataArray =
        new Uint8Array(
            bufferLength
        );


    analyser.getByteFrequencyData(
        dataArray
    );


    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );


    const barWidth =
        rect.width /
        bufferLength;


    for (
        let i = 0;
        i < bufferLength;
        i++
    ) {

        const value =
            dataArray[i] / 255;


        const barHeight =
            value *
            rect.height;


        const x =
            i * barWidth;


        const y =
            rect.height -
            barHeight;


        const gradient =
            ctx.createLinearGradient(
                0,
                rect.height,
                0,
                0
            );


        gradient.addColorStop(
            0,
            "rgba(241,138,184,.2)"
        );


        gradient.addColorStop(
            1,
            "rgba(167,124,255,.85)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            x,
            y,
            Math.max(
                1,
                barWidth - 2
            ),
            barHeight
        );

    }


    requestAnimationFrame(
        drawVisualizer
    );

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(secs)
            .padStart(
                2,
                "0"
            )
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


/* =====================================================
   START
===================================================== */

init();
