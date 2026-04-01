


function bindingFunction() {
    console.log("from binding function");
    var fieldText = document.getElementById("textField");
    var txt_node = document.createTextNode(fieldText.value);
    var ul = document.getElementById("ul_list");
    var new_li_item = document.createElement("li");
    new_li_item.appendChild(txt_node);

    var btn = document.createElement("button");
    btn.innerText= "delete";
    btn.onclick = handleDelete;
    new_li_item.appendChild(btn);




    ul.appendChild(new_li_item);
    


  

    fieldText.value =  "";

}
function handleDelete(e) {
    var tag = e.target;
    var li = tag.parentNode;  
    li.parentNode.removeChild(li);
}

window.onload = function () {
    console.log("window loaded");
    var btn = document.getElementById("btnAdd");
    btn.onclick = bindingFunction;
}
