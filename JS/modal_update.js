$('#updateopenProfile').click(function (e) {
    e.preventDefault();
    $('#modalProfile').hide();
    $('#updatemodalProfile').fadeIn();
});



$('#updatecloseProfile').click(function () {
    $('updatemodalProfile').fadeOut();
});


