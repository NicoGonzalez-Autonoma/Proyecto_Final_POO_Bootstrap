$(document).ready(function () {
    // Mostrar modal al hacer clic en el botón de editar
    $(document).on('click', '.edit-contact', function () {
        const contactId = $(this).data('id');

        // Limpiar formulario
        $('#edit-contact-form')[0].reset();

        // Mostrar modal usando Bootstrap
        const editModal = new bootstrap.Modal(document.getElementById('edit-contact-modal'));
        editModal.show();

        // Carga datos del contacto
        $.ajax({
            url: '../backend/update_contact.php',
            type: 'POST',
            data: {
                action: 'get_contact',
                contact_id: contactId
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    const contact = response.contact;

                    // Rellenar el formulario con los datos del contacto
                    $('#edit-contact-id').val(contact.id);
                    $('#edit-nombre').val(contact.name);
                    $('#edit-celular').val(contact.phone);
                    $('#edit-direccion').val(contact.address);
                    $('#edit-etiqueta').val(contact.label);

                    // Checkbox para favoritos
                    $('#edit-is-favorite').prop('checked', parseInt(contact.is_favorite) === 1);
                } else {
                    alert(response.message || 'Error al cargar los datos del contacto');
                }
            },
            error: function () {
                alert('Error de conexión. Inténtalo de nuevo más tarde.');
            }
        });
    });

    // Esta validación permite que solo se acepten números en el input de celular
    $(document).on('input', '#edit-celular', function () {
        let inputValue = $(this).val();

        // Reemplazar cualquier carácter que no sea número
        let numbersOnly = inputValue.replace(/[^0-9]/g, '');

        // Si el valor ha cambiado, actualizar el campo y mostrar error
        if (inputValue !== numbersOnly) {
            $(this).val(numbersOnly);
            $('#celular-error').show();

            // Ocultar el mensaje de error después de 2 segundos
            setTimeout(function () {
                $('#celular-error').hide();
            }, 2000);
        }
    });

    // Manejar envío del formulario
    $('#edit-contact-form').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: '../backend/update_contact.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Ocultar modal usando Bootstrap
                    const editModal = bootstrap.Modal.getInstance(document.getElementById('edit-contact-modal'));
                    editModal.hide();

                    // Recargar la página para mostrar los cambios
                    location.reload();
                } else {
                    alert(response.message || 'Error al actualizar el contacto');
                }
            },
            error: function () {
                alert('Error de conexión. Inténtalo de nuevo más tarde.');
            }
        });
    });

    // Para mostrar el nombre del archivo seleccionado
    $('#edit-profile-image').on('change', function () {
        let fileName = $(this).val().split('\\').pop();
        if (fileName) {
            $(this).next('label').text(fileName);
        }
    });
});

/* Esto nos ayuda a previsualizar la imagen que carga el usuario */
document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('edit-profile-image');
    const previewImage = document.getElementById('previewImage');
    // Ruta de la imagen por defecto
    const defaultImage = '../assets/perfil.png';
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.src = defaultImage;
            alert('Por favor selecciona un archivo de imagen válido.');
        }
        const modal = document.getElementById('edit-contact-modal');

        modal.addEventListener('hidden.bs.modal', function () {
            // Restablece la imagen de perfil a la predeterminada
            previewImage.src = '../Assets/perfil.png'; // Ajusta esta ruta a la imagen predeterminada que usas
        });

    });
});

