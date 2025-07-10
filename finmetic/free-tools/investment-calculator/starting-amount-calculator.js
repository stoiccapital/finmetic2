// Starting Amount Calculator Module
// Calculates the required initial investment to reach a target amount

// Starting Amount Calculator
function calculateStartingAmount() {
    const monthlyContribution = parseFloat(document.getElementById('sa-monthly-contribution').value) || 0;
    const targetAmount = parseFloat(document.getElementById('sa-target-amount').value) || 0;
    const returnRate = parseFloat(document.getElementById('sa-return-rate').value) || 0;
    const years = parseFloat(document.getElementById('sa-years').value) || 0;
    
    if (monthlyContribution < 0 || targetAmount < 0 || returnRate < 0 || years < 0) {
        alert('Please enter valid positive values.');
        return;
    }
    

    
    const requiredPrincipal = calculateRequiredPrincipal(targetAmount, monthlyContribution, returnRate, years);
    
    if (requiredPrincipal < 0) {
        document.getElementById('sa-result-value').textContent = 'Target amount is impossible to reach with these parameters.';
        document.getElementById('sa-end-amount-value').textContent = '$0';
        document.getElementById('sa-starting-amount-value').textContent = '$0';
        document.getElementById('sa-total-contributions-value').textContent = '$0';
        document.getElementById('sa-total-interest-value').textContent = '$0';
    } else {
        document.getElementById('sa-result-value').textContent = formatCurrency(requiredPrincipal);
        
        // Calculate and display all result values
        const totalContributions = monthlyContribution * years * 12;
        const endAmount = calculateFutureValue(requiredPrincipal, monthlyContribution, returnRate, years);
        const totalInterest = endAmount - requiredPrincipal - totalContributions;
        
        document.getElementById('sa-end-amount-value').textContent = formatCurrency(targetAmount);
        document.getElementById('sa-starting-amount-value').textContent = formatCurrency(requiredPrincipal);
        document.getElementById('sa-total-contributions-value').textContent = formatCurrency(totalContributions);
        document.getElementById('sa-total-interest-value').textContent = formatCurrency(totalInterest);
    }
    
    // Generate yearly breakdown table and pie chart for successful calculations
    if (requiredPrincipal >= 0) {
        generateYearlyBreakdown(requiredPrincipal, monthlyContribution, returnRate, years);
        // Generate pie chart
        const totalContributions = monthlyContribution * years * 12;
        const endAmount = calculateFutureValue(requiredPrincipal, monthlyContribution, returnRate, years);
        const totalInterest = endAmount - requiredPrincipal - totalContributions;
        updateBalanceChart(requiredPrincipal, totalContributions, totalInterest);
    }
    
    // Show only relevant results for Starting Amount mode (at the very end)
    showOnlyRelevantResults('starting-amount');
} 