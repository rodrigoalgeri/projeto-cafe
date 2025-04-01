-- Criação do banco de dados
CREATE DATABASE cafe_aroma;
USE cafe_aroma;

-- Tabela de Produtos
CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagem_url VARCHAR(255),
    disponivel BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_nome VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido (relacionamento entre Produtos e Pedidos)
CREATE TABLE itens_pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT,
    produto_id INT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Inserção de dados de exemplo em Produtos
INSERT INTO produtos (nome, descricao, preco, categoria) VALUES
('Café Expresso', 'Café expresso tradicional', 5.90, 'Bebidas Quentes'),
('Cappuccino', 'Café com leite vaporizado e espuma', 8.90, 'Bebidas Quentes'),
('Bolo de Chocolate', 'Bolo caseiro com cobertura de chocolate', 12.90, 'Doces');

-- Inserção de dados de exemplo em Pedidos
INSERT INTO pedidos (cliente_nome, cliente_email, valor_total) VALUES
('Maria Silva', 'maria@email.com', 27.70),
('João Santos', 'joao@email.com', 14.80),
('Ana Oliveira', 'ana@email.com', 21.80);

-- Inserção de dados de exemplo em Itens do Pedido
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 2, 5.90),
(1, 3, 1, 12.90),
(2, 2, 1, 8.90),
(2, 1, 1, 5.90),
(3, 2, 2, 8.90);