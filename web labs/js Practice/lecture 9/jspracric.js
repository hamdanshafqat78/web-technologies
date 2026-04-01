$(function () {
    $("#addbtn").click(handlebtnclick);
    // $("#ul_list li").click(delete_li);
    $("#ul_list").on("click", "li", delete_li);

});
function handlebtnclick() {
    //alert("btn clicked ");
    var new_value = $("#new_input").val();
    if (!new_value) {
        $("#new_input").addClass("error");
        return;
    }
    $("#ul_list").append("<li>" + new_value + "</li>");
    $("#new_input").val("");
    //$("#ul_list li").click(delete_li);
}
function delete_li() {
    $(this).fadeOut();
}