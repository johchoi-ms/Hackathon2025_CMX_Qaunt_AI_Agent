# User Guide
Azure Blade Analytics Dashboard

## Table of Contents
1. [Getting Started](#getting-started)
2. [Understanding the Dashboard](#understanding-the-dashboard)
3. [Interactive Features](#interactive-features)
4. [Uploading Your Own Data](#uploading-your-own-data)
5. [Interpreting Metrics](#interpreting-metrics)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Usage](#advanced-usage)

## Getting Started

### Accessing the Dashboard
Visit your deployed dashboard URL:
- **Azure Static Web Apps**: `https://your-app-name.azurestaticapps.net`
- **GitHub Pages**: `https://johchoi-ms.github.io/Hackathon2025_CMX_Qaunt_AI_Agent/`
- **Custom Domain**: `https://dashboard.yourcompany.com`

### First Time Visit
When you first visit the dashboard, you'll see:
1. **Welcome Section** - Brief introduction and options
2. **Loading Screen** - While data and visualizations load
3. **Main Dashboard** - Interactive analytics interface

### System Requirements
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **JavaScript**: Must be enabled
- **Internet Connection**: Required for D3.js library
- **Screen Resolution**: 1024x768 minimum (responsive design)

## Understanding the Dashboard

### Layout Overview
The dashboard is organized into several sections:

```
┌─────────────────────────────────────┐
│              Header                 │
├─────────────────────────────────────┤
│         Executive Summary           │
├─────────────────────────────────────┤
│        Anomalies & Red Flags        │
├─────────────────────────────────────┤
│           Metrics Grid              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │   MAU   │ │   WAU   │ │Stickiness│
│  └─────────┘ └─────────┘ └─────────┘│
│  ┌─────────┐ ┌─────────┐            │
│  │Sessions │ │Frequency│            │
│  └─────────┘ └─────────┘            │
│  ┌───────────────────────────────────│
│  │      User Journey Flow           │
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│         Recommendations             │
└─────────────────────────────────────┘
```

### Key Sections

#### 1. Executive Summary
- **Purpose**: High-level overview of key findings
- **Content**: Concise analysis of main trends and insights
- **Usage**: Start here to understand overall performance

#### 2. Anomalies & Red Flags
- **Critical Issues**: Urgent problems requiring immediate attention
- **Warnings**: Areas of concern that need monitoring
- **Opportunities**: Positive patterns to leverage

#### 3. Metrics Grid
- **6 Key Visualizations**: Each showing different aspects of user engagement
- **Interactive Charts**: Hover for details, click for queries
- **Color Coding**: Visual indicators of performance levels

## Interactive Features

### Chart Interactions

#### Hover Tooltips
- **Purpose**: Get detailed information without clutter
- **Usage**: Move mouse over chart elements
- **Information**: Specific values, percentages, context

#### Query Buttons
- **Location**: Top-right of each chart section
- **Function**: Shows the KQL query used to generate data
- **Benefits**: Transparency, learning, customization

```javascript
// Example: Clicking "Show Query" reveals:
ClientTelemetry 
| where PreciseTimeStamp >= ago(28d)
| where action == "BladeFullReady"
| summarize MAU = dcount(userId) by name
```

#### Copy Functionality
- **Access**: Click "Copy to Clipboard" in query modal
- **Usage**: Paste into Azure Data Explorer or your own tools
- **Benefit**: Reproduce analysis with your own data

### Data Upload Feature

#### Supported Formats
- **File Type**: JSON only
- **Size Limit**: 10MB maximum
- **Structure**: Must match Azure telemetry schema

#### Upload Process
1. Click "Upload Your Data" button
2. Select JSON file or drag & drop
3. System validates data structure
4. Dashboard refreshes with your data
5. All visualizations update automatically

#### Validation Requirements
Your JSON must include these sections:
```json
{
  "metadata": { ... },
  "metrics": {
    "monthly_active_users": { ... },
    "stickiness": { ... },
    "user_journey_sankey": { ... }
  }
}
```

## Interpreting Metrics

### Monthly Active Users (MAU)
- **Definition**: Unique users who accessed blades in last 28 days
- **Visualization**: Bar chart sorted by user count
- **Key Insights**: 
  - Which blades have highest adoption
  - Relative popularity comparison
  - Overall reach assessment

**Interpretation Guide:**
- **High MAU**: Popular, well-adopted features
- **Low MAU**: May need promotion or UX improvement
- **Balanced Distribution**: Healthy ecosystem

### Weekly Active Users (WAU) Trend
- **Definition**: Weekly active users over 4-week period
- **Visualization**: Multi-line chart showing trends
- **Key Insights**: 
  - Usage stability over time
  - Seasonal patterns
  - Growth or decline trends

**Interpretation Guide:**
- **Stable Lines**: Consistent usage patterns
- **Upward Trends**: Growing adoption
- **Volatile Lines**: Inconsistent user experience
- **Downward Trends**: May indicate issues

### Stickiness (WAU/MAU)
- **Definition**: Ratio of weekly to monthly active users
- **Visualization**: Color-coded bar chart
- **Key Insights**: User retention quality

**Performance Levels:**
- 🟢 **Excellent** (>40%): High engagement, users return frequently
- 🟡 **Good** (30-40%): Healthy retention patterns
- 🟠 **Needs Attention** (20-30%): Moderate engagement
- 🔴 **Critical** (<20%): Poor retention, investigate immediately

### Average Sessions per User
- **Definition**: Mean number of sessions per user
- **Visualization**: Bar chart with values labeled
- **Key Insights**: Usage intensity patterns

**Interpretation Guide:**
- **High Values** (>3.0): May indicate complex workflows or inefficiency
- **Moderate Values** (2.0-3.0): Normal usage patterns
- **Low Values** (<2.0): Efficient workflows or low engagement

### Session Frequency
- **Definition**: Average active days per user in 28-day period
- **Visualization**: Bar chart showing daily engagement
- **Key Insights**: User engagement consistency

**Patterns:**
- **High Frequency** (>2.0 days): Regular, consistent usage
- **Moderate Frequency** (1.5-2.0 days): Periodic usage
- **Low Frequency** (<1.5 days): Infrequent usage

### User Journey Flow
- **Definition**: Navigation patterns between blades
- **Visualization**: Horizontal bar chart of top flows
- **Key Insights**: User workflow understanding

**Analysis Points:**
- **Top Flows**: Most common navigation patterns
- **Hub Patterns**: Blades that serve as central points
- **Workflow Efficiency**: Direct vs. indirect paths
- **Bottlenecks**: Areas where users get stuck

## Troubleshooting

### Common Issues

#### Charts Not Displaying
**Symptoms:** Empty chart areas, loading indicators
**Solutions:**
1. Check internet connection (D3.js loads from CDN)
2. Verify JSON data file exists and is valid
3. Check browser console for JavaScript errors
4. Try refreshing the page
5. Clear browser cache

#### Slow Performance
**Symptoms:** Long loading times, unresponsive interface
**Solutions:**
1. Close other browser tabs
2. Check available system memory
3. Try a different browser
4. Use a local web server instead of file:// protocol

#### Mobile Display Problems
**Symptoms:** Overlapping elements, small text
**Solutions:**
1. Rotate device to landscape mode
2. Use pinch-to-zoom for detailed viewing
3. Try on a larger screen if available

#### Data Upload Errors
**Symptoms:** Upload fails, validation errors
**Solutions:**
1. Verify file is valid JSON format
2. Check file size (must be < 10MB)
3. Ensure data structure matches required schema
4. Try with sample data first

### Getting Help

#### Browser Console
1. Press F12 to open developer tools
2. Go to Console tab
3. Look for error messages in red
4. Share error details when seeking help

#### Network Issues
1. Check Network tab in developer tools
2. Look for failed requests (red entries)
3. Verify all resources are loading correctly

#### Data Validation
```javascript
// Test your data structure
function validateData(data) {
  return data && 
         data.metrics && 
         data.metrics.monthly_active_users &&
         data.metrics.stickiness;
}
```

## Advanced Usage

### Customizing the Dashboard

#### Modifying Visualizations
1. **Colors**: Edit color schemes in `dashboard.css`
2. **Layout**: Adjust grid layout and responsive breakpoints
3. **Chart Types**: Modify D3.js visualizations in `dashboard.js`

#### Adding New Metrics
1. **Data Processing**: Add new data processing functions
2. **Visualization**: Create new chart functions
3. **HTML Structure**: Add corresponding sections
4. **Styling**: Include CSS classes

### Integration Options

#### Embedding in Other Applications
```html
<!-- Embed dashboard in iframe -->
<iframe src="https://your-dashboard-url.com" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>
```

#### API Integration
- **Data Source**: Connect to live Azure Data Explorer
- **Real-time Updates**: Implement automatic data refresh
- **Authentication**: Add Azure AD integration

### Performance Optimization

#### Data Optimization
- **File Size**: Compress JSON data
- **Caching**: Implement browser caching
- **CDN**: Use content delivery networks

#### Code Optimization
- **Minification**: Minify JavaScript and CSS
- **Lazy Loading**: Load charts on demand
- **Debouncing**: Optimize user interactions

### Export and Sharing

#### Export Options
- **Print**: Use browser print function (optimized CSS included)
- **PDF**: Print to PDF for reports
- **Screenshots**: Use browser screenshot tools
- **Data**: Download underlying JSON data

#### Sharing Features
- **URLs**: Share direct links to dashboard
- **Embedding**: Embed in presentations or documents
- **API**: Programmatic access to data

### Contributing

#### Development Setup
```bash
git clone https://github.com/johchoi-ms/Hackathon2025_CMX_Qaunt_AI_Agent.git
cd Hackathon2025_CMX_Qaunt_AI_Agent
# Make your changes
git add .
git commit -m "Your improvement description"
git push origin feature-branch
```

#### Contribution Guidelines
1. **Testing**: Test across multiple browsers
2. **Documentation**: Update relevant docs
3. **Code Style**: Follow existing patterns
4. **Pull Requests**: Include detailed descriptions

## Best Practices

### Data Analysis
1. **Start with Executive Summary** for overview
2. **Identify anomalies** first for urgent issues
3. **Drill down** into specific metrics
4. **Cross-reference** multiple metrics for validation
5. **Document insights** for future reference

### Regular Monitoring
1. **Weekly Reviews**: Check for new anomalies
2. **Monthly Analysis**: Look for trends and patterns
3. **Quarterly Planning**: Use insights for roadmap planning
4. **Annual Assessment**: Evaluate overall improvements

### Collaboration
1. **Share URLs**: Easy to distribute to team members
2. **Export Reports**: Create PDF summaries for stakeholders
3. **Query Sharing**: Share KQL queries with data analysts
4. **Feedback Loop**: Gather input from dashboard users

---

**Need more help?** Check the [Deployment Guide](DEPLOYMENT.md) for technical setup or open an issue on GitHub for feature requests and bug reports.