# Azure Policy Blade Analytics Dashboard

A comprehensive interactive analytics dashboard for Azure Portal Policy blade telemetry data, providing actionable insights into user behavior, engagement patterns, and potential UX improvements.

## 📊 Overview

This dashboard analyzes Azure Portal Policy blade usage data over a 28-day period, focusing on external users to provide insights into:
- User engagement patterns (MAU, WAU, Stickiness)
- Navigation flows between different policy blades
- Session behavior and frequency patterns
- Performance anomalies requiring attention

**Key Metrics Analyzed:**
- **151,934** Monthly Active Users
- **32.65%** Overall Stickiness (WAU/MAU)
- **2.87** Average Sessions per User
- **1.7** Average Active Days per Month

## 🎯 Key Features

### Interactive Visualizations
- **Monthly Active Users (MAU)** - Bar chart showing user distribution across policy blades
- **Weekly Active Users Trend** - 4-week trend analysis with multi-blade comparison
- **Stickiness Analysis** - Color-coded engagement quality metrics (WAU/MAU)
- **Sessions per User** - Usage intensity analysis by blade
- **User Journey Flow** - Top 10 navigation patterns between blades
- **Session Frequency** - Active days distribution analysis

### Business Intelligence
- **Executive Summary** - Concise overview of key findings
- **Anomaly Detection** - Critical issues flagged for immediate attention
- **Actionable Recommendations** - Prioritized improvement suggestions
- **Query Transparency** - View exact KQL queries for each visualization

## 🚨 Critical Findings

### Immediate Action Required
- **ScopeSelectorBlade**: Only 13.53% stickiness (vs 32% average) - UX review needed
- **PolicyComplianceDetail**: 4.04 sessions/user indicates workflow complexity
- **Traffic Hub Pattern**: PolicyMenuBlade central to 60% of user flows

## 🏗️ Architecture

```
📁 Project Structure
├── dashboard.html          # Main dashboard interface
├── dashboard.css          # Styling and responsive design
├── dashboard.js           # D3.js visualizations and interactivity
├── test_ver11.json       # Validated telemetry data
└── README.md            # This documentation
```

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: D3.js v7
- **Data Source**: Azure Portal telemetry via Kusto/KQL
- **Design**: Azure Design Language System

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended) or file:// protocol support

### Quick Start

1. **Clone or Download** the project files
2. **Open** `dashboard.html` in a web browser
3. **Explore** the interactive visualizations and insights

### Recommended Setup
```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Then open: http://localhost:8000/dashboard.html
```

## 📈 Data Source Information

### Telemetry Database
- **Cluster**: `azportalpartnerrow.westus.kusto.windows.net`
- **Database**: `AzurePortal.ClientTelemetry`
- **Time Range**: Last 28 days
- **User Scope**: External users only (non-Microsoft tenants)

### Key Fields Analyzed
- `PreciseTimeStamp` - Event timing
- `name` - Blade identifier
- `action` - User action type
- `userTypeHint` - User classification
- `requestUri` - Portal URL
- `tenantId` - Azure tenant identifier
- `sessionId` - User session tracking
- `userId` - Anonymous user identifier

### Blade Scope
The dashboard analyzes these Azure Policy blades:
- `Extension/Microsoft_Azure_Policy/Blade/PolicyMenuBlade`
- `Extension/Microsoft_Azure_Policy/Blade/Compliance.ReactView`
- `Extension/Microsoft_Azure_Policy/Blade/PolicyOverviewBladeV3`
- `Extension/Microsoft_Azure_Policy/Blade/PolicyComplianceDetail.ReactView`
- `Extension/Microsoft_Azure_Policy/Blade/ScopeSelectorBlade`

## 🔍 Using the Dashboard

### Navigation
1. **Executive Summary** - Start here for key insights overview
2. **Anomalies Section** - Review critical issues and opportunities
3. **Metrics Grid** - Explore detailed visualizations
4. **Recommendations** - Review prioritized action items

### Interactive Features
- **Query Buttons** - Click "Show Query" on any chart to see the KQL
- **Hover Tooltips** - Get detailed information on chart elements
- **Copy Functionality** - Copy queries to clipboard with one click
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📊 Metrics Definitions

### Monthly Active Users (MAU)
Unique users who accessed policy blades in the last 28 days.

### Weekly Active Users (WAU)
Unique users who accessed policy blades in the last 7 days.

### Stickiness (WAU/MAU)
Ratio indicating user engagement quality. Higher values show better retention.
- **Excellent**: >40%
- **Good**: 30-40%
- **Needs Attention**: <30%
- **Critical**: <20%

### Sessions per User
Average number of distinct sessions per user, indicating usage intensity.

### Session Frequency
Average number of active days per user within the 28-day period.

## 🎨 Customization

### Color Schemes
The dashboard uses Azure Design Language colors:
- **Primary Blue**: `#0078d4`
- **Success Green**: `#107c10`
- **Warning Orange**: `#ff8c00`
- **Critical Red**: `#d13438`

### Extending Visualizations
To add new charts:
1. Add data processing logic in `dashboard.js`
2. Create visualization function following D3.js patterns
3. Add corresponding HTML section in `dashboard.html`
4. Style with CSS classes in `dashboard.css`

## 🔧 Data Validation

The dashboard includes comprehensive data validation:
- **Query Validation**: All metrics validated with <0.1% discrepancy
- **Data Consistency**: Cross-metric validation ensures reliability
- **Timestamp Verification**: All queries validated at `2025-09-19T22:41:01Z`

## 🚀 Performance Optimizations

- **Efficient D3.js**: Optimized rendering for smooth interactions
- **Responsive Images**: Charts scale appropriately across devices
- **Lazy Loading**: Visualizations created on-demand
- **Error Handling**: Graceful degradation for missing data

## 🐛 Troubleshooting

### Common Issues

**Charts not displaying:**
- Ensure `test_ver11.json` is in the same directory
- Check browser console for JavaScript errors
- Verify JSON file is valid (not corrupted)

**Performance issues:**
- Use a local web server instead of file:// protocol
- Clear browser cache and reload
- Check available system memory

**Mobile display problems:**
- Rotate device to landscape for better viewing
- Use pinch-to-zoom for detailed chart inspection

## 📝 Data Refresh

To update the dashboard with new data:
1. Run the KQL queries against updated telemetry data
2. Replace `test_ver11.json` with new results
3. Update the `last_updated` timestamp in HTML header
4. Refresh the dashboard

## 🤝 Contributing

To contribute improvements:
1. Follow existing code patterns and styling
2. Test across multiple browsers and devices
3. Validate data accuracy with source queries
4. Update documentation for any new features

## 📄 License

This project is intended for internal Microsoft use and analysis of Azure Portal telemetry data.

## 📞 Support

For questions or issues with the dashboard:
- Check browser console for error messages
- Verify data file integrity and format
- Ensure web server setup is correct
- Review KQL query syntax for custom modifications

---

## 🎯 Business Impact

This dashboard enables data-driven decisions for Azure Policy blade improvements by:

- **Identifying UX Pain Points**: ScopeSelectorBlade's low stickiness highlights usability issues
- **Optimizing User Flows**: PolicyMenuBlade's hub pattern suggests optimization opportunities  
- **Streamlining Workflows**: High session counts indicate complex user journeys
- **Prioritizing Development**: Data-backed recommendations for maximum impact

**Next Steps**: Use insights to drive UX improvements, workflow optimizations, and user experience enhancements across Azure Policy blades.
