<?php

// Incluir las variables de entorno
include_once '../env.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Acceder a las variables de entorno
$servername = $_ENV['DB_SERVER'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$dbname = $_ENV['DB_NAME'];

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Verificar el método de solicitud
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Verificar si los parámetros 'temperatura' y 'humedad' están presentes en la URL
        if (isset($_GET['temperatura']) && isset($_GET['humedad'])) {
            $temperatura = $_GET['temperatura'];
            $humedad = $_GET['humedad'];

            // Validar que los datos sean numéricos
            if (is_numeric($temperatura) && is_numeric($humedad)) {
                // Preparar la consulta para insertar los datos
                $sql = "INSERT INTO monitor__aula (temperatura, humedad) VALUES (?, ?)";

                // Preparar la declaración
                if ($stmt = $conn->prepare($sql)) {
                    // Enlazar los parámetros
                    $stmt->bind_param("dd", $temperatura, $humedad); // "dd" significa que ambos son números decimales
                    // Ejecutar la declaración
                    if ($stmt->execute()) {
                        echo json_encode(["message" => "Datos insertados correctamente"]);
                    } else {
                        echo json_encode(["error" => "Error al insertar datos: " . $stmt->error]);
                    }
                    $stmt->close();
                } else {
                    echo json_encode(["error" => "Error al preparar la consulta: " . $conn->error]);
                }
            } else {
                echo json_encode(["error" => "Los valores de temperatura y humedad deben ser numéricos."]);
            }
        } else {
            // Obtener los últimos datos registrados de la base de datos
            $sql = "SELECT temperatura, humedad, fecha FROM monitor__aula ORDER BY idMonitorAula DESC";

            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $data = [];
                while ($row = $result->fetch_assoc()) {
                    // Asegura que los valores son tratados como números de punto flotante
                    $row['temperatura'] = floatval($row['temperatura']);
                    $row['humedad'] = floatval($row['humedad']);
                    $data[] = $row;
                }
                echo json_encode($data);
            } else {
                echo json_encode(["message" => "No hay datos disponibles"]);
            }
        }
        break;

    case 'POST':
        // Insertar datos recibidos por el cuerpo de la solicitud (JSON)
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['temperatura']) || !isset($input['humedad'])) {
            echo json_encode(["error" => "Datos incompletos"]);
            break;
        }

        $temperatura = $conn->real_escape_string($input['temperatura']);
        $humedad = $conn->real_escape_string($input['humedad']);

        // Asegurarse de que los valores se almacenen como están
        $sql = "INSERT INTO monitor__aula (temperatura, humedad) VALUES ('$temperatura', '$humedad')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Datos insertados correctamente"]);
        } else {
            echo json_encode(["error" => "Error al insertar datos: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["error" => "Método no soportado"]);
        break;
}

$conn->close();
?>
