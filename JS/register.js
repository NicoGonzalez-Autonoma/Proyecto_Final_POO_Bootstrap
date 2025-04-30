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
  


$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();

        // Obtener los valores del formulario
        const name = $('input[name="name"]').val().trim();
        const email = $('input[name="email"]').val().trim();
        const password = $('input[name="password"]').val();

        // Validar campos en el frontend
        if (name === '') {
            Swal.fire({
                icon: 'error',
                title: 'Nombre requerido',
                text: 'Por favor, ingresa tu nombre.',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validar email con expresión regular simple
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Por favor, ingresa un correo electrónico válido.',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validar longitud de la contraseña
        if (password.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña muy corta',
                text: 'La contraseña debe tener al menos 8 caracteres.',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Si todo está OK, enviar el formulario vía AJAX
        const formData = $(this).serialize();

        $.ajax({
            url: '../backend/register.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                console.log("Respuesta del servidor:", response);

                if (response.status === 'success') {
                    Swal.fire({
                        title: response.title || '¡Bienvenido!',
                        text: response.message || 'Registro exitoso',
                        icon: 'success',
                        timer: response.timer || 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = response.redirect || "../views/login.php";
                    });
                } else {
                    Swal.fire({
                        title: response.title || 'Error',
                        text: response.message || 'Ocurrió un error durante el registro',
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
