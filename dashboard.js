// Dashboard JavaScript
let dashboardData = null;

// Load data when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Try to fetch from JSON file first
        const response = await fetch('test_ver08.json');
        if (response.ok) {
            dashboardData = await response.json();
        } else {
            throw new Error('Failed to fetch JSON');
        }
        initializeDashboard();
    } catch (error) {
        console.error('Error loading data from file, using embedded data:', error);
        // Fallback to embedded data
        loadEmbeddedData();
        initializeDashboard();
    }
});

// Embedded data as fallback
function loadEmbeddedData() {
    dashboardData = {
        "metadata": {
            "generated_at": "2025-09-19T17:37:00Z",
            "time_range": "last 28 days",
            "data_source": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry",
            "blades": [
                "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade",
                "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView",
                "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3",
                "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView",
                "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade",
                "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView"
            ]
        },
        "queries_and_results": {
            "monthly_active_users": {
                "description": "Monthly Active Users (MAU) per blade and overall (last 28 days)",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize MAU = dcount(userId) by name",
                "data": {
                    "Overall": 151922,
                    "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade": 129272,
                    "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView": 114565,
                    "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3": 79414,
                    "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView": 33180,
                    "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade": 33164,
                    "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView": 4731
                }
            },
            "weekly_active_users": {
                "description": "Weekly Active Users (WAU) per blade and overall with 4-week trend",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | extend WeekNumber = bin(PreciseTimeStamp, 7d) | summarize WAU = dcount(userId) by name, WeekNumber | order by name, WeekNumber",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "WeekNumber": "2025-08-18T00:00:00Z", "WAU": 3030},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "WeekNumber": "2025-08-25T00:00:00Z", "WAU": 32620},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "WeekNumber": "2025-09-01T00:00:00Z", "WAU": 34916},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "WeekNumber": "2025-09-08T00:00:00Z", "WAU": 37066},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "WeekNumber": "2025-09-15T00:00:00Z", "WAU": 33672},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "WeekNumber": "2025-08-18T00:00:00Z", "WAU": 3744},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "WeekNumber": "2025-08-25T00:00:00Z", "WAU": 38639},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "WeekNumber": "2025-09-01T00:00:00Z", "WAU": 43116},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "WeekNumber": "2025-09-08T00:00:00Z", "WAU": 44029},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "WeekNumber": "2025-09-15T00:00:00Z", "WAU": 39569}
                ]
            },
            "stickiness": {
                "description": "Stickiness (WAU/MAU) per blade and overall",
                "query": "let WAU = cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(7d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize WAU = dcount(userId) by name; let MAU = cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize MAU = dcount(userId) by name; WAU | join MAU on name | extend Stickiness = todouble(WAU) / todouble(MAU) | project name, Stickiness",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Stickiness": 0.329},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "Stickiness": 0.328},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "Stickiness": 0.352},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "Stickiness": 0.318},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "Stickiness": 0.134},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView", "Stickiness": 0.193}
                ]
            },
            "average_sessions_per_user": {
                "description": "Average Sessions per User per blade and overall",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize TotalSessions = dcount(sessionId), UniqueUsers = dcount(userId) by name | extend AvgSessionsPerUser = todouble(TotalSessions) / todouble(UniqueUsers) | project name, AvgSessionsPerUser",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "AvgSessionsPerUser": 2.72},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "AvgSessionsPerUser": 2.79},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "AvgSessionsPerUser": 2.05},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "AvgSessionsPerUser": 4.03},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "AvgSessionsPerUser": 2.20},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView", "AvgSessionsPerUser": 1.27}
                ]
            },
            "user_journey": {
                "description": "User journey between blades for Sankey diagram",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | sort by userId, sessionId, PreciseTimeStamp | extend PrevBlade = prev(name, 1) | where PrevBlade != name and isnotempty(PrevBlade) | summarize FlowCount = count() by PrevBlade, name | project source = PrevBlade, target = name, value = FlowCount",
                "data": [
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "target": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "value": 236220},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "target": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "value": 185125},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "target": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "value": 181244},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "target": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "value": 140908},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "target": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "value": 91462},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "target": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "value": 80152},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "target": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "value": 77124},
                    {"source": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "target": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "value": 45906}
                ]
            },
            "session_frequency": {
                "description": "Session Frequency: avg number of active days per user in 28d",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | extend Day = bin(PreciseTimeStamp, 1d) | summarize ActiveDays = dcount(Day) by userId, name | summarize AvgActiveDaysPerUser = avg(ActiveDays) by name",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "AvgActiveDaysPerUser": 1.93},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "AvgActiveDaysPerUser": 1.74},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "AvgActiveDaysPerUser": 1.51},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "AvgActiveDaysPerUser": 1.83},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "AvgActiveDaysPerUser": 1.55},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView", "AvgActiveDaysPerUser": 1.12}
                ]
            },
            "top_tenant_power_users": {
                "description": "Top Tenant (Power Users): share of activity by top 10%",
                "query": "let UserActivity = cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize ActivityCount = count() by tenantId | order by ActivityCount desc; let TotalActivity = UserActivity | summarize sum(ActivityCount); let TopTenantCount = UserActivity | count | extend TopTenPercent = toint(Count * 0.1); let TopTenants = UserActivity | limit (TopTenantCount); TopTenants | summarize TopTenantActivity = sum(ActivityCount) | extend TotalActivity = toscalar(TotalActivity) | extend PowerUserShare = todouble(TopTenantActivity) / todouble(TotalActivity)",
                "data": {
                    "TopTenantActivity": 71309,
                    "TotalActivity": 1678066,
                    "PowerUserShare": 0.0425,
                    "PowerUserSharePercentage": "4.25%"
                }
            },
            "cross_blade_engagement": {
                "description": "Cross-Blade Engagement: avg distinct blades per user",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize DistinctBlades = dcount(name) by userId | summarize AvgBladesPerUser = avg(DistinctBlades)",
                "data": {
                    "AvgBladesPerUser": 2.60
                }
            },
            "top_blades_by_loads_and_users": {
                "description": "Top blades by loads and users",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize TotalLoads = count(), UniqueUsers = dcount(userId) by name | order by TotalLoads desc",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "TotalLoads": 547138, "UniqueUsers": 129272},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "TotalLoads": 377323, "UniqueUsers": 114578},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "TotalLoads": 318476, "UniqueUsers": 79414},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "TotalLoads": 269356, "UniqueUsers": 33184},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "TotalLoads": 156223, "UniqueUsers": 33158},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView", "TotalLoads": 9547, "UniqueUsers": 4731}
                ]
            },
            "repeat_visitors": {
                "description": "Repeat Visitors: % users with ≥3 visits in 28d",
                "query": "let UserVisits = cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize VisitCount = count() by userId, name; UserVisits | summarize TotalUsers = dcount(userId), RepeatUsers = dcountif(userId, VisitCount >= 3) by name | extend RepeatVisitorPercentage = todouble(RepeatUsers) / todouble(TotalUsers) * 100.0 | project name, RepeatVisitorPercentage",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "RepeatVisitorPercentage": 31.78},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "RepeatVisitorPercentage": 25.33},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "RepeatVisitorPercentage": 48.27},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "RepeatVisitorPercentage": 34.64},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "RepeatVisitorPercentage": 40.90},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView", "RepeatVisitorPercentage": 19.11}
                ]
            },
            "first_time_users": {
                "description": "First-time Users (New this Month): users first seen within last 28d",
                "query": "let FirstSeenUsers = cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | summarize FirstSeen = min(PreciseTimeStamp) by userId, name; FirstSeenUsers | where FirstSeen >= ago(28d) | summarize NewUsersThisMonth = dcount(userId) by name",
                "data": [
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "NewUsersThisMonth": 117422},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView", "NewUsersThisMonth": 107022},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView", "NewUsersThisMonth": 29441},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3", "NewUsersThisMonth": 71269},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade", "NewUsersThisMonth": 29535},
                    {"name": "Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView", "NewUsersThisMonth": 4643}
                ]
            },
            "day_of_week_engagement": {
                "description": "Day-of-Week Engagement: active users by weekday",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | extend DayOfWeek = dayofweek(PreciseTimeStamp) | summarize ActiveUsers = dcount(userId) by DayOfWeek, name | order by DayOfWeek",
                "data": [
                    {"DayOfWeek": "00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 5497},
                    {"DayOfWeek": "1.00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 33228},
                    {"DayOfWeek": "2.00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 39161},
                    {"DayOfWeek": "3.00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 39666},
                    {"DayOfWeek": "4.00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 37100},
                    {"DayOfWeek": "5.00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 30848},
                    {"DayOfWeek": "6.00:00:00", "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "ActiveUsers": 4911}
                ]
            },
            "peak_hours_usage": {
                "description": "Peak Hours Usage: sessions by hour of day",
                "query": "cluster('azportalpartnerrow.westus.kusto.windows.net').database('AzurePortal').ClientTelemetry | where PreciseTimeStamp >= ago(28d) | where action == \"BladeFullReady\" | where name in (\"Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade\", \"Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3\", \"Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView\", \"Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade\", \"Extension/Microsoft_Azure_Policy/Blade/CreateEditSelectors.ReactView\") | where userTypeHint == \"\" and requestUri startswith \"https://portal.\" and tenantId != '72f988bf-86f1-41af-91ab-2d7cd011db47' | extend HourOfDay = hourofday(PreciseTimeStamp) | summarize Sessions = dcount(sessionId) by HourOfDay, name | order by HourOfDay",
                "data": [
                    {"HourOfDay": 13, "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Sessions": 30694},
                    {"HourOfDay": 14, "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Sessions": 28665},
                    {"HourOfDay": 15, "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Sessions": 22600},
                    {"HourOfDay": 16, "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Sessions": 16563},
                    {"HourOfDay": 8, "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Sessions": 27380},
                    {"HourOfDay": 9, "name": "Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade", "Sessions": 26953}
                ]
            }
        }
    };
}

// Initialize all charts and visualizations
function initializeDashboard() {
    if (!dashboardData) return;
    
    // Initialize all charts
    createMAUChart();
    createWAUChart();
    createStickinessChart();
    createSessionsChart();
    createSankeyDiagram();
    createFrequencyChart();
    createTopBladesChart();
    createRepeatChart();
    createFirstTimeChart();
    createDayOfWeekChart();
    createPeakHoursChart();
}

// Utility function to get blade display name
function getBladeName(fullName) {
    const parts = fullName.split('/');
    return parts[parts.length - 1].replace('.ReactView', '');
}

// Chart color palette
const colors = [
    '#0078d4', '#106ebe', '#005a9e', '#004578',
    '#003159', '#107c10', '#8bb700', '#ffa500'
];

// 1. Monthly Active Users Chart
function createMAUChart() {
    const ctx = document.getElementById('mauChart').getContext('2d');
    const data = dashboardData.queries_and_results.monthly_active_users.data;
    
    // Exclude 'Overall' and prepare data
    const bladeData = Object.entries(data)
        .filter(([key]) => key !== 'Overall')
        .sort(([,a], [,b]) => b - a);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bladeData.map(([name]) => getBladeName(name)),
            datasets: [{
                label: 'Monthly Active Users',
                data: bladeData.map(([,value]) => value),
                backgroundColor: colors[0],
                borderColor: colors[1],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString() + ' users';
                        }
                    }
                }
            }
        }
    });
}

