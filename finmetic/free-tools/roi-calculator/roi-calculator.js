// ROI Calculator JavaScript

function calculateROI() {
    // Get input values
    const startingCapital = parseFloat(document.getElementById('startingCapital').value) || 0;
    const monthlySavings = parseFloat(document.getElementById('monthlySavings').value) || 0;
    const compoundingRate = parseFloat(document.getElementById('compoundingRate').value) / 100 || 0;
    const years = parseInt(document.getElementById('years').value) || 0;
    const leverage = parseFloat(document.getElementById('leverage').value) || 1;
    const roiThreshold = parseFloat(document.getElementById('roiThreshold').value) || 0;
    
    // Calculate leveraged investment amount
    const leveragedCapital = startingCapital * leverage;
    
    // Calculate final value with compounding and monthly savings (future value of annuity)
    const months = years * 12;
    const monthlyRate = Math.pow(1 + compoundingRate, 1/12) - 1;
    let fvSavings = 0;
    if (monthlyRate > 0) {
        fvSavings = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
        fvSavings = monthlySavings * months;
    }
    const finalValue = leveragedCapital * Math.pow(1 + compoundingRate, years) + fvSavings * leverage;
    
    // Calculate total return
    const totalReturn = finalValue - startingCapital - (monthlySavings * months);
    
    // Calculate ROI percentage
    const roiPercentage = (startingCapital + monthlySavings * months) > 0 ? (totalReturn / (startingCapital + monthlySavings * months)) * 100 : 0;
    
    // Calculate annualized return
    const totalInvested = startingCapital + monthlySavings * months;
    const annualizedReturn = totalInvested > 0 ? (Math.pow(finalValue / totalInvested, 1 / years) - 1) * 100 : 0;
    
    // Calculate leverage impact (additional value from leverage)
    const unleveragedValue = startingCapital * Math.pow(1 + compoundingRate, years) + fvSavings;
    const leverageImpact = finalValue - unleveragedValue;
    
    // Update results
    document.getElementById('finalValue').textContent = formatCurrency(finalValue);
    document.getElementById('totalReturn').textContent = formatCurrency(totalReturn);
    document.getElementById('roiPercentage').textContent = roiPercentage.toFixed(2) + '%';
    document.getElementById('annualizedReturn').textContent = annualizedReturn.toFixed(2) + '%';
    document.getElementById('leverageImpact').textContent = formatCurrency(leverageImpact);
    
    // ROI Threshold logic for Monthly Savings Only
    let warning = '';
    if (monthlySavings > 0) {
        for (let year = 1; year <= years; year++) {
            const months = year * 12;
            let fvSavingsOnly = 0;
            if (monthlyRate > 0) {
                fvSavingsOnly = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            } else {
                fvSavingsOnly = monthlySavings * months;
            }
            const totalInvested = monthlySavings * months;
            const annualized = totalInvested > 0 ? (Math.pow(fvSavingsOnly / totalInvested, 1 / year) - 1) * 100 : 0;
            if (annualized < roiThreshold) {
                warning = `After year ${year}, your ROI falls below ${roiThreshold}% for monthly investments.`;
                break;
            }
        }
    }
    document.getElementById('roiWarning').textContent = warning;
    
    // Generate charts
    generateGrowthChart(startingCapital, monthlySavings, compoundingRate, years, leverage);
    generateLeverageChart(startingCapital, monthlySavings, compoundingRate, years);
}

function generateGrowthChart(startingCapital, monthlySavings, compoundingRate, years, leverage) {
    const ctx = document.getElementById('growthChart');
    
    // Clear existing chart
    if (window.growthChartInstance) {
        window.growthChartInstance.destroy();
    }
    
    // Generate data points
    const yearLabels = [];
    const leveragedValues = [];
    const unleveragedValues = [];
    const startingCapitalOnly = [];
    const monthlySavingsOnly = [];
    
    for (let year = 0; year <= years; year++) {
        yearLabels.push(`Year ${year}`);
        const months = year * 12;
        const monthlyRate = Math.pow(1 + compoundingRate, 1/12) - 1;
        let fvSavings = 0;
        if (monthlyRate > 0) {
            fvSavings = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            fvSavings = monthlySavings * months;
        }
        const leveragedValue = (startingCapital * leverage) * Math.pow(1 + compoundingRate, year) + fvSavings * leverage;
        const unleveragedValue = startingCapital * Math.pow(1 + compoundingRate, year) + fvSavings;
        // New: Only starting capital, no monthly savings, no leverage
        const startOnly = startingCapital * Math.pow(1 + compoundingRate, year);
        // New: Only monthly savings, no starting capital, no leverage
        let fvSavingsOnly = 0;
        if (monthlyRate > 0) {
            fvSavingsOnly = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            fvSavingsOnly = monthlySavings * months;
        }
        startingCapitalOnly.push(startOnly);
        monthlySavingsOnly.push(fvSavingsOnly);
        leveragedValues.push(leveragedValue);
        unleveragedValues.push(unleveragedValue);
    }
    
    // Create chart
    window.growthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearLabels,
            datasets: [
                {
                    label: 'With Leverage',
                    data: leveragedValues,
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
                    label: 'Without Leverage',
                    data: unleveragedValues,
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
                },
                {
                    label: 'Starting Capital Only',
                    data: startingCapitalOnly,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#dc3545',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderDash: [2, 2]
                },
                {
                    label: 'Monthly Savings Only',
                    data: monthlySavingsOnly,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderDash: [8, 4]
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
                            return context[0].label;
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
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Portfolio Value ($)',
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

function generateLeverageChart(startingCapital, monthlySavings, compoundingRate, years) {
    const ctx = document.getElementById('leverageChart');
    
    // Clear existing chart
    if (window.leverageChartInstance) {
        window.leverageChartInstance.destroy();
    }
    
    // Generate data points
    const leverageLevels = [];
    const finalValues = [];
    const labels = [];
    
    for (let leverage = 1; leverage <= 5; leverage += 0.5) {
        const leveragedCapital = startingCapital * leverage;
        const months = years * 12;
        const monthlyRate = Math.pow(1 + compoundingRate, 1/12) - 1;
        let fvSavings = 0;
        if (monthlyRate > 0) {
            fvSavings = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            fvSavings = monthlySavings * months;
        }
        const finalValue = leveragedCapital * Math.pow(1 + compoundingRate, years) + fvSavings * leverage;
        leverageLevels.push(leverage.toFixed(1) + 'x');
        finalValues.push(finalValue);
        labels.push(leverage.toFixed(1) + 'x');
    }
    
    // Create chart
    window.leverageChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Final Portfolio Value',
                data: finalValues,
                backgroundColor: '#0066cc',
                borderColor: '#0066cc',
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: '#004080',
                hoverBorderColor: '#004080',
                maxBarThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
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
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            return `Final Value: ${formatCurrency(value)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Leverage',
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
                        color: '#666'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Portfolio Value ($)',
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
    const inputs = ['startingCapital', 'monthlySavings', 'compoundingRate', 'years', 'leverage'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateROI);
        }
    });
    
    // Initial calculation
    calculateROI();
}); 