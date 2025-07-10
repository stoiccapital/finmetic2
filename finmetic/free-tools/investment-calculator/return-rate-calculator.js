// Return Rate Calculator Module
// Calculates the required annual return rate to reach a target amount

// Return Rate Calculator
function calculateReturnRate() {
    const startingAmount = parseFloat(document.getElementById('rr-starting-amount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('rr-monthly-contribution').value) || 0;
    const targetAmount = parseFloat(document.getElementById('rr-target-amount').value) || 0;
    const years = parseFloat(document.getElementById('rr-years').value) || 0;
    
    if (startingAmount < 0 || monthlyContribution < 0 || targetAmount < 0 || years < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    
    if (years === 0) {
        alert('Investment length must be greater than 0.');
        return;
    }
    
    // Check if target is already met with just contributions and starting amount
    const totalContributions = monthlyContribution * years * 12;
    const totalWithoutInterest = startingAmount + totalContributions;
    
    if (totalWithoutInterest >= targetAmount) {
        document.getElementById('rr-result-value').textContent = '0.00%';
        // Generate yearly breakdown table for 0% interest case
        generateYearlyBreakdown(startingAmount, monthlyContribution, 0, years);
        // Generate pie chart for 0% interest case
        const totalContributions0 = monthlyContribution * years * 12;
        const totalInterest0 = 0;
        updateBalanceChart(startingAmount, totalContributions0, totalInterest0);
        // Show only relevant results for Return Rate mode (0% case)
        showOnlyRelevantResults('return-rate');
        return;
    }
    
    const requiredRate = calculateRequiredRate(startingAmount, targetAmount, monthlyContribution, years);
    
    if (requiredRate === -1) {
        document.getElementById('rr-result-value').textContent = 'Target amount is impossible to reach with these parameters.';
    } else {
        document.getElementById('rr-result-value').textContent = formatPercentage(requiredRate);
        
        // Calculate and display all result values
        const totalContributions = monthlyContribution * years * 12;
        const endAmount = calculateFutureValue(startingAmount, monthlyContribution, requiredRate, years);
        const totalInterest = endAmount - startingAmount - totalContributions;
        
        document.getElementById('rr-end-amount-value').textContent = formatCurrency(targetAmount);
        document.getElementById('rr-starting-amount-value').textContent = formatCurrency(startingAmount);
        document.getElementById('rr-total-contributions-value').textContent = formatCurrency(totalContributions);
        document.getElementById('rr-total-interest-value').textContent = formatCurrency(totalInterest);
    }
    
    // Generate yearly breakdown table and pie chart for successful calculations
    if (requiredRate !== -1) {
        generateYearlyBreakdown(startingAmount, monthlyContribution, requiredRate, years);
        // Generate pie chart
        const totalContributions = monthlyContribution * years * 12;
        const endAmount = calculateFutureValue(startingAmount, monthlyContribution, requiredRate, years);
        const totalInterest = endAmount - startingAmount - totalContributions;
        updateBalanceChart(startingAmount, totalContributions, totalInterest);
    }
    
    // Show only relevant results for Return Rate mode (at the very end)
    showOnlyRelevantResults('return-rate');
} 