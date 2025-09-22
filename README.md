
# Azure Blade Analytics Dashboard

**Hackathon 2025 Project**

A comprehensive interactive analytics dashboard for Azure Portal blade telemetry data, providing actionable insights into user behavior, engagement patterns, and potential UX improvements.

**Team Members (alphabetical order):**
- Amit Yanovich Barash
- Can Zhao
- John Choi
- Micheal Frederick
- Yev Diachek


## 📊 Overview

This dashboard analyzes Azure Portal blade usage data over a 28-day period, focusing on external users to provide insights into:
- User engagement patterns (MAU, WAU, Stickiness)
- Navigation flows between different blades
- Session behavior and frequency patterns
- Performance anomalies requiring attention


## 🎯 Key Features

### Interactive Visualizations
- **Monthly Active Users (MAU)** - Bar chart showing user distribution across blades
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

## 🔄 Workflows

### Step 1: Data Extraction (`writeQuery_n_retrieveData.md`)
1. **Connect to Azure Data Explorer** using MCP server
2. **Execute KQL Queries** against telemetry database
3. **Extract Key Metrics**:
   - Monthly Active Users (MAU) per blade
   - Weekly Active Users (WAU) trends over 4 weeks  
   - User journey flows between blades
   - Session frequency and user engagement data
4. **Save Results** to JSON file with query metadata

### Step 2: Data Validation (`validateQuery.md`)
1. **Cross-Reference Metrics** for data consistency
2. **Validate Query Logic** against business requirements
3. **Check Data Quality** and identify anomalies
4. **Generate Validation Report** with discrepancy analysis

### Step 3: Dashboard Creation (`createDashboard.md`)
1. **Import Data** from validated JSON file
2. **Generate Insights** through data analysis
3. **Create Interactive Visualizations** using D3.js
4. **Build Executive Summary** and anomaly detection
5. **Add Query Transparency** with popup buttons



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
The dashboard analyzes Azure Portal blades based on the following criteria:
- **Time Range**: Last 28 days from execution date
- **User Scope**: External users only (excludes Microsoft internal users)
- **Action Filter**: `BladeFullReady` events for complete blade loads
- **Data Source**: Azure Portal ClientTelemetry database

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

### Monthly Active Users (MAU)
**Definition**: Count of unique users who accessed blades in the last 28 days
**KQL Logic**: `dcount(userId)` grouped by blade name
**Business Value**: Measures overall reach and blade adoption

### Weekly Active Users (WAU)
**Definition**: Count of unique users who accessed blades in each week
**KQL Logic**: `dcount(userId)` with weekly time buckets over 4 weeks
**Business Value**: Shows usage trends and engagement patterns

### Stickiness (WAU/MAU)
**Definition**: Ratio of weekly active users to monthly active users
**Calculation**: `WAU / MAU * 100`
**Interpretation**:
- **Excellent**: >40% (High engagement)
- **Good**: 30-40% (Healthy retention)
- **Needs Attention**: 20-30% (Moderate engagement)
- **Critical**: <20% (Poor retention)

### Average Sessions per User
**Definition**: Mean number of distinct sessions per user
**KQL Logic**: `dcount(sessionId)` divided by `dcount(userId)`
**Business Value**: Indicates usage intensity and workflow complexity

### Session Frequency
**Definition**: Average number of active days per user in 28-day period
**KQL Logic**: `dcount(format_datetime(PreciseTimeStamp, 'yyyy-MM-dd'))` per user
**Business Value**: Measures user engagement consistency

### User Journey Flow
**Definition**: Navigation patterns between different blades within sessions
**KQL Logic**: Session-based source-target blade transitions
**Business Value**: Identifies user workflows and optimization opportunities

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

This dashboard enables data-driven decisions for Azure Portal blade improvements by:

- **Workflow Analysis**: Understanding the complete data pipeline from extraction to visualization
- **Metric Standardization**: Consistent definitions across MAU, WAU, stickiness, and user journeys  
- **Quality Assurance**: Built-in validation workflows ensure data reliability
- **Actionable Insights**: Interactive visualizations with transparent query access

**Workflow Benefits**:
1. **Reproducible Process**: Documented steps for consistent analysis
2. **Data Validation**: Multi-step verification ensures accuracy
3. **Visual Analytics**: D3.js charts provide intuitive data exploration
4. **Query Transparency**: Users can view and modify underlying KQL queries

**Next Steps**: Follow the workflow documentation to analyze different blade sets, time periods, or user segments using the same proven methodology.
