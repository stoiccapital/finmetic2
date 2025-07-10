// Additional Contribution Calculator Module
// Calculates the required monthly contribution to reach a target amount

// Additional Contribution Calculator
function calculateAdditionalContribution() {
    const startingAmount = parseFloat(document.getElementById('ac-starting-amount').value) || 0;
    const targetAmount = parseFloat(document.getElementById('ac-target-amount').value) || 0;
    const returnRate = parseFloat(document.getElementById('ac-return-rate').value) || 0;
    const years = parseFloat(document.getElementById('ac-years').value) || 0;
    
    if (startingAmount < 0 || targetAmount < 0 || returnRate < 0 || years < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    
    if (returnRate > 100) {
        alert('Return rate cannot exceed 100%.');
        return;
    }
    
    const requiredContribution = calculateRequiredContribution(startingAmount, targetAmount, returnRate, years);
    
    if (requiredContribution < 0) {
        document.getElementById('ac-result-value').textContent = 'Target amount is too low for the given parameters.';
        // Show only relevant results for Additional Contribution mode (error case)
        showOnlyRelevantResults('additional-contribution');
        return;
    }
    
    // Calculate breakdown for unified display
    const totalContributions = requiredContribution * years * 12;
    const totalInterest = targetAmount - startingAmount - totalContributions;
    
    // Display all results
    document.getElementById('ac-result-value').textContent = formatCurrency(requiredContribution);
    document.getElementById('ac-end-amount-value').textContent = formatCurrency(targetAmount);
    document.getElementById('ac-starting-amount-value').textContent = formatCurrency(startingAmount);
    document.getElementById('ac-total-contributions-value').textContent = formatCurrency(totalContributions);
    document.getElementById('ac-total-interest-value').textContent = formatCurrency(totalInterest);
    
    // Update the pie chart for unified breakdown
    updateBalanceChart(startingAmount, totalContributions, totalInterest);
    
    // Generate yearly breakdown table
    generateYearlyBreakdown(startingAmount, requiredContribution, returnRate, years);
    
    // Show only relevant results for Additional Contribution mode (at the very end)
    showOnlyRelevantResults('additional-contribution');
} 