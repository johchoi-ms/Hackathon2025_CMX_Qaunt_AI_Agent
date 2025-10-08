// NetSec Analytics Dashboard JavaScript with D3.js

let dashboardData = {};
let queries = {};

// Load and initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('./netsec_ver02.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        dashboardData = await response.json();
        
        console.log('Dashboard data loaded:', dashboardData);
        
        // Store queries for modal display
        extractQueries();
        
        // Initialize all visualizations
        initializeCharts();
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load dashboard data: ' + error.message);
        
        // Show error message in containers
        d3.select('#mau-chart').html('<div style="padding: 20px; text-align: center; color: red;">Error loading data</div>');
        d3.select('#weekly-trend-chart').html('<div style="padding: 20px; text-align: center; color: red;">Error loading data</div>');
        d3.select('#sankey-chart').html('<div style="padding: 20px; text-align: center; color: red;">Error loading data</div>');
        d3.select('#sessions-chart').html('<div style="padding: 20px; text-align: center; color: red;">Error loading data</div>');
        d3.select('#engagement-table').html('<div style="padding: 20px; text-align: center; color: red;">Error loading data</div>');
    }
}

// Extract queries from data for modal display
function extractQueries() {
    queries = {
        'mau_by_blade': dashboardData.queries_and_results.monthly_active_users_by_blade.query,
        'weekly_trend': dashboardData.queries_and_results.weekly_active_users_trend.query,
        'user_journey': dashboardData.queries_and_results.user_journey_sankey_data.query,
        'sessions_per_user': dashboardData.queries_and_results.average_sessions_per_user.query,
        'engagement': dashboardData.queries_and_results.session_frequency.query
    };
}

// Initialize all charts
function initializeCharts() {
    createMAUChart();
    createWeeklyTrendChart();
    createSankeyChart();
    createSessionsChart();
    createEngagementTable();
}

// Create MAU by Blade Bar Chart
function createMAUChart() {
    const container = d3.select('#mau-chart');
    const data = dashboardData.queries_and_results.monthly_active_users_by_blade.result;
    
    // Clear existing content
    container.selectAll('*').remove();
    
    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 100, left: 70};
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(d => getShortName(d.BladeName)));
    
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.MAU_28d)]);
    
    // Create color scale
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, data.length - 1]);
    
    // Create bars
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(getShortName(d.BladeName)))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.MAU_28d))
        .attr('height', d => height - yScale(d.MAU_28d))
        .attr('fill', (d, i) => colorScale(i))
        .on('mouseover', function(event, d) {
            showTooltip(event, `<strong>${getShortName(d.BladeName)}</strong><br/>MAU: ${d.MAU_28d.toLocaleString()}`);
        })
        .on('mouseout', hideTooltip);
    
    // Add x axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .style('font-size', '10px');
    
    // Add y axis
    svg.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d => (d/1000) + 'K'));
    
    // Add axis labels
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Monthly Active Users');
}

