function update() {
    console.log("updating result ");
    var inputToShow = document.getElementById("myinput");
    var outputToShow = document.getElementById("output");
    console.log(inputToShow.value);
    outputToShow.innerHTML = inputToShow.value;
}