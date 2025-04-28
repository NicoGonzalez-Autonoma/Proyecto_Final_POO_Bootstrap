$(document).ready(function() {
    
    $(document).on('click', '.delete-contact', function() {
        const contactId = $(this).data('id');
        
        // Mostrar diálogo de confirmación con SweetAlert2
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Send AJAX request to delete contact
                $.ajax({
                    url: '../backend/delete_contact.php',
                    type: 'POST',
                    data: {
                        contact_id: contactId
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            // Mostrar mensaje de éxito con SweetAlert2
                            Swal.fire({
                                title: '¡Eliminado!',
                                text: response.message,
                                icon: 'success',
                                timer: 1500
                            });
                            
                            // Remove the contact card from the DOM
                            $(`.delete-contact[data-id="${contactId}"]`).closest('.col').fadeOut(300, function() {
                                $(this).remove();
                                
                                // Update contact count
                                const currentCount = parseInt($('.fs-5.text-muted').text().match(/\d+/)[0]);
                                const newCount = currentCount - 1;
                                $('.fs-5.text-muted').text(`Total Contactos: ${newCount}`);
                                
                                // If no contacts left, show empty state
                                if (newCount === 0) {
                                    const emptyState = `
                                        <div class="text-center my-5">
                                            <img src="../assets/background_clear.svg" alt="Sin contactos" class="img-fluid mb-3" style="max-width: 200px;">
                                            <p class="text-muted">No tienes contactos aún. Crea tu primer contacto haciendo clic en "Nuevo contacto".</p>
                                        </div>
                                    `;
                                    $('.contacts-list .row').replaceWith(emptyState);
                                }
                            });
                        } else {
                            // Mostrar mensaje de error con SweetAlert2
                            Swal.fire({
                                title: 'Error',
                                text: response.message || 'Error al eliminar el contacto',
                                icon: 'error'
                            });
                        }
                    },
                    error: function() {
                        // Mostrar error de conexión con SweetAlert2
                        Swal.fire({
                            title: 'Error',
                            text: 'Error de conexión al servidor',
                            icon: 'error'
                        });
                    }
                });
            }
        });
    });
});