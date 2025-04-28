<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['id'])) {
    http_response_code(403); // Forbidden
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['id'];
    $database = new DbConfig();
    $conn = $database->getConnection();

    try {
        // Iniciar una transacción para asegurar la integridad de los datos
        $conn->beginTransaction();

        // Eliminar los contactos del usuario
        $stmtContacts = $conn->prepare("DELETE FROM contacts WHERE user_id = :user_id");
        $stmtContacts->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmtContacts->execute();

        // Eliminar la cuenta del usuario
        $stmtUser = $conn->prepare("DELETE FROM users WHERE id = :user_id");
        $stmtUser->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmtUser->execute();

        // Eliminar la imagen de perfil del usuario si existe y no es la predeterminada
        $stmtSelectImage = $conn->prepare("SELECT image FROM users WHERE id = :user_id");
        $stmtSelectImage->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmtSelectImage->execute();
        $userData = $stmtSelectImage->fetch(PDO::FETCH_ASSOC);

        if ($userData && !empty($userData['image']) && $userData['image'] !== 'default.png') {
            $imagePath = '../uploads/' . $userData['image'];
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Confirmar la transacción
        $conn->commit();

        // Destruir la sesión
        session_unset();
        session_destroy();

        echo json_encode(['success' => true, 'message' => 'Cuenta eliminada exitosamente.']);

    } catch (PDOException $e) {
        // Revertir la transacción en caso de error
        $conn->rollBack();
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Error al eliminar la cuenta: ' . $e->getMessage()]);
    }

} else {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Solicitud inválida']);
}
?>