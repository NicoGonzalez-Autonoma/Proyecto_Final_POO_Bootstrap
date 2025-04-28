<?php
session_start();

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header('Content-Type: application/json'); // Especificar que la respuesta es JSON
    
    require_once './config.php';
    $database = new DbConfig();
    $conn = $database->getConnection();
    $response = ["success" => false];
    
    // Obtener datos del formulario
    $user_id = $_SESSION['id'];
    $name = trim($_POST['nombre']);
    $phone = trim($_POST['celular']);
    $address = trim($_POST['direccion']);
    $label = trim($_POST['etiqueta']);
    $is_favorite = isset($_POST['favorito']) && $_POST['favorito'] == "1" ? 1 : 0;
    
    // Validación básica
    if (empty($name)) {
        $response["message"] = "El nombre del contacto es obligatorio";
        echo json_encode($response);
        exit();
    }
    
    // Procesar imagen de perfil si se subió
    $profile_image = NULL;
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        $filename = $_FILES['profile_image']['name'];
        $file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        // Verificar extensión
        if (in_array($file_ext, $allowed)) {
            // Crear un nombre de archivo único
            $new_filename = uniqid('contact_') . '.' . $file_ext;
            $upload_path = '../uploads/contacts/' . $new_filename;
            
            // Crear el directorio si no existe
            if (!file_exists('../uploads/contacts/')) {
                mkdir('../uploads/contacts/', 0777, true);
            }
            
            // Subir la imagen
            if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $upload_path)) {
                $profile_image = $new_filename;
            } else {
                $response["message"] = "Error al subir la imagen";
                echo json_encode($response);
                exit();
            }
        } else {
            $response["message"] = "Formato de imagen no permitido. Use: jpg, jpeg, png o gif";
            echo json_encode($response);
            exit();
        }
    }
    
    try {
        $stmt = $conn->prepare("INSERT INTO contacts (user_id, name, phone, address, label, profile_image, is_favorite)
                               VALUES (:user_id, :name, :phone, :address, :label, :profile_image, :is_favorite)");
                       
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':label', $label, PDO::PARAM_STR);
        $stmt->bindParam(':profile_image', $profile_image, PDO::PARAM_STR);
        $stmt->bindParam(':is_favorite', $is_favorite, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $response["success"] = true;
            $response["message"] = "Contacto creado exitosamente";
        }
    } catch (PDOException $e) {
        $response["message"] = "Error al crear el contacto: " . $e->getMessage();
    }
    
    echo json_encode($response);
    exit();
}
?>