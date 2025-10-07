<?php
include 'conn.php'; // Inclui $pdo e getJsonBody()

$data = getJsonBody();

try {
    // 1. Verificação inicial da requisição JSON
    if (!is_array($data) || empty($data)) {
        throw new Exception("Dados inválidos. O corpo da requisição não é um JSON válido ou está vazio.", 400);
    }
    
    // 2. Validação de campos obrigatórios
    if (!isset($data['nome_completo'], $data['email'], $data['password'])) {
        throw new Exception("Campos obrigatórios (nome_completo, email, password) não fornecidos.", 400);
    }
    
    $nome_completo = trim($data['nome_completo']);
    $email = trim($data['email']);
    $raw_password = $data['password'];

    // 3. Validação de campos não vazios
    if (empty($nome_completo) || empty($email) || empty($raw_password)) {
        throw new Exception("Todos os campos obrigatórios devem ser preenchidos.", 400);
    }
    
    // 4. Leitura e validação do papel (como solicitado)
    $papel = strtoupper($data['papel'] ?? 'FUNCIONARIO'); 
    $valid_roles = ['ADMIN', 'GESTOR', 'FUNCIONARIO'];
    if (!in_array($papel, $valid_roles)) {
        $papel = 'FUNCIONARIO'; 
    }

    // 5. Preparação dos dados
    $senha_hash = password_hash($raw_password, PASSWORD_DEFAULT);
    $salt = bin2hex(random_bytes(16)); 
    
    $sql = "INSERT INTO usuarios (nome_completo, email, senha_hash, salt, papel) 
            VALUES (?, ?, ?, ?, ?)";
    
    // 6. Execução via PDO
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nome_completo, $email, $senha_hash, $salt, $papel]);

    echo json_encode(["success" => true, "message" => "Cadastro realizado com sucesso"]);

} catch (PDOException $e) {
    // Trata email duplicado
    if ($e->getCode() == 23000) { 
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "O email fornecido já está cadastrado."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erro de banco de dados: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    // Trata erros de validação
    http_response_code($e->getCode() === 0 ? 500 : $e->getCode());
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>