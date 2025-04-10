/* document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        const formData = new FormData(loginForm);

        try {
            const response = await fetch("../backend/login.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.status === "success") {
                // Redirigir al dashboard si el login es exitoso
                window.location.href = result.redirect || "dashboard.php";
            } else {
                // Mostrar mensaje de error si el login falla
                alert(result.message);
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
            alert("Hubo un problema con el servidor. Inténtelo más tarde.");
        }
    });
});
 */

$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault(); // Previene el envío tradicional

        $.ajax({
            url: '../backend/login.php',
            type: 'POST',
            data: $(this).serialize(), // Serializa los campos del formulario
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    // Redirigir al dashboard si el login es exitoso
                    window.location.href = response.redirect || 'dashboard.php';
                } else {
                    // Mostrar mensaje de error si el login falla
                    alert(response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la autenticación:", error);
                alert("Hubo un problema con el servidor. Inténtelo más tarde.");
            }
        });
    });
});





