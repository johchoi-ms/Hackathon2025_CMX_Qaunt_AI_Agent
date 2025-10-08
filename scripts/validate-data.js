#!/usr/bin/env node

/**
 * Data Structure Validation Script
 * Validates that the JSON data file has the correct structure for the dashboard
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'test_ver11.json');

function validateDataStructure() {
    console.log('🔍 Validating data structure...');
    
    // Check if file exists
    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Data file not found:', DATA_FILE);
        process.exit(1);
    }
    
    try {
        // Read and parse JSON
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(rawData);
        
        // Validate required structure
        const validationResults = [];
        
        // Check metadata
        if (!data.metadata) {
            validationResults.push('❌ Missing metadata section');
        } else {
            if (!data.metadata.generated_at) validationResults.push('⚠️  Missing metadata.generated_at');
            if (!data.metadata.data_source) validationResults.push('⚠️  Missing metadata.data_source');
            if (!data.metadata.blade_scope) validationResults.push('⚠️  Missing metadata.blade_scope');
        }
        
        // Check metrics
        if (!data.metrics) {
            validationResults.push('❌ Missing metrics section');
        } else {
            const requiredMetrics = [
                'monthly_active_users',
                'weekly_active_users_trend',
                'stickiness',
                'average_sessions_per_user',
                'user_journey_sankey',
                'session_frequency'
            ];
            
            requiredMetrics.forEach(metric => {
                if (!data.metrics[metric]) {
                    validationResults.push(`❌ Missing metrics.${metric}`);
                } else {
                    if (!data.metrics[metric].query) {
                        validationResults.push(`⚠️  Missing query for metrics.${metric}`);
                    }
                    if (!data.metrics[metric].results || !Array.isArray(data.metrics[metric].results)) {
                        validationResults.push(`❌ Missing or invalid results for metrics.${metric}`);
                    }
                }
            });
        }
        
        // Check summary
        if (!data.summary) {
            validationResults.push('⚠️  Missing summary section');
        }
        
        // Report results
        if (validationResults.length === 0) {
            console.log('✅ Data structure validation passed!');
            console.log(`📊 Metrics available: ${Object.keys(data.metrics || {}).length}`);
            console.log(`🎯 Blade scope: ${(data.metadata?.blade_scope || []).length} blades`);
            return true;
        } else {
            console.log('⚠️  Data structure validation found issues:');
            validationResults.forEach(result => console.log('   ' + result));
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error parsing JSON file:', error.message);
        return false;
    }
}

function validateDataQuality(data) {
    console.log('🔍 Validating data quality...');
    
    const issues = [];
    
    // Check for reasonable data values
    if (data.metrics?.monthly_active_users?.results) {
        const mauResults = data.metrics.monthly_active_users.results;
        const overallMAU = mauResults.find(r => r.name === 'Overall');
        
        if (overallMAU && overallMAU.MAU_Overall > 0) {
            console.log(`📈 Overall MAU: ${overallMAU.MAU_Overall.toLocaleString()}`);
        } else {
            issues.push('⚠️  No valid overall MAU found');
        }
    }
    
    // Check stickiness values
    if (data.metrics?.stickiness?.results) {
        const stickinessResults = data.metrics.stickiness.results;
        const invalidStickiness = stickinessResults.filter(r => 
            r.Stickiness < 0 || r.Stickiness > 1
        );
        
        if (invalidStickiness.length > 0) {
            issues.push(`⚠️  ${invalidStickiness.length} invalid stickiness values (must be 0-1)`);
        }
    }
    
    // Check user journey data
    if (data.metrics?.user_journey_sankey?.results) {
        const journeyResults = data.metrics.user_journey_sankey.results;
        if (journeyResults.length === 0) {
            issues.push('⚠️  No user journey data found');
        } else {
            console.log(`🔄 User journey flows: ${journeyResults.length}`);
        }
    }
    
    if (issues.length === 0) {
        console.log('✅ Data quality validation passed!');
        return true;
    } else {
        console.log('⚠️  Data quality issues found:');
        issues.forEach(issue => console.log('   ' + issue));
        return false;
    }
}

// Main execution
if (require.main === module) {
    const structureValid = validateDataStructure();
    
    if (structureValid) {
        try {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            const qualityValid = validateDataQuality(data);
            
            if (structureValid && qualityValid) {
                console.log('🎉 All validations passed! Dashboard should work correctly.');
                process.exit(0);
            } else {
                console.log('⚠️  Some validations failed, but dashboard may still work.');
                process.exit(1);
            }
        } catch (error) {
            console.error('❌ Error during quality validation:', error.message);
            process.exit(1);
        }
    } else {
        console.log('❌ Structure validation failed.');
        process.exit(1);
    }
}

module.exports = { validateDataStructure, validateDataQuality };