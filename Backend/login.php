<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start(); // Iniciar sesión
header('Content-Type: application/json');
require_once './config.php';

class Auth
{
    private $db;

    public function __construct()
    {
        $dbConfig = new DbConfig();
        $this->db = $dbConfig->getConnection();
    }

    public function authenticate($email, $password)
    {
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (password_verify($password, $row['password'])) {
                session_regenerate_id(true); // Refuerza la seguridad de la sesión
            
                $_SESSION['id'] = $row['id']; 
                $_SESSION['name'] = $row['name'];
                $_SESSION['email'] = $row['email'];
            
                return ['status' => 'success'];
            }
        }

        return ['status' => 'error', 'message' => 'Correo o contraseña incorrectos.'];
    }
}




// Si la solicitud es POST (el formulario fue enviado)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos del formulario.']);
        exit();
    }

    $email = $_POST['email'];
    $password = $_POST['password'];

    $auth = new Auth();
    $result = $auth->authenticate($email, $password);

    if ($result['status'] === 'success') {
        $_SESSION["success"] = "Login exitoso."; // Mensaje de éxito en sesión
        echo json_encode(['status' => 'success', 'redirect' => '../views/dashboard.php']);
        exit();
    } else {
        echo json_encode($result); // Devuelve el error como JSON
        exit();
    }
}
