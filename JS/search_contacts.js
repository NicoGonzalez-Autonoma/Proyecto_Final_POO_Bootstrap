class ContactSearcher {
    constructor() {
        this.searchInput = document.querySelector('.search-container input');
        this.contactsContainer = document.querySelector('.contacts-list');
        this.debounceTimeout = null;
        this.minSearchLength = 1;
        
        this.initEventListeners();
    }
  
    initEventListeners() {
        // Add input event listener with debounce
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.handleSearch();
            }, 300); // 300ms debounce
        });
        
        // Add clear button functionality when search input is cleared
        this.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' || this.searchInput.value === '') {
                this.clearSearch();
            }
        });
    }
    
    
    handleSearch() {
        const query = this.searchInput.value.trim();
        
        // If query is too short, don't search
        if (query.length < this.minSearchLength) {
            this.clearSearch();
            return;
        }
        
      
        this.showLoadingState();
        
        fetch(`../Backend/search_contacts.php?query=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la búsqueda');
                }
                return response.json();
            })
            .then(results => {
                this.displayResults(results);
            })
            .catch(error => {
                console.error('Error searching contacts:', error);
                this.showErrorMessage('Ocurrió un error durante la búsqueda');
            });
    }
    
    /**
     * Display search results
     * @param {Array} results The search results
     */
    displayResults(results) {
        // If no results, show empty state
        if (results.length === 0) {
            this.showEmptyResults();
            return;
        }
        
        // Create HTML for results
        let html = '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">';
        
        results.forEach(contact => {
            html += `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <div class="flex-shrink-0">
                                    <div class="rounded-circle overflow-hidden bg-light" style="width: 60px; height: 60px;">
                                        ${contact.profile_image ? 
                                            `<img src="../uploads/contacts/${contact.profile_image}" 
                                                alt="${this.escapeHtml(contact.name)}" 
                                                class="w-100 h-100 object-fit-cover">` :
                                            `<img src="../assets/contacts.svg" 
                                                alt="${this.escapeHtml(contact.name)}" 
                                                class="w-100 h-100 p-2">`
                                        }
                                    </div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h5 class="mb-0">${this.escapeHtml(contact.name)}</h5>
                                        ${contact.is_favorite ? '<i class="bi bi-star-fill text-warning"></i>' : ''}
                                    </div>
                                    <p class="text-muted mb-0">
                                        ${contact.phone ? 
                                            `<i class="bi bi-telephone me-1"></i>${this.escapeHtml(contact.phone)}` : 
                                            ''}
                                    </p>
                                </div>
                            </div>
                            
                            ${contact.address ? 
                                `<p class="mb-2">
                                    <i class="bi bi-geo-alt text-muted me-1"></i>
                                    ${this.escapeHtml(contact.address)}
                                </p>` : ''
                            }
                            
                            ${contact.label ? 
                                `<span class="badge bg-light text-dark border">
                                    ${this.escapeHtml(contact.label)}
                                </span>` : ''
                            }
                        </div>
                        <div class="card-footer bg-white border-top-0">
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-outline-primary btn-sm edit-contact" 
                                    data-id="${contact.id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm delete-contact" 
                                    data-id="${contact.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        this.contactsContainer.innerHTML = html;
        
        // Reinitialize edit and delete button handlers
        this.initializeContactActions();
    }
    
    /**
     * Show empty results state
     */
    showEmptyResults() {
        this.contactsContainer.innerHTML = `
            <div class="text-center my-5">
                <img src="../assets/background_clear.svg" alt="Sin resultados" class="img-fluid mb-3" style="max-width: 200px;">
                <p class="text-muted">No se encontraron contactos que coincidan con tu búsqueda.</p>
            </div>
        `;
    }
    
    /**
     * Show loading state
     */
    showLoadingState() {
        this.contactsContainer.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="text-muted mt-2">Buscando contactos...</p>
            </div>
        `;
    }
    
    /**
     * Show error message
     * @param {string} message The error message
     */
    showErrorMessage(message) {
        this.contactsContainer.innerHTML = `
            <div class="alert alert-danger my-3" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
            </div>
        `;
    }
    
    /**
     * Clear search and display all contacts
     */
    clearSearch() {
        if (this.searchInput.value.trim() === '') {
            // Reload the page to show all contacts
            location.reload();
        }
    }
    
    /**
     * Escape HTML special characters
     * @param {string} unsafe The unsafe string
     * @return {string} The escaped string
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    

    initializeContactActions() {
        // Initialize edit buttons
        document.querySelectorAll('.edit-contact').forEach(button => {
            button.addEventListener('click', function() {
                const contactId = this.getAttribute('data-id');
                // Use existing edit contact functionality
                if (typeof editContact === 'function') {
                    editContact(contactId);
                }
            });
        });
        
        // Initialize delete buttons
        document.querySelectorAll('.delete-contact').forEach(button => {
            button.addEventListener('click', function() {
                const contactId = this.getAttribute('data-id');
                // Use existing delete contact functionality
                if (typeof deleteContact === 'function') {
                    deleteContact(contactId);
                }
            });
        });
    }
}

// Initialize the search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactSearcher = new ContactSearcher();
});