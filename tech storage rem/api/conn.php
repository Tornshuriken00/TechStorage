/ tech storage rem/api/conn.php (FINAL E COMPLETO)
<?php
// Iniciar a sessão no topo para todas as APIs
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$host = "localhost";
$user = "root";     
$pass = "";          
$dbname = "tech_storage_leve"; 

// Conexão MySQLi (apenas se for estritamente necessário; mantida por histórico, mas PDO é preferível)
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Erro de conexão mysqli: " . $conn->connect_error);
}

// Conexão PDO (usada na maioria das APIs)
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Erro de conexão PDO: ' . $e->getMessage()]));
}

// Funções de Autenticação/Autorização
function getJsonBody() {
    return json_decode(file_get_contents("php://input"), true);
}

function getCurrentUser($pdo) {
    if (!isset($_SESSION['id_usuario'])) return null;
    $stmt = $pdo->prepare('SELECT id_usuario, nome_completo, email, papel, status FROM usuarios WHERE id_usuario = ?');
    $stmt->execute([$_SESSION['id_usuario']]);
    return $stmt->fetch();
}

function requireAuth() {
    if (!isset($_SESSION['id_usuario'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

function requireRole($pdo, $allowedRoles) {
    requireAuth();
    if (!isset($_SESSION['papel']) || !in_array($_SESSION['papel'], $allowedRoles)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }
}
?>