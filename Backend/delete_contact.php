<?php
session_start();
require_once '../backend/config.php';
require_once '../backend/contact_manager.php';

// Check if user is logged in
if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión']);
    exit();
}

// Check if request is POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate contact_id
    if (!isset($_POST['contact_id']) || empty($_POST['contact_id'])) {
        echo json_encode(['success' => false, 'message' => 'ID de contacto no válido']);
        exit();
    }
    
    // Initialize database connection
    $database = new DbConfig();
    $conn = $database->getConnection();
    $contactManager = new ContactManager($conn);
    
    // Get contact ID and user ID
    $contact_id = intval($_POST['contact_id']);
    $user_id = $_SESSION['id'];
    
    // Delete the contact
    $result = $contactManager->deleteContact($contact_id, $user_id);
    
    // Return result as JSON
    echo json_encode($result);
    exit();
}

// If not a POST request, return error
echo json_encode(['success' => false, 'message' => 'Solicitud inválida']);
exit();
?>