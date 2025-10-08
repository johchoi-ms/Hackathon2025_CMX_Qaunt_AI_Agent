// Dashboard JavaScript with D3.js Visualizations
let dashboardData = null;
let queries = {};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeModal();
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('test_ver11.json');
        dashboardData = await response.json();
        
        // Store queries for modal display
        queries = {
            mau: dashboardData.metrics.monthly_active_users.query,
            wau: dashboardData.metrics.weekly_active_users_trend.query,
            stickiness: dashboardData.metrics.stickiness.query,
            sessions: dashboardData.metrics.average_sessions_per_user.query,
            frequency: dashboardData.metrics.session_frequency.query,
            sankey: dashboardData.metrics.user_journey_sankey.query
        };
        
        // Create all visualizations
        createMAUChart();
        createWAUTrendChart();
        createStickinessChart();
        createSessionsChart();
        createFrequencyChart();
        createSankeyDiagram();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage('Failed to load dashboard data');
    }
}

// Create MAU Bar Chart
function createMAUChart() {
    const data = dashboardData.metrics.monthly_active_users.results
        .filter(d => d.name !== 'Overall')
        .map(d => ({
            name: d.name.split('/').pop().replace('Blade', ''),
            value: d.MAU_by_Blade
        }))
        .sort((a, b) => b.value - a.value);

    const margin = {top: 20, right: 30, bottom: 80, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#mau-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    // Color scale
    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(['#0078d4', '#106ebe', '#005a9e', '#004578', '#003152']);

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - yScale(d.value))
        .attr('fill', d => colorScale(d.name))
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.name}: ${d.value.toLocaleString()} users`);
        })
        .on('mouseout', hideTooltip);

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.0s')));

    // Labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Monthly Active Users');
}

// Create WAU Trend Line Chart
function createWAUTrendChart() {
    const rawData = dashboardData.metrics.weekly_active_users_trend.results
        .filter(d => d.name !== 'Overall' && d.week_label.startsWith('Week_'));
    
    // Group data by blade
    const groupedData = d3.group(rawData, d => d.name);
    const bladeNames = Array.from(groupedData.keys()).map(name => name.split('/').pop().replace('Blade', ''));
    
    const margin = {top: 20, right: 120, bottom: 40, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#wau-trend-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
        .domain(['Week_1', 'Week_2', 'Week_3', 'Week_4'])
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(rawData, d => d.WAU_by_Blade)])
        .nice()
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.week_label) + xScale.bandwidth() / 2)
        .y(d => yScale(d.WAU_by_Blade))
        .curve(d3.curveMonotoneX);

    // Draw lines for each blade
    Array.from(groupedData.entries()).forEach(([bladeName, bladeData], i) => {
        const sortedData = bladeData.sort((a, b) => a.week_label.localeCompare(b.week_label));
        const shortName = bladeName.split('/').pop().replace('Blade', '');
        
        g.append('path')
            .datum(sortedData)
            .attr('class', 'line')
            .attr('d', line)
            .style('stroke', colorScale(i))
            .style('stroke-width', 2)
            .style('fill', 'none');

        // Add dots
        g.selectAll(`.dot-${i}`)
            .data(sortedData)
            .enter().append('circle')
            .attr('class', `dot dot-${i}`)
            .attr('cx', d => xScale(d.week_label) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d.WAU_by_Blade))
            .attr('r', 4)
            .style('fill', colorScale(i))
            .on('mouseover', function(event, d) {
                showTooltip(event, `${shortName} - ${d.week_label}: ${d.WAU_by_Blade.toLocaleString()} users`);
            })
            .on('mouseout', hideTooltip);
    });

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.0s')));

    // Legend
    const legend = g.selectAll('.legend')
        .data(bladeNames)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(${width + 10},${i * 20})`);

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 2)
        .style('fill', (d, i) => colorScale(i));

    legend.append('text')
        .attr('x', 18)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .style('font-size', '10px')
        .text(d => d.length > 15 ? d.substring(0, 15) + '...' : d);

    // Labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Weekly Active Users');
}

// Create Stickiness Chart
function createStickinessChart() {
    const data = dashboardData.metrics.stickiness.results
        .map(d => ({
            name: d.name === 'Overall' ? 'Overall' : d.name.split('/').pop().replace('Blade', ''),
            value: d.Stickiness,
            isOverall: d.name === 'Overall'
        }))
        .sort((a, b) => b.value - a.value);

    const margin = {top: 20, right: 30, bottom: 80, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#stickiness-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    // Bars with conditional coloring
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - yScale(d.value))
        .attr('fill', d => {
            if (d.isOverall) return '#0078d4';
            if (d.value < 0.2) return '#d13438';
            if (d.value < 0.3) return '#ff8c00';
            return '#107c10';
        })
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.name}: ${(d.value * 100).toFixed(1)}% stickiness`);
        })
        .on('mouseout', hideTooltip);

    // Add percentage labels on bars
    g.selectAll('.bar-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(d => (d.value * 100).toFixed(1) + '%');

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => (d * 100).toFixed(0) + '%'));

    // Labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Stickiness (WAU/MAU)');
}

// Create Sessions Per User Chart
function createSessionsChart() {
    const data = dashboardData.metrics.average_sessions_per_user.results
        .map(d => ({
            name: d.name === 'Overall' ? 'Overall' : d.name.split('/').pop().replace('Blade', ''),
            value: d.AvgSessionsPerUser,
            isOverall: d.name === 'Overall'
        }))
        .sort((a, b) => b.value - a.value);

    const margin = {top: 20, right: 30, bottom: 80, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#sessions-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - yScale(d.value))
        .attr('fill', d => d.isOverall ? '#0078d4' : '#106ebe')
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.name}: ${d.value.toFixed(2)} sessions per user`);
        })
        .on('mouseout', hideTooltip);

    // Add value labels on bars
    g.selectAll('.bar-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(d => d.value.toFixed(2));

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));

    // Labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Average Sessions Per User');
}

