// Income from Assets Calculator JavaScript

function calculateAssets() {
    // Get input values
    const desiredMonthlyIncome = parseFloat(document.getElementById('desiredMonthlyIncome').value) || 0;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100 || 0;
    
    // Calculate results
    const annualIncome = desiredMonthlyIncome * 12;
    const totalAssets = dividendYield > 0 ? annualIncome / dividendYield : 0;
    const monthlyDividends = totalAssets * dividendYield / 12;
    const incomePerThousand = dividendYield > 0 ? (1000 * dividendYield / 12) : 0;
    
    // Update results
    document.getElementById('totalAssets').textContent = formatCurrency(totalAssets);
    document.getElementById('annualIncome').textContent = formatCurrency(annualIncome);
    document.getElementById('monthlyDividends').textContent = formatCurrency(monthlyDividends);
    document.getElementById('incomePerThousand').textContent = formatCurrency(incomePerThousand);
    
    // Generate chart
    generateYieldChart(desiredMonthlyIncome);
}

function generateYieldChart(desiredMonthlyIncome) {
    const ctx = document.getElementById('yieldChart');
    
    // Clear existing chart
    if (window.yieldChartInstance) {
        window.yieldChartInstance.destroy();
    }
    
    // Generate data points
    const yields = [];
    const assetsNeeded = [];
    const labels = [];
    
    // Create more granular data points for smoother curve
    for (let yield = 1; yield <= 15; yield += 0.5) {
        const annualIncome = desiredMonthlyIncome * 12;
        const assets = annualIncome / (yield / 100);
        
        yields.push(yield);
        assetsNeeded.push(assets);
        labels.push(`${yield}%`);
    }
    
    // Create chart
    window.yieldChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Assets Needed',
                data: assetsNeeded,
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#000',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
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
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        title: function(context) {
                            return `Dividend Yield: ${context[0].label}`;
                        },
                        label: function(context) {
                            return `Assets Needed: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Dividend Yield (%)',
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
                        maxTicksLimit: 8
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Assets Needed ($)',
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
    const inputs = ['desiredMonthlyIncome', 'dividendYield'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateAssets);
        }
    });
    
    // Initial calculation
    calculateAssets();
}); 