// 2. Weekly Active Users Trend Chart
function createWAUChart() {
    const ctx = document.getElementById('wauChart').getContext('2d');
    const data = dashboardData.queries_and_results.weekly_active_users.data;
    
    // Group data by blade and sort by date
    const bladeData = {};
    data.forEach(item => {
        const bladeName = getBladeName(item.name);
        if (!bladeData[bladeName]) bladeData[bladeName] = [];
        bladeData[bladeName].push({
            date: new Date(item.WeekNumber),
            value: item.WAU
        });
    });
    
    // Sort each blade's data by date
    Object.values(bladeData).forEach(arr => {
        arr.sort((a, b) => a.date - b.date);
    });
    
    // Create datasets for top 4 blades
    const topBlades = Object.entries(bladeData)
        .sort(([,a], [,b]) => Math.max(...b.map(x => x.value)) - Math.max(...a.map(x => x.value)))
        .slice(0, 4);
    
    const datasets = topBlades.map(([name, values], index) => ({
        label: name,
        data: values.map(v => v.value),
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        fill: false,
        tension: 0.1
    }));
    
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.slice(0, Math.max(...topBlades.map(([,values]) => values.length))),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' users';
                        }
                    }
                }
            }
        }
    });
}

// 3. Stickiness Chart
function createStickinessChart() {
    const ctx = document.getElementById('stickinessChart').getContext('2d');
    const data = dashboardData.queries_and_results.stickiness.data;
    
    const sortedData = data.sort((a, b) => b.Stickiness - a.Stickiness);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => getBladeName(item.name)),
            datasets: [{
                label: 'Stickiness (WAU/MAU)',
                data: sortedData.map(item => (item.Stickiness * 100).toFixed(1)),
                backgroundColor: sortedData.map((item, index) => 
                    item.Stickiness < 0.2 ? colors[7] : // Orange for low
                    item.Stickiness > 0.35 ? colors[5] : // Green for high
                    colors[0] // Blue for medium
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Stickiness: ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// 4. Average Sessions per User Chart
function createSessionsChart() {
    const ctx = document.getElementById('sessionsChart').getContext('2d');
    const data = dashboardData.queries_and_results.average_sessions_per_user.data;
    
    const sortedData = data.sort((a, b) => b.AvgSessionsPerUser - a.AvgSessionsPerUser);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => getBladeName(item.name)),
            datasets: [{
                label: 'Avg Sessions per User',
                data: sortedData.map(item => parseFloat(item.AvgSessionsPerUser.toFixed(2))),
                backgroundColor: colors[0],
                borderColor: colors[1],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 0.5
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Avg Sessions: ' + context.parsed.x.toFixed(2);
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// 5. Sankey Diagram for User Journey
function createSankeyDiagram() {
    const data = dashboardData.queries_and_results.user_journey.data;
    const container = document.getElementById('sankeyChart');
    container.innerHTML = ''; // Clear existing content
    
    // Check if D3 Sankey is available
    if (!d3.sankey) {
        console.error('D3 Sankey library not loaded');
        // Create fallback message
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 400px; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6;">
                <div style="text-align: center; color: #6c757d;">
                    <h3>Loading Sankey Diagram...</h3>
                    <p>D3.js Sankey library is loading. Please refresh the page if this persists.</p>
                    <p style="font-size: 12px; margin-top: 20px;">If the diagram doesn't appear, check your internet connection.</p>
                </div>
            </div>
        `;
        
        // Try to load the diagram again after a delay
        setTimeout(() => {
            if (d3.sankey) {
                createSankeyDiagram();
            }
        }, 2000);
        return;
    }
    
    try {
        // Prepare data and handle circular links
        const nodeSet = new Set();
        data.forEach(d => {
            nodeSet.add(d.source);
            nodeSet.add(d.target);
        });
        
        const nodes = Array.from(nodeSet).map(fullName => ({
            name: getBladeName(fullName),
            fullName: fullName
        }));
        
        // Process links to handle bi-directional flows
        const processedLinks = [];
        const linkMap = new Map();
        
        data.forEach(d => {
            const sourceIndex = nodes.findIndex(n => n.fullName === d.source);
            const targetIndex = nodes.findIndex(n => n.fullName === d.target);
            
            // Create a unique key for the link pair (sorted to handle bi-directional)
            const linkKey = [sourceIndex, targetIndex].sort().join('-');
            
            if (linkMap.has(linkKey)) {
                // If we already have a link between these nodes, combine the values
                const existingLink = linkMap.get(linkKey);
                existingLink.value += d.value;
                existingLink.label += ` + ${getBladeName(d.source)} → ${getBladeName(d.target)} (${d.value.toLocaleString()})`;
            } else {
                // New link
                const newLink = {
                    source: sourceIndex,
                    target: targetIndex,
                    value: d.value,
                    label: `${getBladeName(d.source)} → ${getBladeName(d.target)} (${d.value.toLocaleString()})`
                };
                linkMap.set(linkKey, newLink);
                processedLinks.push(newLink);
            }
        });
        
        const graph = { nodes: nodes.slice(), links: processedLinks };
        
        // Set up dimensions
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Create Sankey layout
        const sankey = d3.sankey()
            .nodeAlign(d3.sankeyJustify)
            .nodeWidth(20)
            .nodePadding(15)
            .extent([[0, 0], [width, height]]);
        
        // Apply layout to graph
        const sankeyData = sankey(graph);
        
        // Color scale for nodes
        const colorScale = ['#0078d4', '#106ebe', '#005a9e', '#004578', '#003159', '#107c10'];
        const color = (name) => {
            const index = sankeyData.nodes.findIndex(n => n.name === name);
            return colorScale[index % colorScale.length];
        };
        
        // Add links
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('path')
            .data(sankeyData.links)
            .join('path')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('stroke', d => color(d.source.name))
            .attr('stroke-opacity', 0.5)
            .attr('stroke-width', d => Math.max(1, d.width))
            .attr('fill', 'none');
        
        // Add link hover effects
        link.on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-opacity', 0.8);
                
                // Create tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'sankey-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.9)')
                    .style('color', 'white')
                    .style('padding', '10px 12px')
                    .style('border-radius', '6px')
                    .style('font-size', '13px')
                    .style('font-family', '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif')
                    .style('pointer-events', 'none')
                    .style('z-index', '10000')
                    .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
                    .html(`
                        <strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>
                        <span style="color: #40c8f4;">Flow Volume: <strong>${d.value.toLocaleString()}</strong></span>
                    `);
                
                // Position tooltip
                const rect = container.getBoundingClientRect();
                tooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-opacity', 0.5);
                
                d3.selectAll('.sankey-tooltip').remove();
            });
        
        // Add nodes
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('rect')
            .data(sankeyData.nodes)
            .join('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', d => color(d.name))
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2);
        
        // Add node hover effects
        node.on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('fill', d3.color(color(d.name)).darker(0.2));
                
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'sankey-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.9)')
                    .style('color', 'white')
                    .style('padding', '10px 12px')
                    .style('border-radius', '6px')
                    .style('font-size', '13px')
                    .style('font-family', '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif')
                    .style('pointer-events', 'none')
                    .style('z-index', '10000')
                    .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
                    .html(`
                        <strong>${d.name}</strong><br/>
                        <span style="color: #40c8f4;">Total Value: <strong>${d.value ? d.value.toLocaleString() : 'N/A'}</strong></span><br/>
                        <span style="color: #90e5a9;">Incoming Links: <strong>${d.targetLinks.length}</strong></span><br/>
                        <span style="color: #ffb347;">Outgoing Links: <strong>${d.sourceLinks.length}</strong></span>
                    `);
                
                tooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('fill', color(d.name));
                
                d3.selectAll('.sankey-tooltip').remove();
            });
        
        // Add node labels
        g.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(sankeyData.nodes)
            .join('text')
            .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
            .attr('font-family', '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('fill', '#323130')
            .text(d => d.name);
        
        // Add summary statistics
        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border-radius: 8px;
            border-left: 4px solid #0078d4;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        const totalFlow = links.reduce((sum, link) => sum + link.value, 0);
        const maxFlow = Math.max(...links.map(link => link.value));
        const maxFlowLink = data.find(link => link.value === maxFlow);
        
        summaryDiv.innerHTML = `
            <h4 style="margin: 0 0 12px 0; color: #0078d4; font-size: 16px; font-weight: 600;">
                🔀 Journey Flow Analysis - Sankey Diagram
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; font-size: 14px; line-height: 1.4;">
                <div><strong>Total Flow Volume:</strong> ${totalFlow.toLocaleString()}</div>
                <div><strong>Unique Flow Paths:</strong> ${links.length}</div>
                <div><strong>Unique Blades:</strong> ${nodes.length}</div>
                <div><strong>Dominant Flow:</strong> ${getBladeName(maxFlowLink.source)} → ${getBladeName(maxFlowLink.target)}</div>
                <div><strong>Peak Volume:</strong> ${maxFlow.toLocaleString()} (${((maxFlow / totalFlow) * 100).toFixed(1)}%)</div>
                <div><strong>Avg Flow Size:</strong> ${Math.round(totalFlow / links.length).toLocaleString()}</div>
            </div>
        `;
        
        container.appendChild(summaryDiv);
        
        console.log('Sankey diagram created successfully');
        
    } catch (error) {
        console.error('Error creating Sankey diagram:', error);
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 400px; background: #fff3cd; border-radius: 8px; border: 2px solid #ffeaa7;">
                <div style="text-align: center; color: #856404;">
                    <h3>⚠️ Sankey Diagram Error</h3>
                    <p>There was an issue loading the diagram. Please refresh the page.</p>
                    <p style="font-size: 12px; margin-top: 10px;">Error: ${error.message}</p>
                </div>
            </div>
        `;
    }
}

// 6. Session Frequency Chart
function createFrequencyChart() {
    const ctx = document.getElementById('frequencyChart').getContext('2d');
    const data = dashboardData.queries_and_results.session_frequency.data;
    
    const sortedData = data.sort((a, b) => b.AvgActiveDaysPerUser - a.AvgActiveDaysPerUser);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sortedData.map(item => getBladeName(item.name)),
            datasets: [{
                data: sortedData.map(item => item.AvgActiveDaysPerUser.toFixed(2)),
                backgroundColor: colors.slice(0, sortedData.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' days avg';
                        }
                    }
                }
            }
        }
    });
}

// 7. Top Blades Performance Chart
function createTopBladesChart() {
    const ctx = document.getElementById('topBladesChart').getContext('2d');
    const data = dashboardData.queries_and_results.top_blades_by_loads_and_users.data;
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Total Loads vs Unique Users',
                data: data.map(item => ({
                    x: item.UniqueUsers,
                    y: item.TotalLoads,
                    label: getBladeName(item.name)
                })),
                backgroundColor: colors[0] + '80',
                borderColor: colors[0],
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Unique Users'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Loads'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.parsed;
                            return `${context.raw.label}: ${point.x.toLocaleString()} users, ${point.y.toLocaleString()} loads`;
                        }
                    }
                }
            }
        }
    });
}

