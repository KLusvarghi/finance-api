CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS TABLE (
  earnings     NUMERIC(10,2),
  expenses     NUMERIC(10,2),
  investments  NUMERIC(10,2),
  balance      NUMERIC(10,2)
)
LANGUAGE sql AS $$
  SELECT
    COALESCE(SUM(amount) FILTER (WHERE type = 'EARNING'),    0) AS earnings,
    COALESCE(SUM(amount) FILTER (WHERE type = 'EXPENSE'),    0) AS expenses,
    COALESCE(SUM(amount) FILTER (WHERE type = 'INVESTMENT'), 0) AS investments,
    -- balance = earnings - expenses - investments (como no original)
    COALESCE(SUM(amount) FILTER (WHERE type = 'EARNING'),    0)
  - COALESCE(SUM(amount) FILTER (WHERE type = 'EXPENSE'),    0)
  - COALESCE(SUM(amount) FILTER (WHERE type = 'INVESTMENT'), 0) AS balance
  FROM transactions
  WHERE user_id = uid;
$$;
