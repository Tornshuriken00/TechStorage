<?php
include 'conn.php'; // Inclui $pdo e getJsonBody()

$data = getJsonBody();

if (isset($data['email']) && isset($data['password'])) {
    
    $email = $data['email'];
    $password = $data['password'];

    // Usando PDO e Prepared Statements para buscar o usuário
    $stmt = $pdo->prepare("SELECT id_usuario, nome_completo, papel, senha_hash, status FROM usuarios WHERE email=? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        if (password_verify($password, $user['senha_hash'])) {
            
            // Verifica o status do usuário antes de liberar o acesso
            if ($user['status'] !== 'ATIVO') {
                http_response_code(403);
                echo json_encode(["success" => false, "message" => "Usuário inativo. Contate o administrador."]);
                exit;
            }

            // Login bem-sucedido: Armazenar dados na sessão, incluindo o PAPEL
            $_SESSION['id_usuario'] = $user['id_usuario'];
            $_SESSION['papel'] = $user['papel'];
            $_SESSION['nome_completo'] = $user['nome_completo'];

            echo json_encode(["success" => true, "message" => "Login bem-sucedido"]);
        } else {
            echo json_encode(["success" => false, "message" => "Senha incorreta"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuário não encontrado"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Dados inválidos"]);
}
?>