// 8. Repeat Visitors Chart
function createRepeatChart() {
    const ctx = document.getElementById('repeatChart').getContext('2d');
    const data = dashboardData.queries_and_results.repeat_visitors.data;
    
    const sortedData = data.sort((a, b) => b.RepeatVisitorPercentage - a.RepeatVisitorPercentage);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => getBladeName(item.name)),
            datasets: [{
                label: 'Repeat Visitors (%)',
                data: sortedData.map(item => item.RepeatVisitorPercentage.toFixed(1)),
                backgroundColor: sortedData.map(item => 
                    item.RepeatVisitorPercentage > 40 ? colors[5] :
                    item.RepeatVisitorPercentage < 25 ? colors[7] :
                    colors[0]
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Repeat Visitors: ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// 9. First-time Users Chart
function createFirstTimeChart() {
    const ctx = document.getElementById('firstTimeChart').getContext('2d');
    const data = dashboardData.queries_and_results.first_time_users.data;
    
    const sortedData = data.sort((a, b) => b.NewUsersThisMonth - a.NewUsersThisMonth);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => getBladeName(item.name)),
            datasets: [{
                label: 'New Users This Month',
                data: sortedData.map(item => item.NewUsersThisMonth),
                backgroundColor: colors[5],
                borderColor: colors[6],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString() + ' new users';
                        }
                    }
                }
            }
        }
    });
}

