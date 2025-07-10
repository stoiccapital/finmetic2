// Investment Length Calculator Module
// Calculates the time required to reach a target amount

// Investment Length Calculator
function calculateInvestmentLength() {
    const startingAmount = parseFloat(document.getElementById('il-starting-amount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('il-monthly-contribution').value) || 0;
    const targetAmount = parseFloat(document.getElementById('il-target-amount').value) || 0;
    const returnRate = parseFloat(document.getElementById('il-return-rate').value) || 0;
    
    if (startingAmount < 0 || monthlyContribution < 0 || targetAmount < 0 || returnRate < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    
    const timeToTarget = calculateRequiredYears(startingAmount, targetAmount, monthlyContribution, returnRate);
    
    if (timeToTarget < 0) {
        document.getElementById('il-result-value').textContent = 'Target amount is impossible to reach with these parameters.';
        document.getElementById('il-end-amount-value').textContent = '$0';
        document.getElementById('il-starting-amount-value').textContent = '$0';
        document.getElementById('il-total-contributions-value').textContent = '$0';
        document.getElementById('il-total-interest-value').textContent = '$0';
    } else if (timeToTarget > 100) {
        document.getElementById('il-result-value').textContent = 'It will take more than 100 years to reach the target.';
        document.getElementById('il-end-amount-value').textContent = formatCurrency(targetAmount);
        document.getElementById('il-starting-amount-value').textContent = formatCurrency(startingAmount);
        document.getElementById('il-total-contributions-value').textContent = formatCurrency(monthlyContribution * 100 * 12);
        document.getElementById('il-total-interest-value').textContent = formatCurrency(0);
    } else {
        document.getElementById('il-result-value').textContent = formatYears(timeToTarget);
        
        // Calculate and display all result values
        const totalContributions = monthlyContribution * timeToTarget * 12;
        const endAmount = calculateFutureValue(startingAmount, monthlyContribution, returnRate, timeToTarget);
        const totalInterest = endAmount - startingAmount - totalContributions;
        
        document.getElementById('il-end-amount-value').textContent = formatCurrency(targetAmount);
        document.getElementById('il-starting-amount-value').textContent = formatCurrency(startingAmount);
        document.getElementById('il-total-contributions-value').textContent = formatCurrency(totalContributions);
        document.getElementById('il-total-interest-value').textContent = formatCurrency(totalInterest);
    }
    
    // Generate yearly breakdown table and pie chart for successful calculations
    if (timeToTarget >= 0 && timeToTarget <= 100) {
        generateYearlyBreakdown(startingAmount, monthlyContribution, returnRate, timeToTarget);
        // Generate pie chart
        const totalContributions = monthlyContribution * timeToTarget * 12;
        const endAmount = calculateFutureValue(startingAmount, monthlyContribution, returnRate, timeToTarget);
        const totalInterest = endAmount - startingAmount - totalContributions;
        updateBalanceChart(startingAmount, totalContributions, totalInterest);
    } else {
        // Clear the breakdown table for impossible scenarios
        const tbody = document.getElementById('breakdown-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="5" style="text-align: center; color: #666; font-style: italic; padding: 24px;">
                        Target amount is impossible to reach with these parameters
                    </td>
                </tr>
            `;
        }
    }
    
    // Show only relevant results for Investment Length mode (at the very end)
    showOnlyRelevantResults('investment-length');
} 