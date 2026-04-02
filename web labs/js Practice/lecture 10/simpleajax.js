/*
$(function () {
    $("#btn").click(sendajax);
});




function sendajax() {
    console.log("sending ajax request");
    $.get("student.txt", handleResponse);
    console.log("req sent");
}
function handleResponse(Response) {
    console.log("response received");
    console.log("response: " + Response);
    $("#result").empty();
    $("#result").append(Response); 

}

that code was too messy you can do it in a better way
*/

$(function () {
    $("#btn").click(function () {
        $.get("student.txt", function (response) {
            $("#result").empty();
            $("#result").append(response);
        });

    });

    console.log("req sent");

});
