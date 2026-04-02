$(function () {
    loadRecepie();
    $("#recepies").on("click", ".delete", handleDelete);
});
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