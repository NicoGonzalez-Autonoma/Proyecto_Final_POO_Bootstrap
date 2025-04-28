<?php
class DbConfig {
    private $host = '127.0.0.1:3306';
    private $db_name = 'agenda2';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
            die("Error de conexión: " . $exception->getMessage()); // 🚨 Si ves esto en el navegador, es un problema
        }
        return $this->conn;
    }
}
?>
