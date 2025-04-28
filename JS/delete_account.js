class AccountManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async deleteAccount() {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro de eliminar tu cuenta?',
                text: "Esta acción eliminará tu cuenta y todos tus contactos permanentemente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar mi cuenta',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                return await this._sendDeleteRequest();
            }
            return { success: false, message: 'Eliminación de cuenta cancelada.' };
        } catch (error) {
            console.error("Error al confirmar la eliminación:", error);
            return { success: false, message: 'Hubo un error al procesar tu solicitud.' };
        }
    }

    async _sendDeleteRequest() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'Error al eliminar la cuenta en el servidor.' };
            }

            return await response.json();
        } catch (error) {
            console.error("Error en la petición de eliminación:", error);
            return { success: false, message: 'Hubo un error de conexión con el servidor.' };
        }
    }
}

$(document).ready(function() {
    const deleteAccountButton = $('#delete-user-account');
    const accountManager = new AccountManager('../Backend/delete_account.php'); // Ajusta la ruta si es necesario

    deleteAccountButton.on('click', async function() {
        console.log('Botón de eliminar cuenta clickeado'); // Agrega esta línea
        event.preventDefault(); // Asegúrate de que el comportamiento predeterminado del botón no cause una recarga

        
        const result = await accountManager.deleteAccount();

        if (result.success) {
            Swal.fire(
                '¡Cuenta eliminada!',
                result.message,
                'success'
            ).then(() => {
                window.location.href = '../index.html'; // Redirigir al login
            });
        } else {
            Swal.fire(
                'Error',
                result.message,
                'error'
            );
        }
    });
});