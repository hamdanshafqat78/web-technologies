window.onload = function () {
    console.log("window loaded");
    var btn = this.document.getElementById("btnAdd");
    btn.onclick = bindingFunction;
}



function bindingFunction() {
    console.log("from binding function");
    var fieldText = document.getElementById("textField").value;
    var ul = document.getElementById("ulist");
    var litem = document.createElement("li");
    litem.textContent = fieldText;
    ul.appendChild(litem);
    document.getElementById("textField").value = "";


}