// Create Weekly Trend Line Chart
function createWeeklyTrendChart() {
    const container = d3.select('#weekly-trend-chart');
    const data = dashboardData.queries_and_results.weekly_active_users_trend.result;
    
    // Clear existing content
    container.selectAll('*').remove();
    
    if (!data || data.length === 0) {
        container.append('div')
            .style('text-align', 'center')
            .style('padding', '50px')
            .style('color', '#666')
            .text('No weekly trend data available');
        return;
    }
    
    // Filter to show top 6 services by current week (Week 0) WAU for better visibility
    const currentWeekData = data.filter(d => d.WeeksAgo === 0);
    const topServices = currentWeekData
        .sort((a, b) => b.WAU - a.WAU)
        .slice(0, 6)
        .map(d => d.BladeName);
    
    const filteredData = data.filter(d => topServices.includes(d.BladeName));
    
    // Set dimensions and margins
    const margin = {top: 20, right: 140, bottom: 80, left: 70};
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales - reverse x scale so Week 0 (current) is on the right
    const xScale = d3.scaleLinear()
        .range([width, 0])  // Reversed range
        .domain([0, 3]);  // WeeksAgo: 0 to 3
    
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(filteredData, d => d.WAU) * 1.1]);
    
    // Group data by blade
    const groupedData = d3.group(filteredData, d => d.BladeName);
    
    // Color scale with distinct colors
    const colorScale = d3.scaleOrdinal()
        .domain(topServices)
        .range(['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']);
    
    // Line generator
    const line = d3.line()
        .x(d => xScale(d.WeeksAgo))
        .y(d => yScale(d.WAU))
        .curve(d3.curveMonotoneX);
    
    // Add lines for each service
    groupedData.forEach((values, key) => {
        const sortedValues = values.sort((a, b) => b.WeeksAgo - a.WeeksAgo); // Sort descending for proper line connection
        
        svg.append('path')
            .datum(sortedValues)
            .attr('class', 'trend-line')
            .attr('d', line)
            .style('stroke', colorScale(key))
            .style('fill', 'none')
            .style('stroke-width', 3)
            .style('opacity', 0.8);
        
        // Add dots for data points
        svg.selectAll(`.dot-${key.replace(/[^a-zA-Z0-9]/g, '')}`)
            .data(sortedValues)
            .enter().append('circle')
            .attr('class', 'trend-dot')
            .attr('cx', d => xScale(d.WeeksAgo))
            .attr('cy', d => yScale(d.WAU))
            .attr('r', 5)
            .style('fill', colorScale(key))
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .on('mouseover', function(event, d) {
                const weekLabel = d.WeeksAgo === 0 ? 'Current Week' : `${d.WeeksAgo} weeks ago`;
                showTooltip(event, `<strong>${getShortName(d.BladeName)}</strong><br/>${weekLabel} (${d.WeekCategory})<br/>WAU: ${d.WAU.toLocaleString()}`);
            })
            .on('mouseout', hideTooltip);
        
        // Decline percentage calculation for legend (removed inline labels)
        const currentWeek = sortedValues.find(d => d.WeeksAgo === 0);
        const threeWeeksAgo = sortedValues.find(d => d.WeeksAgo === 3);
    });
    
    // Add x axis with custom labels
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickValues([3, 2, 1, 0])
            .tickFormat(d => d === 0 ? 'Current Week' : `${d} weeks ago`))
        .selectAll('text')
        .style('font-size', '11px')
        .attr('transform', 'rotate(-15)')
        .style('text-anchor', 'end');
    
    // Add y axis
    svg.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d => {
            if (d >= 1000) return (d/1000) + 'K';
            return d;
        }));
    
    // Add simple legend without decline percentages
    const legend = svg.append('g')
        .attr('transform', `translate(${width + 15}, 20)`);
    
    let legendY = 0;
    groupedData.forEach((values, key) => {
        // Color indicator
        legend.append('rect')
            .attr('x', 0)
            .attr('y', legendY)
            .attr('width', 12)
            .attr('height', 12)
            .style('fill', colorScale(key));
        
        // Service name only
        legend.append('text')
            .attr('x', 18)
            .attr('y', legendY + 9)
            .text(getShortName(key))
            .style('font-size', '11px')
            .style('font-weight', '500');
        
        legendY += 20;
    });
    
    // Add title for legend
    legend.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .text('Services')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#333');
    
    // Add axis labels
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .text('Weekly Active Users');
    
    svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .text('Time Period');
}

