<?php

function getUserContacts($conn, $user_id, $filter = '') {
    $contacts = [];
    
    $sql = "SELECT * FROM contacts WHERE user_id = :user_id";
    
    // Añadir filtro si existe
    if (!empty($filter)) {
        if ($filter === 'favorites') {
            $sql .= " AND is_favorite = 1";
        } else {
            // Filtrar por etiqueta
            $sql .= " AND label = :label";
        }
    }
    
    $sql .= " ORDER BY name ASC";
    
    try {
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        
        if (!empty($filter) && $filter !== 'favorites') {
            $stmt->bindParam(':label', $filter, PDO::PARAM_STR);
        }
        
        $stmt->execute();
        

        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $contacts;
    } catch (PDOException $e) {
        error_log("Error al obtener contactos: " . $e->getMessage());
        return [];
    }
}


function countUserContacts($conn, $user_id) {
    try {
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM contacts WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $row['total'];
    } catch (PDOException $e) {

        error_log("Error al contar contactos: " . $e->getMessage());
        return 0;
    }
}


?>