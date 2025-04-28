$('#openProfile').click(function (e) {
    e.preventDefault();
    $('#modalProfile').fadeIn(); // o .show()
});

$('#closeProfile').click(function () {
    $('#modalProfile').fadeOut(); // o .hide()
});