// 10. Day of Week Engagement Chart
function createDayOfWeekChart() {
    const ctx = document.getElementById('dayOfWeekChart').getContext('2d');
    const data = dashboardData.queries_and_results.day_of_week_engagement.data;
    
    // Group by day of week and sum across all blades
    const dayMap = {
        '00:00:00': 'Sunday',
        '1.00:00:00': 'Monday', 
        '2.00:00:00': 'Tuesday',
        '3.00:00:00': 'Wednesday',
        '4.00:00:00': 'Thursday',
        '5.00:00:00': 'Friday',
        '6.00:00:00': 'Saturday'
    };
    
    const dayTotals = {};
    data.forEach(item => {
        const day = dayMap[item.DayOfWeek] || item.DayOfWeek;
        dayTotals[day] = (dayTotals[day] || 0) + item.ActiveUsers;
    });
    
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const orderedData = daysOrder.map(day => dayTotals[day] || 0);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: daysOrder,
            datasets: [{
                label: 'Active Users',
                data: orderedData,
                borderColor: colors[0],
                backgroundColor: colors[0] + '20',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString() + ' active users';
                        }
                    }
                }
            }
        }
    });
}

// 11. Peak Hours Usage Chart
function createPeakHoursChart() {
    const ctx = document.getElementById('peakHoursChart').getContext('2d');
    const data = dashboardData.queries_and_results.peak_hours_usage.data;
    
    // Group by hour and sum sessions across all blades
    const hourTotals = {};
    data.forEach(item => {
        hourTotals[item.HourOfDay] = (hourTotals[item.HourOfDay] || 0) + item.Sessions;
    });
    
    // Create ordered array of hours 0-23
    const hours = [];
    const sessions = [];
    for (let i = 0; i < 24; i++) {
        hours.push(i + ':00');
        sessions.push(hourTotals[i] || 0);
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Sessions',
                data: sessions,
                backgroundColor: sessions.map(value => {
                    const maxValue = Math.max(...sessions);
                    const intensity = value / maxValue;
                    return `rgba(0, 120, 212, ${0.3 + intensity * 0.7})`;
                }),
                borderColor: colors[0],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString() + ' sessions';
                        }
                    }
                }
            }
        }
    });
}

