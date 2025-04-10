<?php
session_start();
require_once './config.php';
require_once './contact_manager.php';

header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new DbConfig();
    $conn = $database->getConnection();
    $contactManager = new ContactManager($conn);
    
    $contact_id = isset($_POST['contact_id']) ? intval($_POST['contact_id']) : 0;
    $user_id = $_SESSION['id'];
    
    // Si estamos solicitando los datos del contacto
    if (isset($_POST['action']) && $_POST['action'] === 'get_contact') {
        $contact = $contactManager->getContactById($contact_id, $user_id);
        
        if ($contact) {
            echo json_encode(['success' => true, 'contact' => $contact]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contacto no encontrado']);
        }
        exit();
    }
    
    // Si quiere actualizar el usuario
    if (isset($_POST['action']) && $_POST['action'] === 'update_contact') {
        // Recoger datos del formulario
        $contactData = [
            'name' => trim($_POST['nombre']),
            'phone' => trim($_POST['celular']),
            'address' => trim($_POST['direccion']),
            'label' => trim($_POST['etiqueta']),
            'is_favorite' => isset($_POST['is_favorite']) ? 1 : 0
        ];
        
        // Validación básica
        if (empty($contactData['name'])) {
            echo json_encode(['success' => false, 'message' => 'El nombre del contacto es obligatorio']);
            exit();
        }
        
        // Comprobar la imagen
        $profileImage = null;
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == 0) {
            $profileImage = $contactManager->processProfileImage($_FILES['profile_image']);
            
            if ($profileImage === null) {
                echo json_encode(['success' => false, 'message' => 'Error al procesar la imagen. Verifica el formato y tamaño.']);
                exit();
            }
        }
        
        // Actualizar el contacto
        $result = $contactManager->updateContact($contact_id, $user_id, $contactData, $profileImage);
        
        echo json_encode($result);
        exit();
    }
}

echo json_encode(['success' => false, 'message' => 'Solicitud inválida']);
exit();
?>