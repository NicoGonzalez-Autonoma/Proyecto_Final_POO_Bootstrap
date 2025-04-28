// maps-integration.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa la funcionalidad de mapas cuando la página cargue
    initMapsFeatures();
    
    // Inicializa la funcionalidad para direcciones en la navegación
    initDirectionsFunctionality();
});

function initMapsFeatures() {
    // Añadir event listeners a todas las direcciones clickeables
    document.querySelectorAll('.address-link').forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const address = this.getAttribute('data-address');
            if (address && address !== 'Unknown') {
                showAddressOnMap(address);
            } else {
                alert('Esta dirección no puede ser mostrada en el mapa.');
            }
        });
    });
}

function showAddressOnMap(address) {
    // Crear modal para mostrar el mapa
    const mapModal = document.createElement('div');
    mapModal.className = 'modal fade';
    mapModal.id = 'mapModal';
    mapModal.setAttribute('tabindex', '-1');
    mapModal.setAttribute('aria-labelledby', 'mapModalLabel');
    mapModal.setAttribute('aria-hidden', 'true');
    
    mapModal.innerHTML = `
        <div class="modal-dialog modal-lg ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mapModalLabel">Ubicación: ${address}</h5>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <a href="https://www.google.com/maps/search/${encodeURIComponent(address)}" 
                       target="_blank" class="btn btn-primary">Ver en Google Maps</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(mapModal);
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('mapModal'));
    modal.show();
    
    // Inicializar el mapa cuando el modal esté completamente visible
    document.getElementById('mapModal').addEventListener('shown.bs.modal', function() {
        initializeMap(address);
    });
    
    // Eliminar el modal del DOM cuando se cierre
    document.getElementById('mapModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(mapModal);
    });
}

function initializeMap(address) {
    // Inicializar el mapa con la API de Google Maps
    const mapContainer = document.getElementById('map-container');
    
    // Crear un geocodificador para convertir la dirección en coordenadas
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            const mapOptions = {
                zoom: 15,
                center: results[0].geometry.location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            const map = new google.maps.Map(mapContainer, mapOptions);
            
            // Añadir marcador en la ubicación
            const marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: address
            });
            
            // Añadir ventana de información al hacer clic en el marcador
            const infoWindow = new google.maps.InfoWindow({
                content: `<div><strong>${address}</strong></div>`
            });
            
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
            
            // Abrir la ventana de información automáticamente
            infoWindow.open(map, marker);
        } else {
            mapContainer.innerHTML = `<div class="alert alert-warning">No se pudo encontrar la ubicación: ${status}</div>`;
        }
    });
}

function initDirectionsFunctionality() {
    // Si estamos en la página de direcciones, cargar todos los contactos con direcciones
    if (window.location.href.includes('filter=direcciones')) {
        loadContactsWithAddresses();
    }
}

function loadContactsWithAddresses() {
    // Esta función se activaría al cargar la sección de direcciones
    // Aquí podrías hacer una solicitud AJAX para obtener todos los contactos con direcciones
    // o simplemente mostrar los que ya están cargados
    
    console.log('Cargando contactos con direcciones...');
    
    // Si decides implementar un mapa que muestre todas las direcciones a la vez:
    // initializeMultipleAddressesMap();
}

// Esta función podría usarse par