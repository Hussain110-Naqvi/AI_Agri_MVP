select 
  "_Date_",
  ROUND(AVG("Price"), 0)
from 
  public.baltic_dry_index
GROUP BY "_Date_"
ORDER BY "_Date_" DESC 
LIMIT 6