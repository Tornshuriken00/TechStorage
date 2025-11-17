ALTER TABLE itens
  ADD COLUMN recuperacao DECIMAL(10,2) DEFAULT 0 AFTER quantidade;
