$(document).ready(function() {
    // Event delegation for delete buttons
    $(document).on('click', '.delete-contact', function() {
        const contactId = $(this).data('id');
        
        // Show confirmation modal
        if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
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
                        // Show success message
                        alert(response.message);
                        
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
                        // Show error message
                        alert(response.message || 'Error al eliminar el contacto');
                    }
                },
                error: function() {
                    alert('Error de conexión al servidor');
                }
            });
        }
    });
});