// Query Modal Functions
const queries = {
    'mau': 'monthly_active_users',
    'wau': 'weekly_active_users', 
    'stickiness': 'stickiness',
    'sessions': 'average_sessions_per_user',
    'journey': 'user_journey',
    'frequency': 'session_frequency',
    'power': 'top_tenant_power_users',
    'crossblade': 'cross_blade_engagement',
    'topblades': 'top_blades_by_loads_and_users',
    'repeat': 'repeat_visitors',
    'firsttime': 'first_time_users',
    'dayofweek': 'day_of_week_engagement',
    'peakhours': 'peak_hours_usage'
};

function showQuery(queryKey) {
    if (!dashboardData || !queries[queryKey]) return;
    
    const queryData = dashboardData.queries_and_results[queries[queryKey]];
    const query = queryData.query;
    
    document.getElementById('queryText').textContent = query;
    document.getElementById('queryModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('queryModal').style.display = 'none';
}

function copyQuery() {
    const queryText = document.getElementById('queryText').textContent;
    navigator.clipboard.writeText(queryText).then(() => {
        alert('Query copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = queryText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Query copied to clipboard!');
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('queryModal');
    if (event.target === modal) {
        closeModal();
    }
}

function showError(message) {
    document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; color: #d13438;">
            <div style="text-align: center;">
                <h2>Error Loading Dashboard</h2>
                <p>${message}</p>
                <p style="font-size: 0.9rem; color: #605e5c; margin-top: 1rem;">
                    Please ensure test_ver08.json is in the same directory as this HTML file.
                </p>
            </div>
        </div>
    `;
}
