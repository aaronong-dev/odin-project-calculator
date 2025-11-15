const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let shouldResetDisplay = false;

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;

        // Clear display
        if (value === "AC" || value === "C") {
            currentInput = "";
            display.textContent = "";
            shouldResetDisplay = false;
            return;
        }

        // Handle equals - calculate result
        if (value === "=") {
            try {
                // Replace X with * for multiplication
                let expression = currentInput.replace(/X/g, "*");
                
                // Evaluate the expression
                const result = Function('"use strict"; return (' + expression + ')')();
                
                // Display result
                display.textContent = result;
                currentInput = result.toString();
                shouldResetDisplay = true;
            } catch (error) {
                display.textContent = "Error";
                currentInput = "";
            }
            return;
        }

        // Handle +/- (negate)
        if (value === "+/-") {
            if (currentInput && !isNaN(currentInput)) {
                currentInput = (-parseFloat(currentInput)).toString();
                display.textContent = currentInput;
            }
            return;
        }

        // If we just calculated and user presses a number or decimal, reset
        if (shouldResetDisplay && /[0-9.]/.test(value)) {
            currentInput = "";
            shouldResetDisplay = false;
        }

        // If we just calculated and user presses an operator, continue from result
        if (shouldResetDisplay && ["+", "-", "*", "/", "X", "%"].includes(value)) {
            shouldResetDisplay = false;
        }

        // Prevent multiple operators in a row
        const lastChar = currentInput[currentInput.length - 1];
        if (["+", "-", "*", "/", "X", "%"].includes(value) && ["+", "-", "*", "/", "X", "%"].includes(lastChar)) {
            currentInput = currentInput.slice(0, -1) + value;
        } else {
            currentInput += value;
        }

        display.textContent = currentInput;
    });
});
