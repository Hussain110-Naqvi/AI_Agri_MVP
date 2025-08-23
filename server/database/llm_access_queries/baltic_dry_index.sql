CREATE TABLE llm_access.baltic_dry_index
AS
SELECT 
  CAST("_Date_" as date) as date,
  "Price" as avg_price,
  "High" as highest_price,
  "Low" as lowest_price
FROM public.baltic_dry_index
