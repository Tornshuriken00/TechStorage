-- Tech Storage SQL (versão completa)
CREATE DATABASE IF NOT EXISTS techstorage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techstorage;

-- 🔐 Usuários (com cargos)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo ENUM('funcionario','gestor','admin') NOT NULL DEFAULT 'funcionario',
  criado_em DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ⚙️ Unidades de medida
CREATE TABLE IF NOT EXISTS unidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  sigla VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 📍 Locais (ex: setores ou áreas do estoque)
CREATE TABLE IF NOT EXISTS locais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 🏭 Armazéns
CREATE TABLE IF NOT EXISTS armazens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(255),
  responsavel VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 📦 Itens de estoque
CREATE TABLE IF NOT EXISTS itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  unidade_id INT,
  armazem_id INT,
  quantidade DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (unidade_id) REFERENCES unidades(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (armazem_id) REFERENCES armazens(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 🔄 Transações de entrada e saída
CREATE TABLE IF NOT EXISTS transacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('entrada','saida') NOT NULL,
  item_id INT NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  data DATETIME NOT NULL,
  local_id INT,
  usuario_id INT,
  observacao VARCHAR(255),
  FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (local_id) REFERENCES locais(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
