<?php
require_once 'config.php';

class ContactSearcher {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function searchContacts($user_id, $query) {
        try {
            
            $searchQuery = '%' . $query . '%';
            
            $sql = "SELECT id, name, phone, address, label, is_favorite, profile_image 
                   FROM contacts 
                   WHERE user_id = ? 
                   AND (name LIKE ? OR phone LIKE ? OR address LIKE ? OR label LIKE ?)
                   ORDER BY name ASC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$user_id, $searchQuery, $searchQuery, $searchQuery, $searchQuery]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error searching contacts: " . $e->getMessage());
            return [];
        }
    }
}

// Process AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['query'])) {
    session_start();
    
    // Check if user is logged in
    if (!isset($_SESSION['id'])) {
        echo json_encode(['error' => 'No autorizado']);
        exit();
    }
    
    $database = new DbConfig();
    $conn = $database->getConnection();
    
    $searcher = new ContactSearcher($conn);
    $results = $searcher->searchContacts($_SESSION['id'], $_GET['query']);
    
    header('Content-Type: application/json');
    echo json_encode($results);
    exit();
}
?>