// Create Frequency Chart
function createFrequencyChart() {
    const data = dashboardData.metrics.session_frequency.results
        .map(d => ({
            name: d.name === 'Overall' ? 'Overall' : d.name.split('/').pop().replace('Blade', ''),
            value: d.AvgActiveDays,
            isOverall: d.name === 'Overall'
        }))
        .sort((a, b) => b.value - a.value);

    const margin = {top: 20, right: 30, bottom: 80, left: 70};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#frequency-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - yScale(d.value))
        .attr('fill', d => d.isOverall ? '#0078d4' : '#005a9e')
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.name}: ${d.value.toFixed(2)} active days per month`);
        })
        .on('mouseout', hideTooltip);

    // Add value labels on bars
    g.selectAll('.bar-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(d => d.value.toFixed(1));

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));

    // Labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Average Active Days (28d period)');
}

// Create User Journey Flow Chart (Horizontal Bar Chart)
function createSankeyDiagram() {
    const rawData = dashboardData.metrics.user_journey_sankey.results.slice(0, 10);
    
    const margin = {top: 60, right: 30, bottom: 100, left: 200};
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select('#sankey-chart')
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create flow labels with shortened blade names
    const flowData = rawData.map(d => ({
        ...d,
        flowLabel: `${formatBladeName(d.Source)} → ${formatBladeName(d.Target)}`
    }));

    // Create horizontal bar chart of top flows
    const yScale = d3.scaleBand()
        .domain(flowData.map(d => d.flowLabel))
        .range([0, height])
        .padding(0.1);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(rawData, d => d.FlowCount)])
        .range([0, width]);

    const colorScale = d3.scaleOrdinal()
        .domain(flowData.map(d => d.flowLabel))
        .range(['#0078d4', '#106ebe', '#005a9e', '#004578', '#003152', '#107c10', '#0b6a0b', '#004b1c', '#d13438', '#b4282c']);

    // Add bars
    g.selectAll('.flow-bar')
        .data(flowData)
        .enter().append('rect')
        .attr('class', 'flow-bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.flowLabel))
        .attr('width', d => xScale(d.FlowCount))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => colorScale(d.flowLabel))
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            showTooltip(event, `${d.flowLabel}: ${d.FlowCount.toLocaleString()} flows`);
        })
        .on('mouseout', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            hideTooltip();
        });

    // Add flow count labels
    g.selectAll('.flow-label')
        .data(flowData)
        .enter().append('text')
        .attr('class', 'flow-label')
        .attr('x', d => xScale(d.FlowCount) + 10)
        .attr('y', d => yScale(d.flowLabel) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text(d => d.FlowCount.toLocaleString());

    // Add axes
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('font-size', '11px')
        .style('font-weight', '500');

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('.0s')));

    // Add title
    svg.append('text')
        .attr('x', (width + margin.left + margin.right) / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text('User Journey Flow - Top Navigation Patterns');

    // Add axis labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 20)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#666')
        .style('font-weight', '500')
        .text('User Flow Paths');

    g.append('text')
        .attr('transform', `translate(${width / 2}, ${height + 50})`)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#666')
        .style('font-weight', '500')
        .text('Number of User Flows');

    // Helper function to format blade names
    function formatBladeName(fullName) {
        const parts = fullName.split('/');
        let bladeName = parts[parts.length - 1];
        bladeName = bladeName.replace('Blade', '').replace('.ReactView', '');
        
        // Shorten long names
        if (bladeName.length > 20) {
            bladeName = bladeName.substring(0, 17) + '...';
        }
        
        // Replace common patterns for better readability
        bladeName = bladeName.replace('Policy', 'Pol').replace('Compliance', 'Comp').replace('Overview', 'Overview');
        
        return bladeName;
    }
}

// Text wrapping function for long labels
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", -10).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", -10).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

// Modal functions
function initializeModal() {
    const modal = document.getElementById('queryModal');
    const closeBtn = document.getElementsByClassName('close')[0];

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function showQuery(queryType) {
    const modal = document.getElementById('queryModal');
    const queryText = document.getElementById('queryText');
    
    if (queries[queryType]) {
        queryText.textContent = queries[queryType];
        modal.style.display = 'block';
    }
}

function copyQuery() {
    const queryText = document.getElementById('queryText');
    navigator.clipboard.writeText(queryText.textContent).then(function() {
        // Visual feedback
        const copyBtn = document.querySelector('#queryModal button');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#107c10';
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#0078d4';
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy query: ', err);
    });
}

// Tooltip functions
function showTooltip(event, text) {
    let tooltip = document.querySelector('.tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
    tooltip.classList.add('show');
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// Error handling
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d13438;
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Helper function to format blade names
function formatBladeName(fullName) {
    if (fullName === 'Overall') return 'Overall';
    const parts = fullName.split('/');
    const bladeName = parts[parts.length - 1];
    return bladeName.replace('Blade', '').replace('.ReactView', '');
}

// Window resize handler for responsive charts
window.addEventListener('resize', function() {
    // Clear existing charts
    d3.selectAll('.chart-svg').remove();
    
    // Recreate charts with new dimensions
    if (dashboardData) {
        setTimeout(() => {
            createMAUChart();
            createWAUTrendChart();
            createStickinessChart();
            createSessionsChart();
            createFrequencyChart();
            createSankeyDiagram();
        }, 100);
    }
});
