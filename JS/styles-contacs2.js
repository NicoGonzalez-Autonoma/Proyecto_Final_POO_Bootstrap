$(document).ready(function() {
  const crearContactoBtn = $('#contacts');
  const contactModal = $('#create-contact-modal');
  const form = $('#create-contact-form');
  const saveBtn = $('#save-contact');

  // Remover el atributo action
  form.removeAttr('action');

  // Mostrar el modal al hacer clic
  crearContactoBtn.on('click', function() {
    const modal = new bootstrap.Modal(contactModal);
    modal.show();
  });

  // Validación del celular sin espacios
  $('#celular').on('input', function() {
    const rawValue = $(this).val();
    const cleanedValue = rawValue.replace(/\s/g, '');
    const isValid = /^\d+$/.test(cleanedValue);
    const hasContent = cleanedValue.length > 0;

    if (!isValid || !hasContent) {
      $('#celular-error').show();
      $(this).addClass('is-invalid');
    } else {
      $('#celular-error').hide();
      $(this).removeClass('is-invalid');
    }
  });

  // Switch de favoritos
  $('#favorite-contact').on('change', function() {
    $('#favorito-value').val($(this).prop('checked') ? '1' : '0');
  });

  // Previsualizar imagen
  $('#profile_image').on('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        $('#profile-preview').attr('src', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Guardar contacto
  saveBtn.on('click', function() {
    submitContactForm();
  });

  function submitContactForm() {
    if (!form[0].checkValidity()) {
      form.addClass('was-validated');
      return false;
    }

    // Validar celular sin espacios
    const celularValue = $('#celular').val().replace(/\s/g, '');
    if (!/^\d+$/.test(celularValue) || celularValue.length === 0) {
      $('#celular-error').show();
      $('#celular').addClass('is-invalid');
      return false;
    }

    const isFavorite = $('#favorite-contact').prop('checked') ? '1' : '0';
    $('#favorito-value').val(isFavorite);

    const formData = new FormData(form[0]);

    Swal.fire({
      title: 'Guardando contacto',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    $.ajax({
      url: '../Backend/create_contact..php',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          Swal.fire({
            title: '¡Éxito!',
            text: response.message || 'Contacto creado exitosamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            const modal = bootstrap.Modal.getInstance(contactModal);
            modal.hide();
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message || 'Ocurrió un error al crear el contacto',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
        }
      },
      error: function(xhr, status, error) {
        Swal.fire({
          title: 'Error de conexión',
          text: "Hubo un problema con el servidor. Inténtelo más tarde.",
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      }
    });
  }
});