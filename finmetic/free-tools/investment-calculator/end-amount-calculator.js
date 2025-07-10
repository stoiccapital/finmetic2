// End Amount Calculator Module
// Calculates the final value of an investment given starting amount, contributions, rate, and time

// End Amount Calculator
function calculateEndAmount() {
    const startingAmount = parseFloat(document.getElementById('ea-starting-amount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('ea-monthly-contribution').value) || 0;
    const returnRate = parseFloat(document.getElementById('ea-return-rate').value) || 0;
    const years = parseFloat(document.getElementById('ea-years').value) || 0;
    
    if (startingAmount < 0 || monthlyContribution < 0 || returnRate < 0 || years < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    
    if (returnRate > 100) {
        alert('Return rate cannot exceed 100%.');
        return;
    }
    
    const endAmount = calculateFutureValue(startingAmount, monthlyContribution, returnRate, years);
    const totalContributions = monthlyContribution * years * 12;
    const totalInterest = endAmount - startingAmount - totalContributions;
    
    // Display all results
    document.getElementById('ea-result-value').textContent = formatCurrency(endAmount);
    document.getElementById('ea-starting-amount-value').textContent = formatCurrency(startingAmount);
    document.getElementById('ea-total-contributions-value').textContent = formatCurrency(totalContributions);
    document.getElementById('ea-total-interest-value').textContent = formatCurrency(totalInterest);
    
    // Update the pie chart
    updateBalanceChart(startingAmount, totalContributions, totalInterest);
    
    // Generate yearly breakdown table
    generateYearlyBreakdown(startingAmount, monthlyContribution, returnRate, years);
    
    // Show only relevant results for End Amount mode (at the very end)
    showOnlyRelevantResults('end-amount');
} 