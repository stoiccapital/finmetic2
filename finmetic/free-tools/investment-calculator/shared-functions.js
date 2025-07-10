// Shared Functions for Investment Calculators

// Goals Integration - Load user's financial goals as default values
function loadGoalsAsDefaults() {
    const goalsData = localStorage.getItem('finmetic_goals');
    if (goalsData) {
        const goals = JSON.parse(goalsData);
        console.log('Loading goals data as defaults:', goals);
        return goals;
    }
    return null;
}

// Apply goals data to calculator inputs
function applyGoalsToInputs() {
    const goals = loadGoalsAsDefaults();
    if (!goals) {
        console.log('No goals data found, using default values');
        return;
    }

    // Map goals data to calculator inputs
    const inputMappings = {
        // Starting Amount - use current assets
        'ea-starting-amount': goals.currentAssets,
        'ac-starting-amount': goals.currentAssets,
        'sa-starting-amount': goals.currentAssets,
        'il-starting-amount': goals.currentAssets,
        'rr-starting-amount': goals.currentAssets,
        
        // Monthly Contribution - use monthly savings
        'ea-monthly-contribution': goals.monthlySavings,
        'ac-monthly-contribution': goals.monthlySavings,
        'sa-monthly-contribution': goals.monthlySavings,
        'il-monthly-contribution': goals.monthlySavings,
        'rr-monthly-contribution': goals.monthlySavings,
        
        // Return Rate - use compounding rate
        'ea-return-rate': goals.compoundingRate,
        'ac-return-rate': goals.compoundingRate,
        'sa-return-rate': goals.compoundingRate,
        'il-return-rate': goals.compoundingRate,
        
        // Target Amount - use target assets
        'ac-target-amount': goals.targetAssets,
        'sa-target-amount': goals.targetAssets,
        'rr-target-amount': goals.targetAssets,
        'il-target-amount': goals.targetAssets,
        
        // Years - calculate from target date
        'ea-years': Math.ceil(goals.monthsToTarget / 12),
        'ac-years': Math.ceil(goals.monthsToTarget / 12),
        'sa-years': Math.ceil(goals.monthsToTarget / 12),
        'il-years': Math.ceil(goals.monthsToTarget / 12),
        'rr-years': Math.ceil(goals.monthsToTarget / 12)
    };

    // Apply values to inputs
    Object.keys(inputMappings).forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && inputMappings[inputId] !== undefined) {
            input.value = inputMappings[inputId];
            console.log(`Set ${inputId} to ${inputMappings[inputId]}`);
        }
    });
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

// Format percentage for display
function formatPercentage(value, decimalPlaces = 2) {
    if (value === -1) {
        return 'Impossible';
    }
    
    if (isNaN(value) || !isFinite(value)) {
        return 'Error';
    }
    
    return value.toFixed(decimalPlaces) + '%';
}

