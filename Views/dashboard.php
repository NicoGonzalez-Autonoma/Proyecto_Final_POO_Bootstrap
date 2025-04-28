<?php
session_start();
require_once '../backend/config.php';
require_once '../Backend/list_contacs.php';



if (!isset($_SESSION['id'])) {
    header("Location: ../views/login.php");
    exit();
}



$database = new DbConfig();
$conn = $database->getConnection();

$user_id = $_SESSION['id'];

$filter = isset($_GET['filter']) ? $_GET['filter'] : '';


$contacts = getUserContacts($conn, $user_id, $filter);
$contactCount = countUserContacts($conn, $user_id);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../assets/logo.png">
    <title>Your Agenda</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet">
    <link rel="stylesheet" href="../CSS/dashboard.css">
</head>

<body>
    <div class="container-fluid p-0">
        <div class="row g-0">
            <div class="col p-0">
                <!-- Barra de navegación superior -->
                <nav class="navbar navbar-light bg-white border-bottom py-2 px-3">
                    <div class="container-fluid">
                        <div class="d-flex align-items-center">
                            <div class="sidebar-icon me-3">
                                <img src="../assets/contacts.svg" alt="Contactos" class="img-fluid">
                            </div>
                            <span class="navbar-brand mb-0 h1">Agenda</span>
                        </div>

                        <div class="d-flex align-items-center">
                            <div class="input-group me-3 search-container">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control bg-light border-start-0" placeholder="Buscar">
                            </div>

                            <div class="dropdown">
                                <button class="btn p-0" type="button" id="userDropdown" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <img src="../assets/admin-user.png" alt="Usuario" width="32" height="32"
                                        class="rounded-circle">
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li><a class="dropdown-item" href="" id="openProfile">Mi perfil</a></li>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li><a class="dropdown-item" href="../Backend/logout.php">Cerrar sesión</a></li>
                                    <li><a class="dropdown-item" id="ayuda" href="#">Ayuda</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>



                <!-- Menú de navegación -->
                <div class="top-nav-scroll px-3 py-2 bg-white border-bottom">
                    <ul class="nav">
                        <li class="nav-item">
                            <a class="nav-link <?= !isset($_GET['filter']) ? 'active' : '' ?>"
                                href="dashboard.php">Todos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?= isset($_GET['filter']) && $_GET['filter'] == 'favorites' ? 'active' : '' ?>"
                                href="dashboard.php?filter=favorites">Favoritos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?= isset($_GET['filter']) && $_GET['filter'] == 'etiquetas' ? 'active' : '' ?>"
                                href="dashboard.php?filter=etiquetas">Etiquetas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?= isset($_GET['filter']) && $_GET['filter'] == 'direcciones' ? 'active' : '' ?>"
                                href="dashboard.php?filter=direcciones">Direcciones</a>
                        </li>
                        <li class="nav-item ms-auto">
                            <button id="contacts" class="btn btn-primary">
                                <i class="bi bi-plus-lg"></i> Nuevo contacto
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Contenido principal - donde se mostrará la lista de contactos o el formulario -->
                <div class="contacts">
                    <div class="container mt-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 class="fs-2">Hola, <?= htmlspecialchars($_SESSION['name']) ?></h1>
                                <h2 class="fs-5 text-muted">Total Contactos: <?= $contactCount ?></h2>
                            </div>
                        </div>

                        <div class="contacts-list">
                            <?php if (empty($contacts)): ?>
                                <div class="text-center my-5">
                                    <img src="../assets/background_clear.svg" alt="Sin contactos" class="img-fluid mb-3"
                                        style="max-width: 200px;">
                                    <p class="text-muted">No tienes contactos aún. Crea tu primer contacto haciendo clic en
                                        "Nuevo contacto".</p>
                                </div>
                            <?php else: ?>
                                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                    <?php foreach ($contacts as $contact): ?>
                                        <div class="col">
                                            <div class="card h-100 shadow-sm">
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center mb-3">
                                                        <div class="flex-shrink-0">
                                                            <div class="rounded-circle overflow-hidden bg-light"
                                                                style="width: 60px; height: 60px;">
                                                                <?php if (!empty($contact['profile_image'])): ?>
                                                                    <img src="../uploads/contacts/<?= htmlspecialchars($contact['profile_image']) ?>"
                                                                        alt="<?= htmlspecialchars($contact['name']) ?>"
                                                                        class="w-100 h-100 object-fit-cover">
                                                                <?php else: ?>
                                                                    <img src="../assets/contacts.svg"
                                                                        alt="<?= htmlspecialchars($contact['name']) ?>"
                                                                        class="w-100 h-100 p-2">
                                                                <?php endif; ?>
                                                            </div>
                                                        </div>
                                                        <div class="flex-grow-1 ms-3">
                                                            <div class="d-flex justify-content-between align-items-center">
                                                                <h5 class="mb-0"><?= htmlspecialchars($contact['name']) ?></h5>
                                                                <?php if (!empty($contact['is_favorite'])): ?>
                                                                    <i class="bi bi-star-fill text-warning"></i>
                                                                <?php endif; ?>
                                                            </div>
                                                            <p class="text-muted mb-0">
                                                                <?php if (!empty($contact['phone'])): ?>
                                                                    <i class="bi bi-telephone me-1"></i>
                                                                    <?= htmlspecialchars($contact['phone']) ?>
                                                                <?php endif; ?>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <?php if (!empty($contact['address'])): ?>
                                                        <p class="mb-2">
                                                            <i class="bi bi-geo-alt text-muted me-1"></i>
                                                            <a href="#" class="address-link"
                                                                data-address="<?= htmlspecialchars($contact['address']) ?>">
                                                                <?= htmlspecialchars($contact['address']) ?>
                                                            </a>
                                                        </p>
                                                    <?php endif; ?>

                                                    <?php if (!empty($contact['label'])): ?>
                                                        <span class="badge bg-light text-dark border">
                                                            <?= htmlspecialchars($contact['label']) ?>
                                                        </span>
                                                    <?php endif; ?>
                                                </div>
                                                <div class="card-footer bg-white border-top-0">
                                                    <div class="d-flex justify-content-end gap-2">
                                                        <button type="button" class="edit-contact"
                                                            class="btn btn-outline-primary btn-sm edit-contact"
                                                            data-id="<?= $contact['id'] ?>">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                        <button type="button"
                                                            class="btn btn-outline-danger btn-sm delete-contact"
                                                            data-id="<?= $contact['id'] ?>">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- Modal para visualizacion del perfil de usuario -->
                <div id="modalProfile"
                    style="display:none; z-index:1; position:fixed; top:20%; left:45%; transform:translateX(-50%);
                    background:white; margin:20px; padding:20px; border:1px solid #ccc; box-shadow:0 8px 16px rgba(0,0,0,0.2); max-width:90% ;width:400px;"
                    tabindex="2">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <form>
                                <div class="modal-header">
                                    <h3 class="modal-title" id="modalProfileLabel">Mi Perfil</h3>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"
                                        id="closeProfile"></button>
                                </div>

                                <div class="modal-body-1">
                                    <div class="moda-body-2 d-flex justify-content-center">
                                        <div class="mb-3 div-img">
                                            <img src="../uploads/<?php echo htmlspecialchars($_SESSION['image']) ? htmlspecialchars($_SESSION['image']) : '../assets/perfil.png'; ?>"
                                                alt="Foto de perfil" style="width:100px; border-radius:50%;">
                                        </div>
                                    </div>


                                    <div class="mb-3">
                                        <label class="name">Usuario:</label>
                                        <h5><?php echo htmlspecialchars($_SESSION['name']); ?></h5>
                                    </div>

                                    <div class="mb-3">
                                        <label for="name" class="form-label">Email:</label>
                                        <h5><?php echo htmlspecialchars($_SESSION['email']); ?></h5>
                                    </div>


                                    <div class="modal-footer gap-3">
                                        <button class="btn btn-danger" id="delete-user-account">
                                            <i class="fas fa-user-times"></i> Eliminar cuenta
                                        </button>
                                        <button type="button" class="btn btn-primary"
                                            id="updateopenProfile">Actualizar</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- Modal Para Actualizar Información del Usuario-->
    <div id="updatemodalProfile"
        style="display:none; z-index:1; position:fixed; top:20%; left:45%; transform:translateX(-50%); background:white; margin:20px; padding:20px; border:1px solid #ccc; box-shadow:0 8px 16px rgba(0,0,0,0.2); max-width:90% ;width:400px;"
        tabindex="2">
        <div class="modal-dialog">
            <div class="modal-content">

                <form action="" method="POST" enctype="multipart/form-data">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalProfileLabel">Actualizar Información</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"
                            id="updatecloseProfile2"></button>
                    </div>

                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Usuario: <?= htmlspecialchars($_SESSION['name']) ?></label>
                            <h6></h6>
                        </div>

                        <div class="mb-3">
                            <label for="name" class="form-label">Nuevo Nombre:</label>
                            <input type="text" name="name" id="name" class="form-control">
                        </div>

                        <div class="mb-3">
                            <label for="contraseña" class="form-label">Nueva contraseña:</label>
                            <input type="password" name="contrasena" id="contraseña" class="form-control">
                        </div>

                        <div class="mb-3">
                            <label for="file-1" class="form-label">Foto de perfil:</label>
                            <input type="file" name="imagen-perfil" id="file-1" class="form-control">
                        </div>
                    </div>

                    <div class="modal-footer gap-3">
                        <button type="submit" class="btn btn-primary" id="submitupdateProfile">Confirmar</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            id="updatecloseProfile">Cerrar</button>
                    </div>
                </form>

            </div>
        </div>


    </div>

    <!-- Modal para crear contactos -->
    <div class="modal fade position-absolute justify-content-center" id="create-contact-modal" tabindex="-1"
        aria-labelledby="createContactModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createContactModalLabel">Crear Contacto</h5>

                </div>
                <div class="modal-body">
                    <form id="create-contact-form" method="POST">
                        <div class="row">
                            <!-- Columna izquierda con imagen de perfil -->
                            <div class="col-md-4 text-center">
                                <div class="position-relative d-inline-block mb-3">
                                    <div class="rounded-circle overflow-hidden bg-light"
                                        style="width: 120px; height: 120px;">
                                        <img src="../assets/contacts.svg" alt="Foto de perfil" id="profile-preview"
                                            class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <label for="profile_image"
                                        class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 36px; height: 36px; cursor: pointer;">
                                        <i class="bi bi-plus"></i>
                                    </label>
                                    <input type="file" name="profile_image" id="profile_image" accept="image/*"
                                        class="d-none">
                                </div>

                                <div
                                    class="form-check form-switch d-flex justify-content-center align-items-center mb-3">
                                    <input class="form-check-input me-2" type="checkbox" id="favorite-contact">
                                    <label class="form-check-label" for="favorite-contact">
                                        <i class="bi bi-star-fill text-warning"></i> Favorito
                                    </label>
                                    <input type="hidden" name="favorito" id="favorito-value" value="0">
                                </div>
                            </div>

                            <!-- Columna derecha con campos del formulario -->
                            <div class="col-md-8">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="nombre" class="form-label">Nombre</label>
                                        <input type="text" class="form-control" id="nombre" name="nombre" required>
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="celular" class="form-label">Celular</label>
                                        <input type="tel" class="form-control" id="celular" name="celular">
                                        <span class="error-message small" id="celular-error"
                                            style="color: red; display: none;">Solo se permiten números</span>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="direccion" class="form-label">Dirección</label>
                                        <input type="text" class="form-control" id="direccion" name="direccion">
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="etiqueta" class="form-label">Etiqueta</label>
                                        <select class="form-select" id="etiqueta" name="etiqueta">
                                            <option value="">Seleccione una etiqueta</option>
                                            <option value="familia">Familia</option>
                                            <option value="amigos">Amigos</option>
                                            <option value="trabajo">Trabajo</option>
                                            <option value="escuela">Escuela</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-contact">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para editar contactos - versión compacta -->
    <form action=""></form>
    <div class="modal fade" id="edit-contact-modal" tabindex="-1" aria-labelledby="editContactModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content" style="border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
                <form id="edit-contact-form" enctype="multipart/form-data">
                    <div class="modal-header py-2">
                        <h5 class="modal-title" id="editContactModalLabel">Editar Contacto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body p-3">
                        <input type="hidden" name="contact_id" id="edit-contact-id">
                        <input type="hidden" name="action" value="update_contact">

                        <div class="mb-2">
                            <label for="edit-nombre" class="form-label mb-0 small">Nombre:</label>
                            <input type="text" class="form-control form-control-sm" name="nombre" id="edit-nombre"
                                required>
                        </div>

                        <div class="mb-2">
                            <label for="edit-celular" class="form-label mb-0 small">Teléfono:</label>
                            <input type="text" class="form-control form-control-sm" name="celular" id="edit-celular">
                            <span class="error-message small" id="celular-error" style="color: red; display: none;">Solo
                                se permiten números</span>
                        </div>

                        <div class="mb-2">
                            <label for="edit-direccion" class="form-label mb-0 small">Dirección:</label>
                            <input type="text" class="form-control form-control-sm" name="direccion"
                                id="edit-direccion">
                        </div>

                        <div class="mb-2">
                            <label for="edit-etiqueta" class="form-label mb-0 small">Etiqueta:</label>
                            <input type="text" class="form-control form-control-sm" name="etiqueta" id="edit-etiqueta">
                        </div>

                        <div class="mb-2 form-check">
                            <input type="checkbox" class="form-check-input" name="is_favorite" id="edit-is-favorite">
                            <label class="form-check-label small" for="edit-is-favorite">Favorito</label>
                        </div>

                        <div class="mb-2">
                            <label for="edit-profile-image" class="form-label mb-0 small">Foto de perfil:</label>
                            <input type="file" name="profile_image" id="edit-profile-image"
                                class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="modal-footer py-1">
                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-sm btn-primary">Actualizar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="chat-container"></div>

    <!-- Bootstrap JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Tu script de gestión de contactos -->
    <script src="../JS/jquery-3.7.1.min.js"></script>
    <script src="../js/styles-contacs2.js"></script>
    <!--  <script src="../js/sidebar.js"></script> -->
    <script src="../js/modal_update.js"></script>
    <script src="../js/chat.js"></script>
    <script src="../js/modal-info.js"></script>
    <script src="../js/modal-help.js"></script>
    <script src="../js/modal-eliminar.js"></script>
    <script src="../js/update_user.js"></script>
    <script src="../js/edit_contact.js"></script>
    <script src="../js/delete_contact.js"></script>
    <script src="../js/search_contacts.js"></script>
    <script src="../js/delete_account.js"></script>
    <!-- Google Maps API -->
    <script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&libraries=places"></script>
    <!-- Tu script de integración de mapas -->
    <script src="../js/maps-integration.js"></script>

</body>

</html>