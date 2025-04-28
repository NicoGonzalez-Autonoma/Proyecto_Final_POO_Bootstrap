$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        
        $.ajax({
            url: '../backend/login.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                console.log("Respuesta del servidor:", response);
                
                // Si el login fue exitoso
                if (response.status === 'success') {
                    Swal.fire({
                        title: response.title || '¡Bienvenido!',
                        text: response.message || 'Login exitoso',
                        icon: 'success',
                        timer: response.timer || 20000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "../views/dashboard.php";
                    });
                } else {
                    // Si hubo error, mostrar botón "OK" y no usar timer
                    Swal.fire({
                        title: response.title || 'Error',
                        text: response.message || 'Ocurrió un error durante la autenticación',
                        icon: 'error',
                        showConfirmButton: true,
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error("Error en la petición AJAX:", error);
                console.error("Estado HTTP:", xhr.status);
                console.error("Respuesta del servidor:", xhr.responseText);
                
                Swal.fire({
                    title: 'Error de conexión',
                    text: "Hubo un problema con el servidor. Inténtelo más tarde.",
                    icon: 'error',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                });
            }
        });
    });
});