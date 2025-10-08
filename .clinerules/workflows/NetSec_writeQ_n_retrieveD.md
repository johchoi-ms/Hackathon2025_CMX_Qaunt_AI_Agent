### Pre
- Ask for the name of the final json file.

### Goal
- Save Kusto queries and result data to the json file.

### Data Source
- cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry 

### Key Fields
- PreciseTimeStamp, name, action, actionModifier, data, userTypeHint, requestUri, tenantId, sessionId, tenantId, userId

### Time range: 
| where PreciseTimeStamp >= ago(28d)

### Blade scope: 
| where action == "BladeFullReady"
| where name in ( "bladeName1", "bladeName2") 

### External users only:
| where userTypeHint == "" and requestUri startswith https://portal. And tenantId!='72f988bf-86f1-41af-91ab-2d7cd011db47'

### Non-negotiable Rules:
- Use only real fields and values from the data. No assumptions, no invented columns or metrics.
- Use only real result that was retrieved from the query. No assumtions, no invented figures, numbers, or data. 
- Do NOT compare to previous months unless the data explicitly contains it. If not available, mark as N/A and explain.
- Every metric must include the full KQL query used to generate it.
- If a required field is missing, return N/A and add a “Telemetry Gap” note with a suggested field/event.
- Use UTC time unless a timezone column is explicitly present.


### Blades Names
- NetSec overview:
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_HybridNetworking/FirewallManagerMenuBlade/~/overviewReact
    - name: Extension/Microsoft_Azure_HybridNetworking/Blade/GettingStartedTabs.ReactView
- Related services:
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_HybridNetworking/FirewallManagerMenuBlade/~/RelatedServices
    - name: Extension/Microsoft_Azure_HybridNetworking/Blade/RelatedServices.ReactView
- Traffic Manager browse
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_Network/LoadBalancingHubMenuBlade/~/TrafficManagers
    - name: Extension/HubsExtension/Blade/BrowseResource.ReactView
    - note: The blade name is generic and cannot be used as a reliable identifier.
    - Create
        - link: https://ms.portal.azure.com/#view/Microsoft_Azure_DNS/TrafficManagerCreate.ReactView 
        - name: Extension/Microsoft_Azure_DNS/Blade/TrafficManagerCreate.ReactView
    - Bastion create
        - link: https://ms.portal.azure.com/#create/Microsoft.BastionHost
        - name: Extension/Microsoft_Azure_HybridNetworking/Blade/CreateBastionHostBlade
        - note: we want to swap with this in our next iteraton
- Network watcher overview 
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_Network/NetworkWatcherMenuBlade/~/overview
    - name: Extension/HubsExtension/Blade/BrowseResource.ReactView
    - note: The blade name is generic and cannot be used as a reliable identifier.
- Azure sentinel create 
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_Security_Insights/OnboardingBlade
    - name: Extension/Microsoft_Azure_Security_Insights/Blade/OnboardingBlade
- Azure monitor overview 
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/overview
    - name: Extension/Microsoft_Azure_Monitoring/Blade/GettingStartedBladeViewModel
- Azure defender for cloud overview 
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/0
    - name: Extension/Microsoft_Azure_Security/Blade/OverviewBladeV3
- Azure backup center
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_DataProtection/BackupCenterMenuBlade/~/overview
    - name: Extension/Microsoft_Azure_DataProtection/Blade/BackupCenterOverviewBlade
    - Private endpoint create
        - link: https://ms.portal.azure.com/#view/Microsoft_Azure_Network/CreatePrivateEndpointBlade
        - name: Extension/Microsoft_Azure_Network/Blade/CreatePrivateEndpointBlade
        - note: we want to swap with this in our next iteration
- Recovery services create
    - link: https://ms.portal.azure.com/#view/Microsoft_Azure_RecoveryServices/CreateBladeFullScreen
    - name: Extension/Microsoft_Azure_RecoveryServices/Blade/CreateBladeFullScreen
    - Network security group create
        - link: https://ms.portal.azure.com/#create/Microsoft.NetworkSecurityGroup
        - name: Extension/Microsoft_Azure_Marketplace/Blade/GalleryItemDetailsBladeNopdl
        - note: we want to swap with this in our next iteration. The blade name is generic and cannot be used as a reliable identifier.



### Metrics to Implement
- Monthly Active Users (MAU) per blade and overall (last 28 days)
- Weekly Active Users (WAU) per blade and overall
    - trend of last 4 weeks, starting from ago(28d)
- Average Sessions per User (per blade and overall)
- User journey between blades
    - Sankey graph: I want to build Sankey graph that you can see from this (https://d3-graph-gallery.com/sankey). Prepare the data as needed
    - Relatioship between blades: Get which blades are visiting the most together in one session between the blades of interest. 
- Session Frequency: avg number of active days per user in 28d
- note: do not include the blade if it is noted as generic.


## Now Execute:
1. Connect via AZURE-MCP-SERVER
2. Write and Run kusto queries 
3. save Kusto queries and result data to the json file.
