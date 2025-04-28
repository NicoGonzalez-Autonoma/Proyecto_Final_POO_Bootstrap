<?php
class UserUpdate {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    public function updateUserInfo($userId, $data) {
        $response = [
            'success' => false,
            'message' => 'No se pudo actualizar la información'
        ];
        
        // Iniciar la construcción de la consulta SQL
        $updateFields = [];
        $params = [];
        
        // Verificar y añadir cada campo si está presente
        if (!empty($data['name'])) {
            $updateFields[] = "name = :name";
            $params[':name'] = $data['name'];
        }
        
        if (!empty($data['password'])) {
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $updateFields[] = "password = :password";
            $params[':password'] = $hashedPassword;
        }
        
        if (!empty($data['image'])) {
            $updateFields[] = "image = :image";
            $params[':image'] = $data['image'];
        }
        
        // Si no hay campos para actualizar
        if (empty($updateFields)) {
            $response['message'] = 'No hay información para actualizar';
            return $response;
        }
        
        // Completar la consulta
        $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = :user_id";
        $params[':user_id'] = $userId;
        
        try {
            // Preparar y ejecutar la consulta
            $stmt = $this->conn->prepare($sql);
            
            // Vincular parámetros con PDO
            foreach ($params as $param => $value) {
                $stmt->bindValue($param, $value);
            }
            
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Información actualizada con éxito';
                
                // Actualizar la sesión con la nueva información
                if (!empty($data['name'])) {
                    $_SESSION['name'] = $data['name'];
                }
                
                if (!empty($data['image'])) {
                    $_SESSION['image'] = $data['image'];
                }
            } else {
                $response['message'] = 'Error al ejecutar la consulta';
            }
        } catch (PDOException $e) {
            $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
        }
        
        return $response;
    }
    
    public function uploadProfileImage($file) {
        $response = [
            'success' => false,
            'filename' => '',
            'message' => 'No se pudo subir la imagen'
        ];
        
        // Verificar si se subió correctamente el archivo
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $response['message'] = 'Error al subir el archivo: ' . $file['error'];
            return $response;
        }
        
        // Verificar el tipo de archivo
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            $response['message'] = 'Tipo de archivo no permitido. Solo se permiten JPG, PNG y GIF.';
            return $response;
        }
        
        // Generar un nombre único para el archivo
        $filename = 'user_' . uniqid() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $uploadPath = '../uploads/' . $filename;
        
        // Asegurarse de que el directorio de uploads existe
        if (!is_dir('../uploads/')) {
            mkdir('../uploads/', 0777, true);
        }
        
        // Mover el archivo al directorio de uploads
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $response['success'] = true;
            $response['filename'] = $filename;
            $response['message'] = 'Imagen subida con éxito';
        } else {
            $response['message'] = 'Error al mover el archivo subido.';
        }
        
        return $response;
    }
}