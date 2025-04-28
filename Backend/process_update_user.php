<?php
session_start();
require_once 'config.php';
require_once 'UserUpdate.php';

// Verificar que el usuario ha iniciado sesión
if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

// Crear conexión a la base de datos
$database = new DbConfig();
$conn = $database->getConnection();

// Crear instancia de UserUpdate
$userUpdate = new UserUpdate($conn);

// Inicializar el array de datos a actualizar
$dataToUpdate = [];

// Procesar el nombre
if (!empty($_POST['name'])) {
    $dataToUpdate['name'] = $_POST['name'];
}

// Procesar la contraseña
if (!empty($_POST['password'])) {
    $dataToUpdate['password'] = $_POST['password'];
}

// Procesar la imagen de perfil
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    // Subir la imagen
    $uploadResult = $userUpdate->uploadProfileImage($_FILES['image']);
    
    if ($uploadResult['success']) {
        // Añadir el nombre del archivo a los datos para actualizar
        $dataToUpdate['image'] = $uploadResult['filename'];
    } else {
        // Si hubo un error al subir la imagen, devolver el error
        echo json_encode(['success' => false, 'message' => $uploadResult['message']]);
        exit;
    }
}

// Actualizar la información del usuario
$updateResult = $userUpdate->updateUserInfo($_SESSION['id'], $dataToUpdate);

// Devolver el resultado
echo json_encode($updateResult);