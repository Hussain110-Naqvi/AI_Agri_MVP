select 
  "_REF_DATE_",
  SUM("VALUE" )
from public.planting_intentions
where 
  "GEO" = 'Canada'
  and
  "Type of grain" = 'All grains, total'
GROUP BY "_REF_DATE_"
ORDER BY "_REF_DATE_" desc
LIMIT 6
