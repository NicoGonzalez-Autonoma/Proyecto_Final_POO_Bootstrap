<?php
class ContactManager
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }


    public function getContactById($contact_id, $user_id)
    {
        try {
            $stmt = $this->conn->prepare(
                "SELECT id, name, phone, address, label, is_favorite, profile_image 
                 FROM contacts 
                 WHERE id = ? AND user_id = ?"
            );

            $stmt->execute([$contact_id, $user_id]);

            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }

            return null;
        } catch (PDOException $e) {
            error_log("Error getting contact: " . $e->getMessage());
            return null;
        }
    }


    public function processProfileImage($file)
    {
        // Define allowed file extensions
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        // Get file extension
        $fileName = $file['name'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Validate file extension
        if (!in_array($fileExt, $allowedExtensions)) {
            return null;
        }

        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            return null;
        }

        // Generate unique filename
        $newFileName = uniqid('contact_') . '.' . $fileExt;
        $uploadDir = '../uploads/contacts/';

        // Create directory if not exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . $newFileName;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return $newFileName;
        }

        return null;
    }

    /**
     * Update contact information
     */
    public function updateContact($contact_id, $user_id, $contactData, $profileImage = null)
    {
        try {
            // First verify that the contact belongs to the user
            $contact = $this->getContactById($contact_id, $user_id);

            if (!$contact) {
                return ['success' => false, 'message' => 'Contacto no encontrado o no pertenece al usuario'];
            }

            // If new image is provided, update image field
            $updateFields = [
                'name = ?',
                'phone = ?',
                'address = ?',
                'label = ?',
                'is_favorite = ?',
                /* 'updated_at = NOW()' */
            ];

            $params = [
                $contactData['name'],
                $contactData['phone'],
                $contactData['address'],
                $contactData['label'],
                $contactData['is_favorite']
            ];

            // Add image parameter if provided
            if ($profileImage !== null) {
                $updateFields[] = 'profile_image = ?';
                $params[] = $profileImage;

                // Delete old image if exists and different from default
                if (!empty($contact['profile_image']) && $contact['profile_image'] !== 'default.png') {
                    $oldImagePath = '../uploads/contacts/' . $contact['profile_image'];
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
            }

            // Add contact_id and user_id to params
            $params[] = $contact_id;
            $params[] = $user_id;

            // Update the contact
            $sql = "UPDATE contacts SET " . implode(', ', $updateFields) . " WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($sql);
            $result = $stmt->execute($params);

            if ($result) {
                return ['success' => true, 'message' => 'Contacto actualizado correctamente'];
            } else {
                return ['success' => false, 'message' => 'Error al actualizar el contacto'];
            }
        } catch (PDOException $e) {
            error_log("Error updating contact: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()];
        }
    }
    /**
     * Delete a contact
     * @param int $contact_id The ID of the contact to delete
     * @param int $user_id The ID of the user who owns the contact
     * @return array Result of the operation
     */
    public function deleteContact($contact_id, $user_id)
    {
        try {
            // First verify that the contact belongs to the user and get image information
            $contact = $this->getContactById($contact_id, $user_id);

            if (!$contact) {
                return ['success' => false, 'message' => 'Contacto no encontrado o no pertenece al usuario'];
            }

            // Prepare delete statement
            $stmt = $this->conn->prepare("DELETE FROM contacts WHERE id = ? AND user_id = ?");
            $result = $stmt->execute([$contact_id, $user_id]);

            if ($result) {
                // If contact had a custom profile image, delete it
                if (!empty($contact['profile_image']) && $contact['profile_image'] !== 'default.png') {
                    $imagePath = '../uploads/contacts/' . $contact['profile_image'];
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }

                return ['success' => true, 'message' => 'Contacto eliminado correctamente'];
            } else {
                return ['success' => false, 'message' => 'Error al eliminar el contacto'];
            }
        } catch (PDOException $e) {
            error_log("Error deleting contact: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()];
        }
    }
}
