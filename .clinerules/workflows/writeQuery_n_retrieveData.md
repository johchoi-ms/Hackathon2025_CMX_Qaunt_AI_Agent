## Pre
- Ask for list of Blades to be included.
- Ask for the name of the final json file.

### Goal
- Save Kusto queries and result data to the json file.
- Create a JSON file to store queries and retrieved data.

### Data Source
cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry 

### Time range: 
| where PreciseTimeStamp >= ago(28d)

### Blade scope: 
| where name in ( "bladeName1", "bladeName2") 

### External users only:
| where userTypeHint == "" and requestUri startswith https://portal. And tenantId!='72f988bf-86f1-41af-91ab-2d7cd011db47'

### Non-negotiable Rules:
- Use only real fields and values from the data. No assumptions, no invented columns or metrics.
- Do NOT compare to previous months unless the data explicitly contains it. If not available, mark as N/A and explain.
- Every metric must include the full KQL query used to generate it.
- If a required field is missing, return N/A and add a “Telemetry Gap” note with a suggested field/event.
- Use UTC time unless a timezone column is explicitly present.
- Dashboard must be product-agnostic (generic across Azure blades/features).


## Metrics to Implement
- Monthly Active Users (MAU) per blade and overall (last 28 days)
- Weekly Active Users (WAU) per blade and overall
    - trend of last 4 weeks, starting from ago(28d)
- Stickiness (WAU/MAU) per blade and overall
- Average Sessions per User (per blade and overall)
- User journey between blades
    - I will build Sankey graph that you can see from this (https://d3-graph-gallery.com/sankey). Prepare the data as needed
