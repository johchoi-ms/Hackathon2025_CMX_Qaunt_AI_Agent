## Pre
- Ask for json file to use

### Goal
- Create an interactive dashboard in HTML.
- If neccessary, create js and css file to support HTML.
- Provide data-driven insights and actionable suggestions.


### Steps
- Import data from json file
- Analyze the data to generate meaningful insights and practical suggestions.
- Create a dashboard (HTML) featuring graphs and tables. And add insights and suggestions generated from the privious step. followings are the sections to be created in the dashboard
    - Monthly Active Users (MAU) per blade and overall (last 28 days)
    - Weekly Active Users (WAU) per blade and overall
        - trend of last 4 weeks, starting from ago(28d)
    - Stickiness (WAU/MAU) per blade and overall
    - Average Sessions per User (per blade and overall)
    - User journey between blades: Build Sankey graph (referrer: https://d3-graph-gallery.com/sankey).
    - Session Frequency: avg number of active days per user in 28d
    - Top Tenant (Power Users): share of activity by top X% (X configurable, default 10%)
    - Cross-Blade Engagement: avg distinct blades per user
    - Top blades by loads and users. (for multi blades analysis only)
    - Repeat Visitors: % users with ≥3 visits in 28d
    - First-time Users (New this Month): users first seen within last 28d
    - Day-of-Week Engagement: active users by weekday
    - Peak Hours Usage: sessions by hour of day
- Must Add 
    - 1) an executive summary at the top of the dashboard (no more than five sentences).
    - 2) Anomalies
    - 3) add button that is popping up the query for every visualizaion and table.
- Add if neccessary
    - 1) trend changes
