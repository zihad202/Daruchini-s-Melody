const audioUpload = document.getElementById("audioUpload");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

audioUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    songTitle.textContent = file.name;
    artistName.textContent = "My Library";

    console.log("Audio selected:", file.name);
});