// Format years for display
function formatYears(years) {
    if (isNaN(years) || !isFinite(years)) {
        return 'Error';
    }
    
    if (years < 0) {
        return 'Impossible';
    }
    
    if (years === 0) {
        return '0 years';
    }
    
    if (years < 1) {
        const months = Math.ceil(years * 12);
        return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const wholeYears = Math.floor(years);
    const remainingMonths = Math.ceil((years - wholeYears) * 12);
    
    if (remainingMonths === 0) {
        return `${wholeYears} year${wholeYears !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 12) {
        return `${wholeYears + 1} year${wholeYears + 1 !== 1 ? 's' : ''}`;
    } else {
        return `${wholeYears} year${wholeYears !== 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
}

// Calculate future value of investment
function calculateFutureValue(principal, monthlyContribution, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    if (monthlyRate === 0) {
        return principal + (monthlyContribution * months);
    }
    
    const futureValue = principal * Math.pow(1 + monthlyRate, months) +
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return futureValue;
}

// Calculate required monthly contribution
function calculateRequiredContribution(principal, targetAmount, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    if (monthlyRate === 0) {
        return (targetAmount - principal) / months;
    }
    
    const requiredContribution = (targetAmount - principal * Math.pow(1 + monthlyRate, months)) /
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return Math.max(0, requiredContribution);
}

// Calculate required starting amount
function calculateRequiredPrincipal(targetAmount, monthlyContribution, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // Check if target is impossible to reach with just contributions
    const totalContributions = monthlyContribution * months;
    if (totalContributions >= targetAmount) {
        return 0; // No starting amount needed
    }
    
    if (monthlyRate === 0) {
        return targetAmount - (monthlyContribution * months);
    }
    
    const requiredPrincipal = (targetAmount - monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)) /
        Math.pow(1 + monthlyRate, months);
    
    return Math.max(0, requiredPrincipal);
}

// Calculate required return rate (iterative approach)
function calculateRequiredRate(principal, targetAmount, monthlyContribution, years) {
    // Check if target is impossible to reach
    const totalContributions = monthlyContribution * years * 12;
    const totalWithoutInterest = principal + totalContributions;
    
    if (totalWithoutInterest >= targetAmount) {
        return 0; // No interest needed
    }
    
    // Check if even 100% return rate can't reach the target
    const maxPossibleAmount = calculateFutureValue(principal, monthlyContribution, 100, years);
    
    if (maxPossibleAmount < targetAmount) {
        return -1; // Impossible to reach
    }
    
    // Use a more robust binary search
    let low = 0;
    let high = 100;
    let bestRate = 0;
    let bestDiff = Infinity;
    
    for (let i = 0; i < 50; i++) {
        const mid = (low + high) / 2;
        const calculatedAmount = calculateFutureValue(principal, monthlyContribution, mid, years);
        const diff = Math.abs(calculatedAmount - targetAmount);
        
        if (diff < bestDiff) {
            bestDiff = diff;
            bestRate = mid;
        }
        
        if (Math.abs(calculatedAmount - targetAmount) < 0.01) {
            return mid;
        }
        
        if (calculatedAmount < targetAmount) {
            low = mid;
        } else {
            high = mid;
        }
    }
    
    return bestRate;
}

// Calculate required years
function calculateRequiredYears(principal, targetAmount, monthlyContribution, annualRate) {
    // Check if target is already reached
    if (principal >= targetAmount) {
        return 0;
    }
    
    // Check if target is impossible to reach with just contributions
    const totalContributions = monthlyContribution * 12; // Annual contributions
    if (monthlyContribution === 0) {
        if (principal >= targetAmount) {
            return 0;
        } else {
            return -1; // Impossible without contributions
        }
    }
    
    const monthlyRate = annualRate / 100 / 12;
    
    if (monthlyRate === 0) {
        const years = (targetAmount - principal) / monthlyContribution / 12;
        return years > 0 ? years : -1;
    }
    
    // Use iterative approach for more accuracy
    let low = 0;
    let high = 100; // Max 100 years
    let bestYears = -1;
    let bestDiff = Infinity;
    
    for (let i = 0; i < 50; i++) {
        const mid = (low + high) / 2;
        const calculatedAmount = calculateFutureValue(principal, monthlyContribution, annualRate, mid);
        const diff = Math.abs(calculatedAmount - targetAmount);
        
        if (diff < bestDiff) {
            bestDiff = diff;
            bestYears = mid;
        }
        
        if (Math.abs(calculatedAmount - targetAmount) < 0.01) {
            return mid;
        }
        
        if (calculatedAmount < targetAmount) {
            low = mid;
        } else {
            high = mid;
        }
    }
    
    return bestYears;
}

// Update balance chart
function updateBalanceChart(startingAmount, totalContributions, totalInterest) {
    const ctx = document.getElementById('balanceChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.balanceChart) {
        window.balanceChart.destroy();
    }

    window.balanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Starting Amount', 'Total Contributions', 'Total Interest'],
            datasets: [{
                data: [startingAmount, totalContributions, totalInterest],
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Generate yearly breakdown table
function generateYearlyBreakdown(principal, monthlyContribution, annualRate, years) {
    const tbody = document.getElementById('breakdown-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    let currentBalance = principal;
    const monthlyRate = annualRate / 100 / 12;
    const totalYears = Math.ceil(years); // Round up to show complete years
    
    for (let year = 1; year <= totalYears; year++) {
        const startingBalance = currentBalance;
        const annualContributions = monthlyContribution * 12;
        
        // Calculate interest for the year
        let interestEarned = 0;
        const monthsThisYear = year <= Math.floor(years) ? 12 : Math.ceil((years - Math.floor(years)) * 12);
        
        for (let month = 1; month <= monthsThisYear; month++) {
            const monthlyInterest = currentBalance * monthlyRate;
            interestEarned += monthlyInterest;
            currentBalance += monthlyInterest + monthlyContribution;
        }
        
        const endingBalance = currentBalance;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${year}</td>
            <td>${formatCurrency(startingBalance)}</td>
            <td>${formatCurrency(annualContributions)}</td>
            <td>${formatCurrency(interestEarned)}</td>
            <td>${formatCurrency(endingBalance)}</td>
        `;
        tbody.appendChild(row);
    }
}

// Show only relevant results for each calculator mode
function showOnlyRelevantResults(mode) {
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        card.style.display = 'block';
    });
}

// Initialize calculator with goals data
function initializeCalculatorWithGoals() {
    console.log('Initializing calculator with goals data...');
    applyGoalsToInputs();
    
    // Auto-calculate after a short delay to ensure inputs are set
    setTimeout(() => {
        // Trigger calculation based on current page
        const currentPage = window.location.pathname;
        if (currentPage.includes('end-amount-calculator')) {
            if (typeof calculateEndAmount === 'function') {
                calculateEndAmount();
            }
        } else if (currentPage.includes('additional-contribution-calculator')) {
            if (typeof calculateAdditionalContribution === 'function') {
                calculateAdditionalContribution();
            }
        } else if (currentPage.includes('starting-amount-calculator')) {
            if (typeof calculateStartingAmount === 'function') {
                calculateStartingAmount();
            }
        } else if (currentPage.includes('return-rate-calculator')) {
            if (typeof calculateReturnRate === 'function') {
                calculateReturnRate();
            }
        } else if (currentPage.includes('investment-length-calculator')) {
            if (typeof calculateInvestmentLength === 'function') {
                calculateInvestmentLength();
            }
        }
    }, 200);
} 