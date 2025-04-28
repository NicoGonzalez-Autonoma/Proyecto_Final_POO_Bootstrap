<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');
require_once './config.php';


class Register {
    private $db;

    public function __construct() {
        $dbConfig = new DbConfig();
        $this->db = $dbConfig->getConnection();
    }

    public function registerUser($name, $email, $password) {
        try {
            // Validaciones
            if (empty($name)) throw new Exception("Por favor, ingresa tu nombre.");
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new Exception("El correo no tiene un formato válido.");
            if (empty($password)) throw new Exception("La contraseña no puede estar vacía.");

            // Comprobar si el correo ya existe
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
            $stmt->execute([':email' => $email]);
            if ($stmt->fetchColumn() > 0) throw new Exception("Este correo ya está registrado.");

            // Encriptar y guardar
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password' => $hashedPassword,
            ]);

            return [
                'status' => 'success',
                'title' => '¡Registro exitoso!',
                'message' => 'Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.',
                'redirect' => '../views/login.php'
            ];

        } catch (Exception $e) {
            return [
                'status' => 'error',
                'title' => 'Error de registro',
                'message' => $e->getMessage()
            ];
        }
    }
}

// Procesar solo si es POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $register = new Register();
    $response = $register->registerUser($name, $email, $password);


    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

// Peticiones no permitidas
echo json_encode([
    'status' => 'error',
    'title' => 'Solicitud inválida',
    'message' => 'Este método no está permitido.'
]);
exit();