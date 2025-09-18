// Load data from JSON file
let dashboardData;

// Load the JSON data
async function loadData() {
    try {
        const response = await fetch('test09091818.json');
        dashboardData = await response.json();
        initializeDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
        document.body.innerHTML = '<div style="text-align:center;margin-top:50px;"><h2>Error loading data. Please ensure test09091818.json is in the same directory.</h2></div>';
    }
}

// Initialize dashboard once data is loaded
function initializeDashboard() {
    setCurrentDate();
    createMAUChart();
    createWAUTrendChart();
    createStickinessChart();
    createSessionsChart();
    createSankeyDiagram();
}

// Set current date in footer
function setCurrentDate() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Create MAU Chart
function createMAUChart() {
    const ctx = document.getElementById('mauChart').getContext('2d');
    const mauData = dashboardData.metrics.monthly_active_users.by_blade;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mauData.map(item => item.blade_short_name),
            datasets: [{
                label: 'Monthly Active Users',
                data: mauData.map(item => item.mau),
                backgroundColor: [
                    '#3498db',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c',
                    '#34495e'
                ],
                borderColor: [
                    '#2980b9',
                    '#c0392b',
                    '#d68910',
                    '#8e44ad',
                    '#16a085',
                    '#2c3e50'
                ],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `MAU: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// Create WAU Trend Chart
function createWAUTrendChart() {
    const ctx = document.getElementById('wauTrendChart').getContext('2d');
    const overallTrend = dashboardData.metrics.weekly_active_users.overall_trend;
    const bladeData = dashboardData.metrics.weekly_active_users.by_blade;
    
    const datasets = [];
    
    // Overall trend
    datasets.push({
        label: 'Overall WAU',
        data: overallTrend.map(week => week.wau),
        borderColor: '#2c3e50',
        backgroundColor: 'rgba(44, 62, 80, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
    });
    
    // Individual blade trends
    const colors = ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#95a5a6'];
    bladeData.forEach((blade, index) => {
        datasets.push({
            label: blade.blade_short_name,
            data: blade.weekly_trend.map(week => week.wau),
            borderColor: colors[index],
            backgroundColor: colors[index] + '20',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4
        });
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1 (Oldest)', 'Week 2', 'Week 3', 'Week 4 (Recent)'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Create Stickiness Chart
function createStickinessChart() {
    const ctx = document.getElementById('stickinessChart').getContext('2d');
    const stickinessData = dashboardData.metrics.stickiness.by_blade;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: stickinessData.map(item => item.blade_short_name),
            datasets: [{
                label: 'Stickiness %',
                data: stickinessData.map(item => (item.stickiness_ratio * 100).toFixed(1)),
                backgroundColor: [
                    '#3498db',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c',
                    '#34495e'
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const blade = stickinessData[context.dataIndex];
                            return [
                                `${context.label}: ${context.parsed}%`,
                                `WAU: ${blade.wau_recent.toLocaleString()}`,
                                `MAU: ${blade.mau.toLocaleString()}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Create Sessions Chart
function createSessionsChart() {
    const ctx = document.getElementById('sessionsChart').getContext('2d');
    const sessionData = dashboardData.metrics.average_sessions_per_user.by_blade;
    
    // Sort by avg sessions per user for better visualization
    const sortedData = sessionData.sort((a, b) => b.avg_sessions_per_user - a.avg_sessions_per_user);
    
    new Chart(ctx, {
        type: 'horizontalBar' in Chart.defaults ? 'horizontalBar' : 'bar',
        data: {
            labels: sortedData.map(item => item.blade_short_name),
            datasets: [{
                label: 'Avg Sessions per User',
                data: sortedData.map(item => item.avg_sessions_per_user),
                backgroundColor: [
                    '#9b59b6',
                    '#f39c12',
                    '#3498db',
                    '#1abc9c',
                    '#e74c3c',
                    '#34495e'
                ],
                borderColor: [
                    '#8e44ad',
                    '#d68910',
                    '#2980b9',
                    '#16a085',
                    '#c0392b',
                    '#2c3e50'
                ],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: Chart.defaults.indexAxis !== undefined ? 'y' : undefined,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = sortedData[context.dataIndex];
                            return [
                                `Avg Sessions: ${context.parsed.x || context.parsed.y}`,
                                `Total Sessions: ${item.total_sessions.toLocaleString()}`,
                                `Unique Users: ${item.unique_users.toLocaleString()}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                }
            }
        }
    });
}

// Create Sankey Diagram
function createSankeyDiagram() {
    const sankeyContainer = d3.select("#sankeyChart");
    sankeyContainer.selectAll("*").remove(); // Clear previous content
    
    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const width = sankeyContainer.node().offsetWidth - margin.left - margin.right;
    const height = sankeyContainer.node().offsetHeight - margin.top - margin.bottom;
    
    const svg = sankeyContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
        
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Prepare Sankey data based on blade usage
    const nodes = dashboardData.metrics.sankey_diagram_data.nodes.map((node, i) => ({
        id: i,
        name: node.name,
        shortName: node.id,
        users: node.users,
        sessions: node.sessions
    }));
    
    // Create artificial links based on usage patterns (since real user flow data is not available)
    const links = [];
    const policyMenuIndex = nodes.findIndex(n => n.shortName === 'PolicyMenu');
    
    // PolicyMenu connects to all other blades (as the hub)
    nodes.forEach((node, i) => {
        if (i !== policyMenuIndex && node.users > 10000) {
            links.push({
                source: policyMenuIndex,
                target: i,
                value: Math.floor(node.users * 0.3) // Estimated flow
            });
        }
    });
    
    // Compliance to ComplianceDetail flow
    const complianceIndex = nodes.findIndex(n => n.shortName === 'Compliance');
    const complianceDetailIndex = nodes.findIndex(n => n.shortName === 'ComplianceDetail');
    if (complianceIndex >= 0 && complianceDetailIndex >= 0) {
        links.push({
            source: complianceIndex,
            target: complianceDetailIndex,
            value: 15000
        });
    }
    
    // PolicyOverview to ComplianceDetail flow
    const policyOverviewIndex = nodes.findIndex(n => n.shortName === 'PolicyOverview');
    if (policyOverviewIndex >= 0 && complianceDetailIndex >= 0) {
        links.push({
            source: policyOverviewIndex,
            target: complianceDetailIndex,
            value: 8000
        });
    }
    
    const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 5]]);
    
    const {nodes: sankeyNodes, links: sankeyLinks} = sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
    });
    
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(nodes.map(d => d.shortName))
        .range(['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e']);
    
    // Add links
    g.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll("path")
        .data(sankeyLinks)
        .join("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => color(sankeyNodes[d.source.index].shortName))
        .attr("stroke-width", d => Math.max(1, d.width))
        .style("mix-blend-mode", "multiply")
        .append("title")
        .text(d => `${sankeyNodes[d.source.index].name} → ${sankeyNodes[d.target.index].name}\n${d.value.toLocaleString()} estimated users`);
    
    // Add nodes
    g.append("g")
        .selectAll("rect")
        .data(sankeyNodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.shortName))
        .append("title")
        .text(d => `${d.name}\n${d.users.toLocaleString()} users\n${d.sessions.toLocaleString()} sessions`);
    
    // Add labels
    g.append("g")
        .style("font", "10px sans-serif")
        .selectAll("text")
        .data(sankeyNodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .append("tspan")
        .attr("fill-opacity", 0.7)
        .text(d => ` (${d.users.toLocaleString()})`);
    
    // Add title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#2c3e50")
        .text("User Flow Visualization (Estimated)");
        
    // Add note about data limitations
    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#7f8c8d")
        .text("Note: Flow patterns are estimated based on usage volume. Real user journey tracking requires sequence analysis.");
}

// Handle window resize
window.addEventListener('resize', function() {
    if (dashboardData) {
        // Recreate Sankey diagram on resize
        setTimeout(createSankeyDiagram, 100);
    }
});

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', loadData);
