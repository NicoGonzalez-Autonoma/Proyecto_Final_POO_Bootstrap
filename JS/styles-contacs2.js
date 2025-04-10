// JavaScript para manejar la creación de contactos con Bootstrap
document.addEventListener('DOMContentLoaded', function () {
  
    const crearContactoBtn = document.getElementById('contacts');
    let nombreOriginal = '';
  
    // Verificar si el botón existe
    if (crearContactoBtn) {
      crearContactoBtn.addEventListener('click', function () {
        // Modificar los estilos del contenedor principal
        const contactsContainer = document.querySelector('.contacts');
        const searchContainer = document.querySelector('.search-container');
        const body = document.body;
  
        body.classList.toggle('creating-contact-mode');
  
        // Si estamos en modo de creación de contacto
        if (body.classList.contains('creating-contact-mode')) {
          // Cambiar el título del contenedor de contactos
          if (contactsContainer) {
            const title = contactsContainer.querySelector('h3');
            if (title) {
              // Guardar el nombre original antes de cambiarlo
              nombreOriginal = title.textContent;
              title.textContent = 'Crear Contacto';
            }
  
            // Obtener el contenedor de la lista de contactos
            const contactsContent = document.querySelector('.container.mt-4');
            if (contactsContent) {
              // Guardar el contenido original para restaurarlo después
              contactsContent.setAttribute('data-original-content', contactsContent.innerHTML);
              contactsContent.innerHTML = `
                  <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">
                      <div class="card shadow">
                        <div class="card-header bg-white py-3">
                          <div class="d-flex justify-content-between align-items-center">
                            <button type="button" class="btn btn-link text-dark p-0" id="cancel-create-contact">
                              <i class="bi bi-arrow-left fs-4"></i>
                            </button>
                            <h5 class="mb-0">Crear Contacto</h5>
                            <button type="button" class="btn btn-primary" id="save-contact">Guardar</button>
                          </div>
                        </div>
                        <div class="card-body">
                          <form action="../Backend/create_contact..php" method="POST" enctype="multipart/form-data">
                            <div class="text-center mb-4">
                              <div class="position-relative d-inline-block">
                                <div class="rounded-circle overflow-hidden bg-light" style="width: 120px; height: 120px;">
                                  <img src="../assets/contacts.svg" alt="Foto de perfil" id="profile-preview" class="w-100 h-100 object-fit-cover">
                                </div>
                                <label for="profile_image" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; cursor: pointer;">
                                  <i class="bi bi-plus"></i>
                                </label>
                                <input type="file" name="profile_image" id="profile_image" accept="image/*" class="d-none">
                              </div>
                            </div>
                            
                            <div class="mb-3">
                              <div class="form-check form-switch d-flex justify-content-end">
                                <input class="form-check-input me-2" type="checkbox" id="favorite-contact">
                                <label class="form-check-label" for="favorite-contact">
                                  <i class="bi bi-star-fill text-warning"></i> Favorito
                                </label>
                                <input type="hidden" name="favorito" id="favorito-value" value="0">
                              </div>
                            </div>
                            
                            <div class="mb-3">
                              <label for="nombre" class="form-label">Nombre</label>
                              <input type="text" class="form-control" id="nombre" name="nombre" required>
                            </div>
                            
                            <div class="mb-3">
                              <label for="celular" class="form-label">Celular</label>
                              <input type="tel" class="form-control" id="celular" name="celular">
                            </div>
                            
                            <div class="mb-3">
                              <label for="direccion" class="form-label">Dirección</label>
                              <input type="text" class="form-control" id="direccion" name="direccion">
                            </div>
                            
                            <div class="mb-3">
                              <label for="etiqueta" class="form-label">Etiqueta</label>
                              <select class="form-select" id="etiqueta" name="etiqueta">
                                <option value="">Seleccione una etiqueta</option>
                                <option value="familia">Familia</option>
                                <option value="amigos">Amigos</option>
                                <option value="trabajo">Trabajo</option>
                                <option value="escuela">Escuela</option>
                              </select>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  `;
  
              // Añadir evento para el botón de cancelar
              const cancelBtn = contactsContent.querySelector('#cancel-create-contact');
              if (cancelBtn) {
                cancelBtn.addEventListener('click', function () {
                  // Restaurar el estado original
                  body.classList.remove('creating-contact-mode');
                  // Recuperar el contenido original
                  contactsContent.innerHTML = contactsContent.getAttribute('data-original-content');
                  // Restaurar el título original
                  const title = contactsContainer.querySelector('h3');
                  if (title) {
                    title.textContent = nombreOriginal;
                  }
                });
              }
  
              // Añadir evento para el botón de guardar
              const saveBtn = contactsContent.querySelector('#save-contact');
              if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                  const form = contactsContent.querySelector('form');
                  if (form && form.checkValidity()) {
                    form.submit();
                  } else {
                    // Activar validación de formulario de Bootstrap
                    form.classList.add('was-validated');
                  }
                });
              }
  
              // Añadir evento para el botón de favoritos
              const favoriteSwitch = contactsContent.querySelector('#favorite-contact');
              const favoritValue = contactsContent.querySelector('#favorito-value');
              if (favoriteSwitch && favoritValue) {
                favoriteSwitch.addEventListener('change', function() {
                  favoritValue.value = this.checked ? '1' : '0';
                });
              }
  
              // Añadir evento para previsualizar la imagen de perfil
              const profileInput = contactsContent.querySelector('#profile_image');
              const profilePreview = contactsContent.querySelector('#profile-preview');
  
              if (profileInput && profilePreview) {
                profileInput.addEventListener('change', function () {
                  const file = this.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      profilePreview.src = e.target.result;
                    }
                    reader.readAsDataURL(file);
                  }
                });
              }
            }
          }
        }
        // Si no estamos en modo de creación, restaurar todo
        else {
          // Obtener el contenedor principal
          const contactsContent = document.querySelector('.container.mt-4');
          if (contactsContent && contactsContent.hasAttribute('data-original-content')) {
            // Recuperar el contenido original
            contactsContent.innerHTML = contactsContent.getAttribute('data-original-content');
            // Restaurar el título original
            const title = contactsContainer.querySelector('h3');
            if (title) {
              title.textContent = nombreOriginal;
            }
          }
  
          // Restaurar el estilo de la barra de búsqueda
          if (searchContainer) {
            searchContainer.style.backgroundColor = '';
            searchContainer.style.boxShadow = '';
          }
        }
      });
    }
  });