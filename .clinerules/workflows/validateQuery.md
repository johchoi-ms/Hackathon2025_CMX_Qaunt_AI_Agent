### Pre
- Ask for the jsonFile name.

### Goal
- Validate the query results

### Data Source
- cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry 

### Steps
- Execute the queries in the json file.
- If valid query result exits:
    - Compare the retrieved query results with the expected results in `test.json`
    - If the discrepancy between results is **less than 5%**, add a comment stating the validation is successful, including the current datetime.
    - If the discrepancy is **greater than 5%**, add a comment marking it as a red flag, also including the current datetime.
- If valid query result doesn't exits:
    - run the queries and update the result.