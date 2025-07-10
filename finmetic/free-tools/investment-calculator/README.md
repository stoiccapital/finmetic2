# Investment Calculator - Modular Structure

The Investment Calculator has been refactored into a modular architecture for better maintainability and organization.

## File Structure

### Core Files

- `investment-calculator.html` - Main HTML page
- `shared-functions.js` - Common utilities and functions used by all calculators

### Calculator Modules
Each calculator is now in its own dedicated file:

1. **`end-amount-calculator.js`**
   - Calculates final investment value
   - Function: `calculateEndAmount()`
   - Inputs: Starting amount, monthly contribution, return rate, years
   - Output: End balance, total contributions, total interest

2. **`additional-contribution-calculator.js`**
   - Calculates required monthly contribution
   - Function: `calculateAdditionalContribution()`
   - Inputs: Starting amount, target amount, return rate, years
   - Output: Required monthly contribution

3. **`return-rate-calculator.js`**
   - Calculates required annual return rate
   - Function: `calculateReturnRate()`
   - Inputs: Starting amount, monthly contribution, target amount, years
   - Output: Required annual return rate

4. **`starting-amount-calculator.js`**
   - Calculates required initial investment
   - Function: `calculateStartingAmount()`
   - Inputs: Monthly contribution, target amount, return rate, years
   - Output: Required starting amount

5. **`investment-length-calculator.js`**
   - Calculates time to reach target
   - Function: `calculateInvestmentLength()`
   - Inputs: Starting amount, monthly contribution, target amount, return rate
   - Output: Time required to reach target

## Shared Functions (`shared-functions.js`)

### Core Mathematical Functions

- `calculateFutureValue()` - Compound interest calculations
- `calculateRequiredContribution()` - Monthly contribution calculations
- `calculateRequiredRate()` - Return rate calculations using binary search
- `calculateRequiredPrincipal()` - Starting amount calculations
- `calculateTimeToTarget()` - Time calculations using binary search

### Utility Functions

- `formatCurrency()` - Currency formatting
- `formatPercentage()` - Percentage formatting
- `formatYears()` - Time period formatting
- `showMode()` - Calculator mode switching
- `clearAllResults()` - Reset all displays

### Visualization Functions

- `generateYearlyBreakdown()` - Creates yearly breakdown table
- `updateBalanceChart()` - Creates/updates pie charts

### UI Functions

- Event listeners for Enter key support
- Mode switching and result clearing

## Benefits of Modular Structure

### 1. **Maintainability**
- Each calculator is isolated and easy to modify
- Clear separation of concerns
- Easier debugging and testing

### 2. **Scalability**
- Easy to add new calculator types
- Shared functions prevent code duplication
- Consistent behavior across all calculators

### 3. **Organization**
- Logical file structure
- Clear naming conventions
- Self-documenting code structure

### 4. **Performance**
- Only load necessary code
- Better browser caching
- Easier to optimize individual modules

## Usage

All calculator modules depend on `shared-functions.js` and must be loaded in the correct order:

```html
<script src="shared-functions.js"></script>
<script src="end-amount-calculator.js"></script>
<script src="additional-contribution-calculator.js"></script>
<script src="return-rate-calculator.js"></script>
<script src="starting-amount-calculator.js"></script>
<script src="investment-length-calculator.js"></script>
```

## Features

Each calculator module includes:

- ✅ Input validation
- ✅ Error handling
- ✅ Result display
- ✅ Yearly breakdown table
- ✅ Pie chart visualization
- ✅ Keyboard support (Enter key)

## Future Enhancements

The modular structure makes it easy to:

- Add new calculator types
- Implement unit testing for individual modules
- Add advanced features to specific calculators
- Optimize performance of individual components
- Create different UI themes or layouts 