$(function () {
    loadRecepie();
});
function loadRecepie() {
    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "GET",
        success: function (response) {
            console.log(response);
            var rec = $("#recepies");
            rec.empty();
            for (var i = 0; i < response.length; i++) {
                //rec.append("<div><h3>" + response[i].title + "</h3></div>");
                //rec.append("<p>" + response[i].content + "</p>");
                rec.append(`<div class="card"><h3>${response[i].title}</h3><p>${response[i].content}<button class ="btn btn-danger" style="float: right;">delete</button></p></div>`);


            }

        }
    });
}