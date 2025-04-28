<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start(); // Iniciar sesión
header('Content-Type: application/json');
require_once './config.php';

class Auth {
    private $db;

    public function __construct()
    {
        $dbConfig = new DbConfig();
        $this->db = $dbConfig->getConnection();
    }

    public function authenticate($email, $password)
    {
        // Validar que el email tenga un formato válido
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 'error',
                'message' => 'El formato del correo electrónico no es válido.',
                'title' => 'Error de formato'
            ];
        }

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
                $_SESSION['image'] = $row['image'] ?? null;
                
                return [
                    'status' => 'success',
                    'message' => '¡Bienvenido de nuevo, ' . $row['name'] . '!',
                    'title' => 'Login exitoso'
                ];
            }
        }

        return [
            'status' => 'error',
            'message' => 'Correo o contraseña incorrectos. Por favor, intente nuevamente.',
            'title' => 'Error de autenticación'
        ];
    }
}

// Si la solicitud es POST (el formulario fue enviado)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Faltan datos en el formulario. Por favor, complete todos los campos.',
            'title' => 'Datos incompletos'
        ]);
        exit();
    }

    // Sanitizar entradas
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'El correo y la contraseña son obligatorios.',
            'title' => 'Campos vacíos'
        ]);
        exit();
    }

    $auth = new Auth();
    $result = $auth->authenticate($email, $password);

    if ($result['status'] === 'success') {
        $_SESSION["success"] = $result['message']; // Mensaje de éxito en sesión
        echo json_encode([
            'status' => 'success',
            'redirect' => '../views/dashboard.php',
            'message' => $result['message'],
            'title' => $result['title']
        ]);
        exit();
    } else {
        echo json_encode($result); // Devuelve el error como JSON
        exit();
    }
} else {
    // Si no es una solicitud POST
    echo json_encode([
        'status' => 'error',
        'message' => 'Método de solicitud no válido.',
        'title' => 'Error de solicitud'
    ]);
    exit();
}



