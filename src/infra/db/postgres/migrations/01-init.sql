CREATE TABLE IF NOT EXISTS users(
  id UUID PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);


DO $$
BEGIN
-- "pg_type" é uma tabela interna do postgres que armazena nossos types
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
    CREATE TYPE transaction_type AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');
  END IF;
END $$;



CREATE TABLE IF NOT EXISTS transactions(
  id UUID PRIMARY KEY,
  -- Nesse projeto, quando um usuário for deletado, queremos deletar as transações relacionadas a ele tambem
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  amout NUMERIC(10,2) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  type transaction_type NOT NULL
);
