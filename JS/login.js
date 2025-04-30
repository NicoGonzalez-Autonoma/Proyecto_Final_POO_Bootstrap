/* Particulas */
particlesJS('particles-js', {
    particles: {
        number: { value: 100 },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2
        }
    },
    interactivity: {
        detect_on: "window",
        events: {
            onhover: {
                enable: true,
                mode: "repulse" // o "grab"
            },
            onclick: {
                enable: true,
                mode: "push"
            }
        },
        modes: {
            repulse: { distance: 100 },
            grab: { distance: 150, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});


$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const formData = $(this).serialize();

        $.ajax({
            url: '../backend/login.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function (response) {
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
            error: function (xhr, status, error) {
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