$('#openProfile').click(function (e) {
    e.preventDefault();
    $('#modalProfile').fadeIn(); // o .show()
});

$('#closeProfile, #closeProfile2').click(function () {
    $('#modalProfile').fadeOut(); // o .hide()
});

