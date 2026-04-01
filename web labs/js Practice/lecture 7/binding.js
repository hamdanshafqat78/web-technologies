function handelAddNewToDo() {
    console.log("handeling new add to do button");

}

function bindingFunction() {
    console.log("handle Bindings by sir ");
    var btn = document.getElementById("btnAdd");
    btn.onclick = handelAddNewToDo;
}

///window.onload = bindingFunction;