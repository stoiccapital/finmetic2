// Asset Depletion Calculator JavaScript

function calculateDepletion() {
    // Get input values
    const desiredMonthlyIncome = parseFloat(document.getElementById('desiredMonthlyIncome').value) || 0;
    const monthlyWithdrawalRate = parseFloat(document.getElementById('monthlyWithdrawalRate').value) / 100 || 0;
    const annualReturn = parseFloat(document.getElementById('annualReturn').value) / 100 || 0;
    const yearsToCalculate = parseInt(document.getElementById('yearsToCalculate').value) || 30;
    
    // Calculate results
    const annualWithdrawalRatePercent = monthlyWithdrawalRate * 12 * 100;
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
    
    // Calculate initial assets needed using the formula for systematic withdrawals
    let initialAssets = 0;
    if (monthlyWithdrawalRate > 0) {
        // If withdrawal rate is greater than return rate, assets will deplete
        if (monthlyWithdrawalRate > monthlyReturn) {
            // Calculate how long assets will last
            const monthsToDeplete = Math.log(desiredMonthlyIncome / (desiredMonthlyIncome - initialAssets * monthlyWithdrawalRate)) / Math.log(1 + monthlyReturn - monthlyWithdrawalRate);
            // For desired income, calculate required initial assets
            initialAssets = desiredMonthlyIncome / monthlyWithdrawalRate;
        } else {
            // Assets can sustain indefinitely if withdrawal rate is less than return rate
            initialAssets = desiredMonthlyIncome / monthlyWithdrawalRate;
        }
    }
    
    // Calculate final assets after the specified years
    let finalAssets = initialAssets;
    for (let year = 0; year < yearsToCalculate; year++) {
        for (let month = 0; month < 12; month++) {
            finalAssets = finalAssets * (1 + monthlyReturn) - desiredMonthlyIncome;
        }
    }
    
    // Ensure final assets doesn't go below zero
    finalAssets = Math.max(0, finalAssets);
    
    // Update results
    document.getElementById('initialAssets').textContent = formatCurrency(initialAssets);
    document.getElementById('annualWithdrawalRate').textContent = annualWithdrawalRatePercent.toFixed(1) + '%';
    document.getElementById('monthlyWithdrawal').textContent = formatCurrency(desiredMonthlyIncome);
    document.getElementById('finalAssets').textContent = formatCurrency(finalAssets);
    
    // Generate chart
    generateWithdrawalChart(desiredMonthlyIncome, annualReturn, yearsToCalculate);
}

function generateWithdrawalChart(desiredMonthlyIncome, annualReturn, yearsToCalculate) {
    const ctx = document.getElementById('withdrawalChart');
    
    // Clear existing chart
    if (window.withdrawalChartInstance) {
        window.withdrawalChartInstance.destroy();
    }
    
    // Generate data points
    const annualRates = [];
    const initialAssets = [];
    const finalAssets = [];
    const labels = [];
    
    // Create more granular data points for smoother curves
    for (let annualRate = 2; annualRate <= 24; annualRate += 0.5) {
        const monthlyRate = annualRate / 12 / 100;
        const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
        
        // Calculate initial assets needed
        let initialAsset = 0;
        if (monthlyRate > 0) {
            initialAsset = desiredMonthlyIncome / monthlyRate;
        }
        
        // Calculate final assets
        let finalAsset = initialAsset;
        for (let year = 0; year < yearsToCalculate; year++) {
            for (let month = 0; month < 12; month++) {
                finalAsset = finalAsset * (1 + monthlyReturn) - desiredMonthlyIncome;
            }
        }
        finalAsset = Math.max(0, finalAsset);
        
        annualRates.push(annualRate);
        initialAssets.push(initialAsset);
        finalAssets.push(finalAsset);
        labels.push(`${annualRate}%`);
    }
    
    // Create chart
    window.withdrawalChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Initial Assets Needed',
                    data: initialAssets,
                    borderColor: '#000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#000',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Final Assets',
                    data: finalAssets,
                    borderColor: '#666',
                    backgroundColor: 'rgba(102, 102, 102, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#666',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
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
                            return `Annual Withdrawal Rate: ${context[0].label}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Annual Withdrawal Rate (%)',
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
                        maxTicksLimit: 12
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Assets ($)',
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
    const inputs = ['desiredMonthlyIncome', 'monthlyWithdrawalRate', 'annualReturn', 'yearsToCalculate'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateDepletion);
        }
    });
    
    // Initial calculation
    calculateDepletion();
}); 