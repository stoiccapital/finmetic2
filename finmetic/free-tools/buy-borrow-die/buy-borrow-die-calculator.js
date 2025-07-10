// Buy, Borrow, Die Strategy Calculator JavaScript

function calculateBBDS() {
    // Get input values
    const assetValue = parseFloat(document.getElementById('assetValue').value) || 0;
    const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100 || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 || 0;
    const assetGrowthRate = parseFloat(document.getElementById('assetGrowthRate').value) / 100 || 0;
    const desiredMonthlyIncome = parseFloat(document.getElementById('desiredMonthlyIncome').value) || 0;
    const yearsToProject = parseInt(document.getElementById('yearsToProject').value) || 30;
    
    // Calculate results
    const maxLoanAmount = assetValue * loanToValue;
    const monthlyInterestRate = Math.pow(1 + interestRate, 1/12) - 1;
    const monthlyInterestPayment = maxLoanAmount * monthlyInterestRate;
    const netMonthlyIncome = maxLoanAmount - monthlyInterestPayment;
    
    // Calculate future asset value (assuming no principal payments)
    const futureAssetValue = assetValue * Math.pow(1 + assetGrowthRate, yearsToProject);
    const futureLTV = (maxLoanAmount / futureAssetValue) * 100;
    
    // Update results
    document.getElementById('maxLoanAmount').textContent = formatCurrency(maxLoanAmount);
    document.getElementById('monthlyInterest').textContent = formatCurrency(monthlyInterestPayment);
    document.getElementById('netMonthlyIncome').textContent = formatCurrency(netMonthlyIncome);
    document.getElementById('futureAssetValue').textContent = formatCurrency(futureAssetValue);
    document.getElementById('futureLTV').textContent = futureLTV.toFixed(1) + '%';
    
    // Update dynamic titles based on years to project
    document.querySelector('#futureAssetValue').parentElement.querySelector('.result-title').textContent = `Asset Value After ${yearsToProject} Years`;
    document.querySelector('#futureLTV').parentElement.querySelector('.result-title').textContent = `Loan-to-Value After ${yearsToProject} Years`;
    
    // Generate 50-year asset growth chart
    generateAssetGrowthChart(assetValue, assetGrowthRate, desiredMonthlyIncome, interestRate);
}

function generateAssetGrowthChart(assetValue, assetGrowthRate, desiredMonthlyIncome, interestRate) {
    const ctx = document.getElementById('assetGrowthChart');
    
    // Clear existing chart
    if (window.assetGrowthChartInstance) {
        window.assetGrowthChartInstance.destroy();
    }
    
    // Generate data points for 50 years
    const years = [];
    const assetValues = [];
    const netWorth = [];
    const loanAmounts = [];
    const ltvRatios = [];
    
    let currentLoanBalance = 0;
    const annualWithdrawal = desiredMonthlyIncome * 12;
    
    for (let year = 0; year <= 50; year++) {
        years.push(year);
        
        // Asset value grows over time
        const currentAssetValue = assetValue * Math.pow(1 + assetGrowthRate, year);
        assetValues.push(currentAssetValue);
        
        // Loan balance grows by annual withdrawal plus interest on the growing balance
        if (year > 0) {
            currentLoanBalance = currentLoanBalance + annualWithdrawal + (currentLoanBalance * interestRate);
        }
        loanAmounts.push(currentLoanBalance);
        
        // Net worth = asset value - loan amount
        const currentNetWorth = currentAssetValue - currentLoanBalance;
        netWorth.push(currentNetWorth);
        
        // LTV ratio = current loan amount / current asset value
        const currentLTV = currentAssetValue > 0 ? (currentLoanBalance / currentAssetValue) * 100 : 0;
        ltvRatios.push(currentLTV);
    }
    
    // Dynamic point coloring for LTV Ratio
    const ltvPointColors = ltvRatios.map(lv => {
        if (lv < 30) return 'green';
        if (lv < 50) return 'goldenrod';
        return 'red';
    });
    
    // Create chart
    window.assetGrowthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Asset Value',
                data: assetValues,
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#000',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y'
            }, {
                label: 'Net Worth',
                data: netWorth,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#dc3545',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y'
            }, {
                label: 'Loan Amount',
                data: loanAmounts,
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#0066cc',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y'
            }, {
                label: 'LTV Ratio',
                data: ltvRatios,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: ltvPointColors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y1'
            }]
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
                        font: {
                            size: 14,
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
                            if (context.dataset.label === 'LTV Ratio') {
                                return `LTV Ratio: ${value.toFixed(1)}%`;
                            } else {
                                return `${context.dataset.label}: ${formatCurrency(value)}`;
                            }
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
                            if (index % 5 === 0 || index === 0 || index === 50) {
                                return index;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Value ($)',
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
                        },
                        min: 0,
                        suggestedMax: Math.max(...assetValues, ...loanAmounts, ...netWorth, 1)
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'LTV Ratio (%)',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return value.toFixed(0) + '%';
                        },
                        min: 0,
                        suggestedMax: Math.max(...ltvRatios, 1)
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
    const inputs = ['assetValue', 'loanToValue', 'interestRate', 'assetGrowthRate', 'desiredMonthlyIncome', 'yearsToProject'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateBBDS);
        }
    });
    
    // Initial calculation
    calculateBBDS();
}); 