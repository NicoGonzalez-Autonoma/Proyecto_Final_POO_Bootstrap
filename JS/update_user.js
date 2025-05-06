/**
 * Maneja la actualización de información del usuario
 */
class UserUpdateManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }
    
    /**
     * Inicializa los elementos del DOM
     */
    initializeElements() {
        // Modal de perfil y botones
        this.modalProfile = document.getElementById('modalProfile');
        this.openProfileBtn = document.getElementById('openProfile');
        this.closeProfileBtn = document.getElementById('closeProfile');
        this.closeProfile2Btn = document.getElementById('closeProfile2');
        this.updateOpenProfileBtn = document.getElementById('updateopenProfile');
        
        // Modal de actualización y botones
        this.updateModalProfile = document.getElementById('updatemodalProfile');
        this.updateCloseProfileBtn = document.getElementById('updatecloseProfile');
        this.updateCloseProfile2Btn = document.getElementById('updatecloseProfile2');
        this.submitUpdateProfileBtn = document.getElementById('submitupdateProfile');
        
        // Campos del formulario
        this.nameInput = document.getElementById('name');
        this.passwordInput = document.getElementById('contraseña');
        this.profileImageInput = document.getElementById('file-1');
    }
    
    /**
     * Configura los escuchadores de eventos
     */
    setupEventListeners() {
        // Evento para abrir el modal de perfil
        if (this.openProfileBtn) {
            this.openProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfileModal();
            });
        }
        
        // Eventos para cerrar el modal de perfil
        if (this.closeProfileBtn) {
            this.closeProfileBtn.addEventListener('click', () => this.hideProfileModal());
        }
        
        if (this.closeProfile2Btn) {
            this.closeProfile2Btn.addEventListener('click', () => this.hideProfileModal());
        }
        
        // Evento para abrir el modal de actualización
        if (this.updateOpenProfileBtn) {
            this.updateOpenProfileBtn.addEventListener('click', () => {
                this.hideProfileModal();
                this.showUpdateModal();
            });
        }
        
        // Eventos para cerrar el modal de actualización
        if (this.updateCloseProfileBtn) {
            this.updateCloseProfileBtn.addEventListener('click', () => this.hideUpdateModal());
        }
        
        if (this.updateCloseProfile2Btn) {
            this.updateCloseProfile2Btn.addEventListener('click', () => this.hideUpdateModal());
        }
        
        // Evento para enviar el formulario de actualización
        if (this.submitUpdateProfileBtn) {
            this.submitUpdateProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitUpdateForm();
            });
        }
    }
    
    /**
     * Muestra el modal de perfil
     */
    showProfileModal() {
        if (this.modalProfile) {
            this.modalProfile.style.display = 'block';
        }
    }
    
    /**
     * Oculta el modal de perfil
     */
    hideProfileModal() {
        if (this.modalProfile) {
            this.modalProfile.style.display = 'none';
        }
    }
    
    /**
     * Muestra el modal de actualización
     */
    showUpdateModal() {
        if (this.updateModalProfile) {
            this.updateModalProfile.style.display = 'block';
        }
    }
    
    /**
     * Oculta el modal de actualización
     */
    hideUpdateModal() {
        if (this.updateModalProfile) {
            this.updateModalProfile.style.display = 'none';
        }
    }
    
    /**
     * Envía el formulario de actualización mediante AJAX
     */
    submitUpdateForm() {
        // Crear un FormData para enviar los datos, incluido el archivo
        const formData = new FormData();
        
        // Añadir los campos al FormData
        if (this.nameInput && this.nameInput.value.trim()) {
            formData.append('name', this.nameInput.value.trim());
        }
        
        if (this.passwordInput && this.passwordInput.value.trim()) {
            formData.append('password', this.passwordInput.value.trim());
        }
        
        if (this.profileImageInput && this.profileImageInput.files[0]) {
            formData.append('image', this.profileImageInput.files[0]);
        }
        
        // Verificar si hay datos para enviar
        let hasData = false;
        for (const pair of formData.entries()) {
            hasData = true;
            break;
        }
        
        if (!hasData) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'No hay información para actualizar',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        
        // Enviar la solicitud mediante AJAX
        $.ajax({
            url: '../Backend/process_update_user.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                try {
                    const data = typeof response === 'string' ? JSON.parse(response) : response;
                    
                    if (data.success) {
                        // Mostrar mensaje de éxito
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: data.message,
                            confirmButtonColor: '#3085d6'
                        }).then(() => {
                            // Recargar la página para reflejar los cambios
                            window.location.reload();
                        });
                    } else {
                        // Mostrar mensaje de error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Error desconocido',
                            confirmButtonColor: '#3085d6'
                        });
                    }
                } catch (e) {
                    console.error('Error al procesar la respuesta:', e);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al procesar la respuesta del servidor',
                        confirmButtonColor: '#3085d6'
                    });
                }
            },
            error: (xhr, status, error) => {
                console.error('Error en la solicitud AJAX:', error);
                
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al procesar la solicitud.',
                    confirmButtonColor: '#3085d6'
                });
            }
        });
    }
}

// Inicializar el gestor de actualización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const userUpdateManager = new UserUpdateManager();
});


/* Esto nos ayuda a previsualizar la imagen que carga el usuario */
// Obtener referencias a los botones que cierran el modal
const closeButtons = document.querySelectorAll("#updatecloseProfile, #updatecloseProfile2");
const submitButton = document.getElementById("submitupdateProfile");

// Función para resetear el formulario y la imagen
function resetFormAndImage() {
  // Obtener referencia al formulario
  const form = document.querySelector("#updatemodalProfile form");
  
  // Resetear el formulario
  form.reset();
  
  // Restablecer la imagen de previsualización a la imagen predeterminada
  const previewImage = document.getElementById("previewImageUser");
  previewImage.src = "../Assets/perfil.png";
}

// Agregar evento de clic a los botones de cierre
closeButtons.forEach(button => {
  button.addEventListener("click", resetFormAndImage);
});

// También resetear después de enviar el formulario
submitButton.addEventListener("click", function() {
  // Resetear después de un pequeño retraso para permitir que se procese el envío
  setTimeout(resetFormAndImage, 100);
});

// Agregar la previsualización de la imagen cuando se selecciona un archivo
document.getElementById("file-1").addEventListener("change", function(event) {
  const previewImage = document.getElementById("previewImageUser");
  
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImage.src = e.target.result;
    };
    
    reader.readAsDataURL(this.files[0]);
  } else {
    // Si no hay archivo seleccionado, usar la imagen predeterminada
    previewImage.src = "../Assets/perfil.png";
  }
});