$('#updateopenProfile').click(function (e) {
    e.preventDefault();
    $('#modalProfile').hide();
    $('#updatemodalProfile').fadeIn();
});



$('#updatecloseProfile, #updatecloseProfile2').click(function () {
    $('#updatemodalProfile').fadeOut();
});


