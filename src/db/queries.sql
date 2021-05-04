-- Testquery for recursion
WITH recursive children as (
    SELECT * FROM kpis
    WHERE ID = '74351e8d7097'
    UNION
    SELECT e.* FROM kpis as e, children as c
    WHERE 
      e.parent = c.ID
)
SELECT * FROM children;