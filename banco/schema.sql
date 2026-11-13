-- Banco de dados do RotaFácil (MySQL)
-- Para executar: mysql -u root -p < banco/schema.sql

DROP DATABASE IF EXISTS rotafacil;
CREATE DATABASE rotafacil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rotafacil;

-- Tabela principal: espelha a interface Viagem de src/tipos.ts
CREATE TABLE viagens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  destino    VARCHAR(100) NOT NULL,
  pais       VARCHAR(60)  NOT NULL,
  situacao   ENUM('planejada', 'confirmada', 'concluida') NOT NULL DEFAULT 'planejada',
  tipo       ENUM('lazer', 'trabalho', 'familia') NOT NULL,
  observacao VARCHAR(255) NULL,
  criada_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- O array "atividades: string[]" vira uma tabela própria (uma viagem tem várias atividades)
CREATE TABLE atividades (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  nome      VARCHAR(100) NOT NULL,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE
);

-- Dados iniciais: as mesmas 6 viagens de src/dados.ts
INSERT INTO viagens (destino, pais, situacao, tipo, observacao) VALUES
  ('Paris',               'França',         'confirmada', 'lazer',    NULL),
  ('Lisboa',              'Portugal',       'concluida',  'familia',  NULL),
  ('Nova York',           'Estados Unidos', 'confirmada', 'trabalho', 'Feira de tecnologia'),
  ('Tóquio',              'Japão',          'planejada',  'lazer',    NULL),
  ('Buenos Aires',        'Argentina',      'planejada',  'lazer',    NULL),
  ('Fernando de Noronha', 'Brasil',         'planejada',  'familia',  NULL);

INSERT INTO atividades (viagem_id, nome) VALUES
  (1, 'Torre Eiffel'),  (1, 'Louvre'),
  (2, 'Belém'),         (2, 'Sintra'),
  (3, 'Central Park'),  (3, 'Times Square'),
  (4, 'Shibuya'),       (4, 'Templo Senso-ji'),
  (5, 'Caminito'),      (5, 'Casa Rosada'),
  (6, 'Baía do Sancho'), (6, 'Mergulho');

-- Consultas de exemplo
SELECT * FROM viagens;
SELECT situacao, COUNT(*) AS total FROM viagens GROUP BY situacao;
SELECT v.destino, a.nome AS atividade
  FROM viagens v JOIN atividades a ON a.viagem_id = v.id
  ORDER BY v.id;
