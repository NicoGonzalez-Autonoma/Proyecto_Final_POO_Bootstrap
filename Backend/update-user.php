<?php
session_start();
require_once("./config.php"); // Se mantiene la configuración

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (!isset($_SESSION['email'])) {
            throw new Exception("No hay usuario autenticado.");
        }

        $email = $_SESSION['email'];
        $fieldsToUpdate = [];
        $values = [];

        // Actualizar contraseña si se proporciona
        if (!empty($_POST['password'])) {
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $fieldsToUpdate[] = "password = :password";
            $values[':password'] = $password;
        }

        // Validar y actualizar edad
        if (!empty($_POST['edad'])) {
            $age = filter_var($_POST['edad'], FILTER_VALIDATE_INT);
            if ($age <= 0 || $age >= 120) {
                throw new Exception("Edad inválida.");
            }
            $fieldsToUpdate[] = "edad = :edad";
            $values[":edad"] = $age;
        }

        // Actualizar imagen de perfil
        if (!empty($_FILES['profile_image']['name'])) {
            $image = $_FILES['profile_image']['name'];
            move_uploaded_file($_FILES['profile_image']['tmp_name'], '../assets/profile_pics/' . $image);
            $fieldsToUpdate[] = "image = :profile_image";
            $values[':profile_image'] = $image;
            $_SESSION["image"] = $image;
        }

        // Verificar si hay algo para actualizar
        if (empty($fieldsToUpdate)) {
            throw new Exception("No se ha seleccionado ningún campo para actualizar.");
        }

        // Construir la consulta
        $query = "UPDATE users SET " . implode(", ", $fieldsToUpdate) . " WHERE email = :email";
        $values[':email'] = $email;

        // Ejecutar la consulta
        $dbConfig = new DbConfig();
        $db = $dbConfig->getConnection();
        $stmt = $db->prepare($query);

        if ($stmt->execute($values)) {
            $_SESSION["success"] = "Se han actualizado los datos correctamente.";
            header("Location: ../views/dashboard.php");
            exit();
        } else {
            throw new Exception("No fue posible actualizar los datos.");
        }
    }
} catch (PDOException $e) {
    $_SESSION["error"] = "Error de base de datos: " . $e->getMessage();
    header("Location: ../views/dashboard.php");
    exit();
} catch (Exception $e) {
    $_SESSION["error"] = $e->getMessage();
    header("Location: ../views/dashboard.php");
    exit();
}
