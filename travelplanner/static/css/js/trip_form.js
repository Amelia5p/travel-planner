document.addEventListener("DOMContentLoaded", function() {
    let currentStep = 0; // Start at Step 0 (Step 1 in UI)
    
    // Select all form steps, progress bar, and navigation buttons
    const formSteps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progressBar");
    const nextButtons = document.querySelectorAll(".next-step");
    const prevButtons = document.querySelectorAll(".prev-step");


    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.classList.toggle("active", index === step);
        });
        updateProgressBar(); // Update the progress bar after changing steps
    }

    /**
     * Function to update the progress bar based on the current step.
     */
    function updateProgressBar() {
        const stepPercentage = ((currentStep + 1) / formSteps.length) * 100;
        progressBar.style.width = stepPercentage + "%";
        progressBar.textContent = `Step ${currentStep + 1} of ${formSteps.length}`;
    }


    function validateStep(step) {
        let valid = true;
        const inputs = formSteps[step].querySelectorAll("input, select, textarea");
        
        inputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                valid = false;
                input.classList.add("is-invalid"); 
            } else {
                input.classList.remove("is-invalid");
            }
        });

        return valid;
    }

    /**
     * Event listeners for "Next" buttons.
     * - Validates the current step before allowing the user to proceed.
     */
    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    /**
     * Event listeners for "Back" buttons.
     * - Allows users to navigate back without validation.
     */
    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Initialise the form by showing only the first step
    showStep(currentStep);
});
