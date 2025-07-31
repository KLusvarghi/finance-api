-- Migration para corrigir o nome da coluna "amout" para "amount"
ALTER TABLE transactions RENAME COLUMN amout TO amount;

-- SELECT column_name
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name   = 'users'
-- ORDER BY ordinal_position;
