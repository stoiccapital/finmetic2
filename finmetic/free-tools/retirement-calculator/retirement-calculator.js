// Retirement Calculator Module

// Goals Integration - Load user's financial goals as default values
function loadGoalsAsDefaults() {
    const goalsData = localStorage.getItem('finmetic_goals');
    if (goalsData) {
        const goals = JSON.parse(goalsData);
        console.log('Loading goals data as defaults for retirement calculator:', goals);
        return goals;
    }
    return null;
}

// Apply goals data to retirement calculator inputs
function applyGoalsToRetirementInputs() {
    const goals = loadGoalsAsDefaults();
    if (!goals) {
        console.log('No goals data found for retirement calculator, using default values');
        return;
    }

    // Map goals data to retirement calculator inputs
    const inputMappings = {
        // Current Assets - use current assets
        'currentAssets': goals.currentAssets,
        
        // Years to Retirement - calculate from target date
        'yearsToRetirement': Math.ceil(goals.monthsToTarget / 12),
        
        // Interest Rate - use compounding rate
        'interestRate': goals.compoundingRate,
        
        // Desired Income - use yearly income or calculate from target assets
        'desiredIncome': goals.yearlyIncome || (goals.targetAssets * 0.04), // 4% withdrawal rate
        
        // Withdrawal Rate - default to 4%
        'withdrawalRate': 4
    };

    // Apply values to inputs
    Object.keys(inputMappings).forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && inputMappings[inputId] !== undefined) {
            input.value = inputMappings[inputId];
            console.log(`Set retirement calculator ${inputId} to ${inputMappings[inputId]}`);
        }
    });
}

// Initialize retirement calculator with goals data
function initializeRetirementCalculatorWithGoals() {
    console.log('Initializing retirement calculator with goals data...');
    applyGoalsToRetirementInputs();
    
    // Auto-calculate after a short delay to ensure inputs are set
    setTimeout(() => {
        if (typeof calculateRetirement === 'function') {
            calculateRetirement();
        }
    }, 200);
}

// Retirement Calculator
function calculateRetirement() {
    const desiredIncome = parseFloat(document.getElementById('desiredIncome').value) || 0;
    const currentAssets = parseFloat(document.getElementById('currentAssets').value) || 0;
    const yearsToRetirement = parseFloat(document.getElementById('yearsToRetirement').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const withdrawalRate = parseFloat(document.getElementById('withdrawalRate').value) || 0;
    
    if (desiredIncome <= 0 || currentAssets < 0 || yearsToRetirement <= 0 || interestRate < 0 || withdrawalRate <= 0) {
        alert('Please enter valid positive values.');
        return;
    }
    

    
    if (withdrawalRate > 8) {
        alert('Withdrawal rate cannot exceed 8%.');
        return;
    }
    
    // Calculate total amount needed for retirement
    const totalNeeded = desiredIncome / (withdrawalRate / 100);
    
    // Calculate future value of current assets
    const futureAssets = currentAssets * Math.pow(1 + interestRate / 100, yearsToRetirement);
    
    // Calculate additional amount needed
    const additionalNeeded = totalNeeded - futureAssets;
    
    // Calculate required monthly investment
    let monthlyInvestment = 0;
    if (additionalNeeded > 0) {
        const monthlyRate = interestRate / 100 / 12;
        const months = yearsToRetirement * 12;
        
        if (monthlyRate === 0) {
            monthlyInvestment = additionalNeeded / months;
        } else {
            monthlyInvestment = additionalNeeded / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
    }
    
    // Calculate total invested over time
    const totalInvested = monthlyInvestment * yearsToRetirement * 12;
    
    // Calculate investment growth
    const investmentGrowth = totalNeeded - totalInvested - currentAssets;
    
    // Display results
    document.getElementById('totalNeeded').textContent = formatCurrency(totalNeeded);
    document.getElementById('futureAssets').textContent = formatCurrency(futureAssets);
    document.getElementById('monthlyInvestment').textContent = formatCurrency(monthlyInvestment);
    document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
    document.getElementById('investmentGrowth').textContent = formatCurrency(investmentGrowth);
    
    // Update scenarios chart
    updateRetirementScenariosChart(desiredIncome, currentAssets, interestRate, withdrawalRate);
}

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Update retirement scenarios chart
function updateRetirementScenariosChart(desiredIncome, currentAssets, interestRate, withdrawalRate) {
    const ctx = document.getElementById('scenariosChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.retirementChart) {
        window.retirementChart.destroy();
    }

    const totalNeeded = desiredIncome / (withdrawalRate / 100);
    const monthlyRate = interestRate / 100 / 12;
    
    // Generate data for different time periods
    const years = Array.from({length: 30}, (_, i) => i + 1); // Years 1-30
    const monthlyInvestments = years.map(year => {
        const futureAssets = currentAssets * Math.pow(1 + interestRate / 100, year);
        const additionalNeeded = totalNeeded - futureAssets;
        
        if (additionalNeeded <= 0) return 0;
        
        const months = year * 12;
        if (monthlyRate === 0) {
            return additionalNeeded / months;
        } else {
            return additionalNeeded / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
    });

    window.retirementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years.map(year => `${year} years`),
            datasets: [{
                label: 'Monthly Investment Required',
                data: monthlyInvestments,
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Monthly Investment: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Initialize calculator with goals data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with goals data
    initializeRetirementCalculatorWithGoals();
    
    // Add input event listeners for real-time calculation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            setTimeout(function() {
                calculateRetirement();
            }, 100);
        });
    });
}); 