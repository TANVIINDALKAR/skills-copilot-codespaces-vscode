// Calculator JavaScript functionality

let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

// Function to append values to the display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple operators in a row
    if (isOperator(value) && isOperator(currentInput.slice(-1))) {
        return;
    }
    
    // Prevent multiple decimal points in the same number
    if (value === '.') {
        const lastNumber = getLastNumber();
        if (lastNumber.includes('.')) {
            return;
        }
    }
    
    currentInput += value;
    display.value = currentInput;
}

// Function to clear the display
function clearDisplay() {
    currentInput = '';
    display.value = '';
    shouldResetDisplay = false;
}

// Function to delete the last character
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

// Function to perform calculation
function calculate() {
    try {
        if (currentInput === '') {
            return;
        }
        
        // Replace display-friendly operators with JavaScript operators
        let expression = currentInput;
        
        // Evaluate the expression safely
        let result = evaluateExpression(expression);
        
        if (result === null) {
            display.value = 'Error';
            currentInput = '';
            return;
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result.toString();
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

// Safe expression evaluator
function evaluateExpression(expression) {
    try {
        // Only allow numbers, operators, and decimal points
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            return null;
        }
        
        // Use Function constructor for safer evaluation than eval
        return Function('"use strict"; return (' + expression + ')')();
    } catch (error) {
        return null;
    }
}

// Helper function to check if a character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Helper function to get the last number in the current input
function getLastNumber() {
    const operators = ['+', '-', '*', '/'];
    let lastIndex = -1;
    
    for (let i = currentInput.length - 1; i >= 0; i--) {
        if (operators.includes(currentInput[i])) {
            lastIndex = i;
            break;
        }
    }
    
    return currentInput.substring(lastIndex + 1);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and operators
    if (/[0-9+\-*/.=]/.test(key)) {
        event.preventDefault();
        if (key === '=') {
            calculate();
        } else {
            appendToDisplay(key);
        }
    }
    
    // Enter key for calculation
    if (key === 'Enter') {
        event.preventDefault();
        calculate();
    }
    
    // Escape or Delete for clear
    if (key === 'Escape' || key === 'Delete') {
        event.preventDefault();
        clearDisplay();
    }
    
    // Backspace for delete last
    if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize display
display.value = '';