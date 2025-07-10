// Strategy Comparison JavaScript

function calculateStrategies() {
    // Get input values
    const desiredIncome = parseFloat(document.getElementById('desiredIncome').value) || 0;
    const compoundingRate = parseFloat(document.getElementById('compoundingRate').value) / 100 || 0;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100 || 0;
    const withdrawalRate = parseFloat(document.getElementById('withdrawalRate').value) / 100 || 0;
    const borrowingRate = parseFloat(document.getElementById('borrowingRate').value) / 100 || 0;
    const yearsToProject = parseInt(document.getElementById('yearsToProject').value) || 30;
    
    // Calculate required assets for each strategy
    const annualIncome = desiredIncome * 12;
    
    // 1. Income from Assets (dividend strategy)
    const dividendAssets = annualIncome / dividendYield;
    
    // 2. Asset Depletion (4% rule equivalent)
    const depletionAssets = annualIncome / withdrawalRate;
    
    // 3. Buy, Borrow, Die (using borrowing rate as LTV ratio)
    const ltvRatio = borrowingRate; // Use borrowing rate as LTV ratio
    const bbdAssets = annualIncome / ltvRatio;
    
    // Update results
    document.getElementById('dividendAssets').textContent = formatCurrency(dividendAssets);
    document.getElementById('depletionAssets').textContent = formatCurrency(depletionAssets);
    document.getElementById('bbdAssets').textContent = formatCurrency(bbdAssets);
    
    // Determine best strategy (lowest initial capital)
    const strategies = [
        { name: 'Income from Assets', assets: dividendAssets },
        { name: 'Asset Depletion', assets: depletionAssets },
        { name: 'Buy, Borrow, Die', assets: bbdAssets }
    ];
    
    const bestStrategy = strategies.reduce((min, strategy) => 
        strategy.assets < min.assets ? strategy : min
    );
    
    document.getElementById('bestStrategy').textContent = bestStrategy.name;
    
    // Generate charts
    generateAssetValueChart(desiredIncome, compoundingRate, dividendYield, withdrawalRate, borrowingRate, yearsToProject);
    generateNetWorthChart(desiredIncome, compoundingRate, dividendYield, withdrawalRate, borrowingRate, yearsToProject);
    generateIncomeChart(desiredIncome, compoundingRate, dividendYield, withdrawalRate, borrowingRate, yearsToProject);
}