// Create Sankey Diagram - Simplified approach without d3-sankey dependency
function createSankeyChart() {
    const container = d3.select('#sankey-chart');
    const rawData = dashboardData.queries_and_results.user_journey_sankey_data.result;
    
    // Clear existing content
    container.selectAll('*').remove();
    
    if (!rawData || rawData.length === 0) {
        container.append('div')
            .style('text-align', 'center')
            .style('padding', '50px')
            .style('color', '#666')
            .text('User Journey Flow Data');
        return;
    }
    
    // Create container with flex layout for table and chart
    const flexContainer = container.append('div')
        .style('display', 'flex')
        .style('align-items', 'flex-start')
        .style('gap', '20px');
    
    // Create data table on the left (increased width)
    const tableContainer = flexContainer.append('div')
        .style('flex', '0 0 400px')
        .style('background', '#f8f9fa')
        .style('border-radius', '8px')
        .style('padding', '15px');
    
    // Add table title
    tableContainer.append('h4')
        .style('margin', '0 0 15px 0')
        .style('color', '#333')
        .style('font-size', '14px')
        .text('Service Metrics');
    
    // Get MAU data and top flows
    const mauData = dashboardData.queries_and_results.monthly_active_users_by_blade.result;
    const topFlows = rawData.slice(0, 8);
    
    // Create nodes data for table
    const nodes = Array.from(new Set(topFlows.flatMap(d => [d.Blade1, d.Blade2])))
        .map(name => {
            const mauRecord = mauData.find(m => m.BladeName === name);
            return {
                name: getShortName(name),
                fullName: name,
                mau: mauRecord ? mauRecord.MAU_28d : 0
            };
        })
        .sort((a, b) => b.mau - a.mau);
    
    // Create MAU table
    const mauTable = tableContainer.append('table')
        .style('width', '100%')
        .style('border-collapse', 'collapse')
        .style('margin-bottom', '20px')
        .style('font-size', '12px');
    
    // MAU table header
    const mauHeader = mauTable.append('thead').append('tr');
    mauHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '8px')
        .style('background', '#e9ecef')
        .style('text-align', 'left')
        .style('font-weight', 'bold')
        .text('Service');
    mauHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '8px')
        .style('background', '#e9ecef')
        .style('text-align', 'right')
        .style('font-weight', 'bold')
        .text('MAU');
    
    // MAU table body
    const mauBody = mauTable.append('tbody');
    nodes.forEach(node => {
        const row = mauBody.append('tr');
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '6px 8px')
            .style('font-weight', '500')
            .text(node.name);
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '6px 8px')
            .style('text-align', 'right')
            .style('color', '#0066cc')
            .style('font-weight', '600')
            .text(node.mau.toLocaleString());
    });
    
    // Create flows table
    tableContainer.append('h4')
        .style('margin', '15px 0 10px 0')
        .style('color', '#333')
        .style('font-size', '14px')
        .text('Top Co-occurrences');
    
    const flowsTable = tableContainer.append('table')
        .style('width', '100%')
        .style('border-collapse', 'collapse')
        .style('font-size', '11px');
    
    // Flows table header
    const flowsHeader = flowsTable.append('thead').append('tr');
    flowsHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '4px')
        .style('background', '#e9ecef')
        .style('text-align', 'left')
        .style('font-weight', 'bold')
        .style('font-size', '10px')
        .text('Service A');
    flowsHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '4px')
        .style('background', '#e9ecef')
        .style('text-align', 'left')
        .style('font-weight', 'bold')
        .style('font-size', '10px')
        .text('Service B');
    flowsHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '4px')
        .style('background', '#e9ecef')
        .style('text-align', 'right')
        .style('font-weight', 'bold')
        .style('font-size', '10px')
        .text('Count');
    flowsHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '4px')
        .style('background', '#e9ecef')
        .style('text-align', 'right')
        .style('font-weight', 'bold')
        .style('font-size', '10px')
        .text('% A');
    flowsHeader.append('th')
        .style('border', '1px solid #ddd')
        .style('padding', '4px')
        .style('background', '#e9ecef')
        .style('text-align', 'right')
        .style('font-weight', 'bold')
        .style('font-size', '10px')
        .text('% B');
    
    // Flows table body
    const flowsBody = flowsTable.append('tbody');
    topFlows.slice(0, 6).forEach(flow => {
        // Get MAU for both services
        const mauA = mauData.find(m => m.BladeName === flow.Blade1)?.MAU_28d || 1;
        const mauB = mauData.find(m => m.BladeName === flow.Blade2)?.MAU_28d || 1;
        
        // Calculate percentages
        const percentA = ((flow.CooccurrenceCount / mauA) * 100).toFixed(1);
        const percentB = ((flow.CooccurrenceCount / mauB) * 100).toFixed(1);
        
        const row = flowsBody.append('tr');
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '3px 4px')
            .style('font-size', '9px')
            .text(getShortName(flow.Blade1));
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '3px 4px')
            .style('font-size', '9px')
            .text(getShortName(flow.Blade2));
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '3px 4px')
            .style('text-align', 'right')
            .style('color', '#0066cc')
            .style('font-weight', '600')
            .style('font-size', '9px')
            .text(flow.CooccurrenceCount.toLocaleString());
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '3px 4px')
            .style('text-align', 'right')
            .style('color', '#28a745')
            .style('font-weight', '600')
            .style('font-size', '9px')
            .text(percentA + '%');
        row.append('td')
            .style('border', '1px solid #ddd')
            .style('padding', '3px 4px')
            .style('text-align', 'right')
            .style('color', '#28a745')
            .style('font-weight', '600')
            .style('font-size', '9px')
            .text(percentB + '%');
    });
    
    // Create chart container on the right
    const chartContainer = flexContainer.append('div')
        .style('flex', '1');
    
    // Create a simple flow visualization with adjusted dimensions
    const margin = {top: 40, right: 30, bottom: 40, left: 30};
    const width = 680 - margin.left - margin.right; // Reduced to accommodate table
    const height = 500 - margin.top - margin.bottom;
    
    const svg = chartContainer.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Get top 8 flows for chart
    const chartFlows = rawData.slice(0, 8);
    
    // Get MAU data for node sizing in chart
    const chartMauData = dashboardData.queries_and_results.monthly_active_users_by_blade.result;
    
    // Create nodes with MAU data for chart
    const chartNodes = Array.from(new Set(chartFlows.flatMap(d => [d.Blade1, d.Blade2])))
        .map(name => {
            const mauRecord = mauData.find(m => m.BladeName === name);
            return {
                name: getShortName(name),
                fullName: name,
                mau: mauRecord ? mauRecord.MAU_28d : 0
            };
        });
    
    // Create radius scale based on MAU values
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(chartNodes, d => d.mau)])
        .range([10, 35]);
    
    const radius = Math.min(width, height) / 2 - 80; // Increased margin for larger nodes
    const angleStep = (2 * Math.PI) / chartNodes.length;
    
    // Position nodes in a circle
    chartNodes.forEach((node, i) => {
        node.x = width / 2 + radius * Math.cos(i * angleStep - Math.PI / 2);
        node.y = height / 2 + radius * Math.sin(i * angleStep - Math.PI / 2);
        node.radius = radiusScale(node.mau);
    });
    
    // Create links
    const links = chartFlows.map(d => {
        const source = chartNodes.find(n => n.name === getShortName(d.Blade1));
        const target = chartNodes.find(n => n.name === getShortName(d.Blade2));
        return {
            source: source,
            target: target,
            value: d.CooccurrenceCount
        };
    }).filter(d => d.source && d.target); // Filter out any missing nodes
    
    // Draw links
    const maxFlow = d3.max(links, d => d.value);
    const strokeScale = d3.scaleLinear()
        .domain([0, maxFlow])
        .range([1, 8]);
    
    svg.selectAll('.flow-link')
        .data(links)
        .enter().append('line')
        .attr('class', 'flow-link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .style('stroke', '#764ba2')
        .style('stroke-width', d => strokeScale(d.value))
        .style('stroke-opacity', 0.6)
        .on('mouseover', function(event, d) {
            showTooltip(event, `<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Flow: ${d.value.toLocaleString()}`);
        })
        .on('mouseout', hideTooltip);
    
    // Draw nodes with MAU-based sizing
    svg.selectAll('.flow-node')
        .data(chartNodes)
        .enter().append('circle')
        .attr('class', 'flow-node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.radius)
        .style('fill', '#667eea')
        .style('stroke', '#fff')
        .style('stroke-width', 3)
        .on('mouseover', function(event, d) {
            showTooltip(event, `<strong>${d.name}</strong><br/>MAU: ${d.mau.toLocaleString()}`);
        })
        .on('mouseout', hideTooltip);
    
    // Add labels
    svg.selectAll('.flow-label')
        .data(chartNodes)
        .enter().append('text')
        .attr('class', 'flow-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y - 35)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text(d => d.name);
}

// Create Sessions per User Chart
function createSessionsChart() {
    const container = d3.select('#sessions-chart');
    const data = dashboardData.queries_and_results.average_sessions_per_user.result;
    
    // Filter out overall metric and get top services
    const filteredData = data.filter(d => d.Metric !== 'Overall_Avg_Sessions_Per_User')
        .map(d => ({
            name: getShortName(d.Metric.replace('Avg_Sessions_Per_User_', '')),
            value: d.Value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    
    // Clear existing content
    container.selectAll('*').remove();
    
    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 80, left: 70};
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(filteredData.map(d => d.name));
    
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(filteredData, d => d.value)]);
    
    // Create gradient
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'bar-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', height)
        .attr('x2', 0).attr('y2', 0);
    
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#764ba2');
    
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#667eea');
    
    // Create bars
    svg.selectAll('.bar')
        .data(filteredData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - yScale(d.value))
        .attr('fill', 'url(#bar-gradient)')
        .on('mouseover', function(event, d) {
            showTooltip(event, `<strong>${d.name}</strong><br/>Avg Sessions: ${d.value}`);
        })
        .on('mouseout', hideTooltip);
    
    // Add x axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .style('font-size', '10px');
    
    // Add y axis
    svg.append('g')
        .call(d3.axisLeft(yScale));
    
    // Add axis labels
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Average Sessions per User');
}

// Create Engagement Metrics Table
function createEngagementTable() {
    const container = d3.select('#engagement-table');
    const sessionData = dashboardData.queries_and_results.average_sessions_per_user.result;
    const frequencyData = dashboardData.queries_and_results.session_frequency.result;
    const mauData = dashboardData.queries_and_results.monthly_active_users_by_blade.result;
    
    // Clear existing content
    container.selectAll('*').remove();
    
    // Combine data
    const combinedData = mauData.map(mau => {
        const sessionMetric = sessionData.find(s => s.Metric.includes(mau.BladeName));
        const frequencyMetric = frequencyData.find(f => f.Metric.includes(mau.BladeName));
        
        return {
            service: getShortName(mau.BladeName),
            mau: mau.MAU_28d,
            avgSessions: sessionMetric ? sessionMetric.Value : 'N/A',
            avgActiveDays: frequencyMetric ? frequencyMetric.Value : 'N/A'
        };
    }).slice(0, 8);
    
    // Create table
    const table = container.append('table')
        .attr('class', 'engagement-table');
    
    // Create header
    const header = table.append('thead').append('tr');
    header.selectAll('th')
        .data(['Service', 'MAU', 'Avg Sessions/User', 'Avg Active Days'])
        .enter().append('th')
        .text(d => d);
    
    // Create body
    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(combinedData)
        .enter().append('tr');
    
    rows.selectAll('td')
        .data(d => [d.service, d.mau.toLocaleString(), d.avgSessions, d.avgActiveDays])
        .enter().append('td')
        .text(d => d);
}

// Helper function to get short names for services
function getShortName(fullName) {
    const shortNames = {
        'Extension/Microsoft_Azure_Monitoring/Blade/GettingStartedBladeViewModel': 'Azure Monitor',
        'Extension/Microsoft_Azure_Security/Blade/OverviewBladeV3': 'Azure Security',
        'Extension/Microsoft_Azure_Network/Blade/CreatePrivateEndpointBlade': 'Private Endpoint',
        'Extension/Microsoft_Azure_HybridNetworking/Blade/GettingStartedTabs.ReactView': 'NetSec Overview',
        'Extension/Microsoft_Azure_RecoveryServices/Blade/CreateBladeFullScreen': 'Recovery Services',
        'Extension/Microsoft_Azure_Security_Insights/Blade/OnboardingBlade': 'Azure Sentinel',
        'Extension/Microsoft_Azure_HybridNetworking/Blade/CreateBastionHostBlade': 'Bastion Host',
        'Extension/Microsoft_Azure_DataProtection/Blade/BackupCenterOverviewBlade': 'Backup Center',
        'Extension/Microsoft_Azure_DNS/Blade/TrafficManagerCreate.ReactView': 'Traffic Manager',
        'Extension/Microsoft_Azure_HybridNetworking/Blade/RelatedServices.ReactView': 'Related Services'
    };
    
    return shortNames[fullName] || fullName.split('/').pop().replace('Blade', '').replace('.ReactView', '');
}

// Tooltip functions
function showTooltip(event, content) {
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('opacity', 0);
    
    tooltip.html(content)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
}

function hideTooltip() {
    d3.selectAll('.tooltip').remove();
}

// Modal functions for query display
function showQuery(queryType) {
    const modal = document.getElementById('queryModal');
    const content = document.getElementById('queryContent');
    
    if (queries[queryType]) {
        content.textContent = queries[queryType];
        modal.style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('queryModal').style.display = 'none';
}

function copyQuery() {
    const content = document.getElementById('queryContent');
    navigator.clipboard.writeText(content.textContent).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

// Error handling
function showError(message) {
    console.error(message);
    // Add error display to UI if needed
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('queryModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Resize charts on window resize
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        initializeCharts();
    }, 250);
});
