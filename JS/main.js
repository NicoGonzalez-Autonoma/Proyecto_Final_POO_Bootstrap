jQuery(document).ready(function ($) {
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        var email = $.trim($("#email").val());
        var password = $.trim($("#password").val());

        if (email === "" || password === "") {
            $("#result").html("<p class='error'>Por favor, complete todos los campos.</p>");
            return;
        }

        $.ajax({
            url: "../backend/login.php",
            method: "POST",
            data: { email: email, password: password },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    window.location.href = "../views/dashboard.php";
                    $("#result").html("<p class='success'>Bienvenido a tu Agenda de contactos.</p>");
                } else {
                    $("#result").html("<p class='error'>" + response.message + "</p>");
                    $("#email, #password").val("");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en AJAX:", textStatus, errorThrown);
                $("#result").html("<p class='error'>Hubo un problema con la solicitud.</p>");
            }
        });
    });
});
