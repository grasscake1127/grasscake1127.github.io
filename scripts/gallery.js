function showImage(thumbnail) {
    const largeImage = document.getElementById("largeImage");
    largeImage.src = thumbnail.src;
    document.getElementById("overlay").style.display = "flex";
}

function hideImage() {
    document.getElementById("overlay").style.display = "none";
}