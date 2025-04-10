<?php
session_start();
require_once './config.php';

class UserManager {
    private $db;

    public function __construct() {
        try {
            $dbConfig = new DbConfig();
            $this->db = $dbConfig->getConnection();
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            throw new Exception("Error al conectar con la base de datos.");
        }
    }

    public function deleteUser($email) {
        try {
            $sql = "DELETE FROM users WHERE email = :email";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);

            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    session_destroy(); // Destruir sesión al eliminar usuario
                    return true;
                } else {
                    throw new Exception("No se encontró un usuario con este correo.");
                }
            } else {
                throw new Exception("No fue posible eliminar el usuario.");
            }
        } catch (PDOException $e) {
            error_log("Error en la consulta SQL: " . $e->getMessage());
            throw new Exception("Error al ejecutar la eliminación.");
        }
    }
}

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Método de solicitud no válido.");
    }

    if (!isset($_SESSION['email'])) {
        throw new Exception("No hay usuario autenticado.");
    }

    $email = $_SESSION['email'];
    $userManager = new UserManager();
    $result = $userManager->deleteUser($email);

    if ($result) {
        $_SESSION["success"] = "Cuenta eliminada con éxito.";
        header('Location: ../index.php');
        exit();
    } else {
        throw new Exception("Error al eliminar usuario.");
    }
} catch (Exception $e) {
    $_SESSION["error"] = $e->getMessage();
    header('Location: ../views/error.php'); // Redirigir a una página de error
    exit();
}
?>