function generateAssetValueChart(desiredIncome, compoundingRate, dividendYield, withdrawalRate, borrowingRate, yearsToProject) {
    const ctx = document.getElementById('assetValueChart');
    
    // Clear existing chart
    if (window.assetValueChartInstance) {
        window.assetValueChartInstance.destroy();
    }
    
    // Generate data points
    const yearLabels = [];
    const dividendValues = [];
    const depletionValues = [];
    const bbdValues = [];
    
    const annualIncome = desiredIncome * 12;
    const dividendAssets = annualIncome / dividendYield;
    const depletionAssets = annualIncome / withdrawalRate;
    const ltvRatio = borrowingRate;
    const bbdAssets = annualIncome / ltvRatio;
    
    for (let year = 0; year <= yearsToProject; year++) {
        yearLabels.push(year);
        
        // Dividend strategy: assets grow at reduced rate (growth rate - dividend yield)
        const adjustedGrowthRate = compoundingRate - dividendYield;
        const dividendValue = dividendAssets * Math.pow(1 + adjustedGrowthRate, year);
        dividendValues.push(dividendValue);
        
        // Depletion strategy: assets grow but withdrawals reduce them
        let depletionValue = depletionAssets;
        for (let y = 0; y < year; y++) {
            depletionValue = depletionValue * (1 + compoundingRate) - annualIncome;
        }
        depletionValues.push(Math.max(0, depletionValue));
        
        // Buy, Borrow, Die: assets grow, debt grows
        const bbdValue = bbdAssets * Math.pow(1 + compoundingRate, year);
        bbdValues.push(bbdValue);
    }
    
    // Create chart
    window.assetValueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearLabels,
            datasets: [
                {
                    label: 'Income from Assets',
                    data: dividendValues,
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#000000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Asset Depletion',
                    data: depletionValues,
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#FF0000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                },
                {
                    label: 'Buy, Borrow, Die',
                    data: bbdValues,
                    borderColor: '#0066CC',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#0066CC',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [10, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: '#333',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return `Year ${context[0].dataIndex}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            return `${label}: ${formatCurrency(value)}`;
                        },
                        afterBody: function(context) {
                            // Sort the data points by value (highest to lowest)
                            const sortedData = context
                                .map(item => ({
                                    label: item.dataset.label,
                                    value: item.parsed.y,
                                    color: item.dataset.borderColor
                                }))
                                .sort((a, b) => b.value - a.value);
                            
                            // Create ordered list
                            const orderText = sortedData
                                .map((item, index) => `${index + 1}. ${item.label}`)
                                .join('\n');
                            
                            return `\nOrder (highest to lowest):\n${orderText}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 20,
                        callback: function(value, index) {
                            // Show every 5th year for better readability
                            if (index % 5 === 0 || index === 0 || index === yearsToProject) {
                                return index;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Asset Value ($)',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return formatCompactCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function generateNetWorthChart(desiredIncome, compoundingRate, dividendYield, withdrawalRate, borrowingRate, yearsToProject) {
    const ctx = document.getElementById('netWorthChart');
    
    // Clear existing chart
    if (window.netWorthChartInstance) {
        window.netWorthChartInstance.destroy();
    }
    
    // Generate data points
    const yearLabels = [];
    const dividendNetWorth = [];
    const depletionNetWorth = [];
    const bbdNetWorth = [];
    
    const annualIncome = desiredIncome * 12;
    const dividendAssets = annualIncome / dividendYield;
    const depletionAssets = annualIncome / withdrawalRate;
    const ltvRatio = borrowingRate;
    const bbdAssets = annualIncome / ltvRatio;
    
    for (let year = 0; year <= yearsToProject; year++) {
        yearLabels.push(year);
        
        // Dividend strategy: net worth = assets (no debt), adjusted growth rate
        const adjustedGrowthRate = compoundingRate - dividendYield;
        const dividendValue = dividendAssets * Math.pow(1 + adjustedGrowthRate, year);
        dividendNetWorth.push(dividendValue);
        
        // Depletion strategy: net worth = remaining assets
        let depletionValue = depletionAssets;
        for (let y = 0; y < year; y++) {
            const yearlyWithdrawal = depletionValue * withdrawalRate;
            depletionValue = depletionValue * (1 + compoundingRate) - yearlyWithdrawal;
        }
        depletionNetWorth.push(Math.max(0, depletionValue));
        
        // Buy, Borrow, Die: net worth = assets - debt
        const bbdAssetValue = bbdAssets * Math.pow(1 + compoundingRate, year);
        const debtAmount = bbdAssets * ltvRatio; // Fixed debt amount (initial loan)
        const bbdNetWorthValue = bbdAssetValue - debtAmount;
        bbdNetWorth.push(Math.max(0, bbdNetWorthValue));
    }
    
    // Create chart
    window.netWorthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearLabels,
            datasets: [
                {
                    label: 'Income from Assets',
                    data: dividendNetWorth,
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#000000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Asset Depletion',
                    data: depletionNetWorth,
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#FF0000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                },
                {
                    label: 'Buy, Borrow, Die',
                    data: bbdNetWorth,
                    borderColor: '#0066CC',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#0066CC',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [10, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: '#333',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return `Year ${context[0].dataIndex}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            return `${label}: ${formatCurrency(value)}`;
                        },
                        afterBody: function(context) {
                            // Sort the data points by value (highest to lowest)
                            const sortedData = context
                                .map(item => ({
                                    label: item.dataset.label,
                                    value: item.parsed.y,
                                    color: item.dataset.borderColor
                                }))
                                .sort((a, b) => b.value - a.value);
                            
                            // Create ordered list
                            const orderText = sortedData
                                .map((item, index) => `${index + 1}. ${item.label}`)
                                .join('\n');
                            
                            return `\nOrder (highest to lowest):\n${orderText}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 20,
                        callback: function(value, index) {
                            // Show every 5th year for better readability
                            if (index % 5 === 0 || index === 0 || index === yearsToProject) {
                                return index;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Net Worth ($)',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return formatCompactCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function generateIncomeChart(desiredIncome, compoundingRate, dividendYield, withdrawalRate, borrowingRate, yearsToProject) {
    const ctx = document.getElementById('incomeChart');
    
    // Clear existing chart
    if (window.incomeChartInstance) {
        window.incomeChartInstance.destroy();
    }
    
    // Generate data points
    const yearLabels = [];
    const dividendIncome = [];
    const depletionIncome = [];
    const bbdIncome = [];
    
    const annualIncome = desiredIncome * 12;
    const dividendAssets = annualIncome / dividendYield;
    const depletionAssets = annualIncome / withdrawalRate;
    const ltvRatio = borrowingRate;
    const bbdAssets = annualIncome / ltvRatio;
    
    for (let year = 0; year <= yearsToProject; year++) {
        yearLabels.push(year);
        
        // Dividend strategy: income grows with adjusted asset growth
        const adjustedGrowthRate = compoundingRate - dividendYield;
        const dividendValue = dividendAssets * Math.pow(1 + adjustedGrowthRate, year);
        const dividendIncomeValue = dividendValue * dividendYield;
        dividendIncome.push(dividendIncomeValue / 12); // Convert to monthly
        
        // Depletion strategy: income based on withdrawal rate percentage of current assets
        let depletionValue = depletionAssets;
        for (let y = 0; y < year; y++) {
            const yearlyWithdrawal = depletionValue * withdrawalRate;
            depletionValue = depletionValue * (1 + compoundingRate) - yearlyWithdrawal;
        }
        const depletionIncomeValue = depletionValue > 0 ? depletionValue * withdrawalRate : 0;
        depletionIncome.push(depletionIncomeValue / 12); // Convert to monthly
        
        // Buy, Borrow, Die: income from dividends on remaining equity
        const bbdAssetValue = bbdAssets * Math.pow(1 + compoundingRate, year);
        const debtAmount = bbdAssets * ltvRatio; // Fixed debt amount (initial loan)
        const equityValue = Math.max(0, bbdAssetValue - debtAmount);
        const bbdIncomeValue = equityValue * dividendYield;
        bbdIncome.push(bbdIncomeValue / 12); // Convert to monthly
    }
    
    // Create chart
    window.incomeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearLabels,
            datasets: [
                {
                    label: 'Income from Assets',
                    data: dividendIncome,
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#000000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Asset Depletion',
                    data: depletionIncome,
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#FF0000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                },
                {
                    label: 'Buy, Borrow, Die',
                    data: bbdIncome,
                    borderColor: '#0066CC',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#0066CC',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [10, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: '#333',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return `Year ${context[0].dataIndex}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            return `${label}: ${formatCurrency(value)}/month`;
                        },
                        afterBody: function(context) {
                            // Sort the data points by value (highest to lowest)
                            const sortedData = context
                                .map(item => ({
                                    label: item.dataset.label,
                                    value: item.parsed.y,
                                    color: item.dataset.borderColor
                                }))
                                .sort((a, b) => b.value - a.value);
                            
                            // Create ordered list
                            const orderText = sortedData
                                .map((item, index) => `${index + 1}. ${item.label}`)
                                .join('\n');
                            
                            return `\nOrder (highest to lowest):\n${orderText}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 20,
                        callback: function(value, index) {
                            // Show every 5th year for better readability
                            if (index % 5 === 0 || index === 0 || index === yearsToProject) {
                                return index;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Monthly Income ($)',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return formatCompactCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatCompactCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(0) + 'k';
    } else {
        return '$' + amount.toFixed(0);
    }
}

// Auto-calculate when inputs change
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['desiredIncome', 'compoundingRate', 'dividendYield', 'withdrawalRate', 'borrowingRate', 'yearsToProject'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateStrategies);
        }
    });
    
    // Initial calculation
    calculateStrategies();
}); 