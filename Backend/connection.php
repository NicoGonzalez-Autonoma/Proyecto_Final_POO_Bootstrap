<?php


class DbConfig {

private $host = "localhost";
private $username = "root";
private $password = "";

private $dbname = "agenda2";

public function getConnection(){

    try {
        $conn = new PDO("mysql:host=$this->host;dbname=$this->dbname",$this->username,$this->password);
        $conn->setAttribute(PDO::ATTR_ERRMODE,  PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        echo 'Falló la conexión: ' . $e->getMessage();
    }

}

}

?>