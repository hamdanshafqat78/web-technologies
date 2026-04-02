$(function () {
    loadRecepie();
    // delegating delete click to the cards inside 'recepies' div
    $("#recepies").on("click", ".delete", handleDelete);
    // delegating edit click to the cards
    $("#recepies").on("click", ".edit", handleEdit);
    // handle click for adding new recipe
    $("#addBtn").click(addRecepie);
    // handle click for the update button inside the modal
    $("#updateSave").click(updateRecepie);
});
// this function is triggered when edit button is clicked on a recipe card
function handleEdit() {
    console.log("edit clicked");
    var btn = $(this);
    var parentDiv = btn.closest(".card");
    var id = parentDiv.attr("data-id");

    // fetch the current data for the selected recipe to pre-fill the modal
    $.get("https://usmanlive.com/wp-json/api/stories/" + id, function (response) {
        $("#updateId").val(response.id);
        $("#updateTitle").val(response.title);
        $("#updateBody").val(response.content);
        // show the modal popup
        $("#updateModal").modal("show");
    });
}
// this function performs the actual update request to the API
function updateRecepie() {
    var id = $("#updateId").val();
    var title = $("#updateTitle").val();
    var body = $("#updateBody").val();

    // performing PUT request to update the recipe content
    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + id,
        method: "PUT",
        data: {
            title: title,
            content: body
        },
        success: function (response) {
            console.log(response);
            // reload the list and hide the modal on success
            loadRecepie();
            $("#updateModal").modal("hide");
        }
    });
}
function handleDelete() {
    console.log("delete clicked");
    var btn = $(this);
    var parnentDiv = btn.closest(".card");
    var id = parnentDiv.attr("data-id");
    console.log(id);

    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + id,
        method: "DELETE",
        success: function (response) {
            console.log(response);
            loadRecepie();

        }
    });
}
function loadRecepie() {
    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "GET",
        error: function (error) {
            var rec = $("#recepies");
            rec.empty();
            rec.append("hehehehheh rasty main gum ho gye ")
        },
        success: function (response) {
            console.log(response);
            var rec = $("#recepies");
            rec.empty();
            for (var i = 0; i < response.length; i++) {
                //rec.append("<div><h3>" + response[i].title + "</h3></div>");
                //rec.append("<p>" + response[i].content + "</p>");
                rec.append(`<div class="card" data-id="${response[i].id}">
                                <h3>${response[i].title}</h3>
                                <p>${response[i].content}
                                    <button class ="delete btn btn-danger btn-sm float-right" >delete</button>
                                    <button class ="edit btn btn-warning btn-sm float-right" >edit</button>
                                </p>
                            </div>`);


            }

        }
    });
}
function addRecepie() {
    var title = $("#title").val();
    var body = $("#body").val();


    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "POST",
        data: {
            title: title,
            content: body
        },
        success: function (response) {
            console.log(response);
            loadRecepie();
        }


    });
    $("#title").val("");
    $("#body").val("");

}