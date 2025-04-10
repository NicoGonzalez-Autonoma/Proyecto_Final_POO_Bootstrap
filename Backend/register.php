<?php
session_start();
require_once("./config.php");

class Register {
    private $db;

    public function __construct() {
        $dbConfig = new DbConfig();
        $this->db = $dbConfig->getConnection();
    }

    public function registerUser($name, $email, $password) {
        try {
            // Validar datos
            if (empty($name)) throw new Exception("Invalid name.");
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new Exception("Invalid email.");
            
            if (empty($password)) throw new Exception("Invalid password.");

            // Verificar si el email ya está registrado
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
            $stmt->execute([':email' => $email]);
            if ($stmt->fetchColumn() > 0) throw new Exception("The email is already registered.");

            // Encriptar contraseña
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insertar usuario
            $stmt = $this->db->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password' => $hashedPassword,
            ]);

            $_SESSION["success"] = "Registration successful. You can now log in.";
            header("Location: ../views/login.php");
            exit();

        } catch (Exception $e) {
            $_SESSION["error"] = $e->getMessage();
            header("Location: ../views/register.php");
            exit();
        }
    }
}

// Si se envió el formulario por POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $register = new Register();
    $register->registerUser($_POST['name'], $_POST['email'], $_POST['password']);
}
?>
