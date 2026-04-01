console.log("from binding 2");

window.onload = function () {
    var btn = document.getElementById("btnAdd");
    btn.onclick = function () {
        console.log("from binding 2 in window ");

    };
}
