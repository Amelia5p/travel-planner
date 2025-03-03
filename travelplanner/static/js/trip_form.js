document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const formSteps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progressBar");
    const nextButtons = document.querySelectorAll("button.next-step");
    const prevButtons = document.querySelectorAll("button.prev-step");
   

    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.style.display = index === step ? "block" : "none";
        });
        updateProgressBar();
    }

    function updateProgressBar() {
        const stepPercentage = ((currentStep + 1) / formSteps.length) * 100;
        progressBar.style.width = stepPercentage + "%";
        progressBar.textContent = `Step ${currentStep + 1} of ${formSteps.length}`;
    }

    function validateStep(step) {
        let valid = true;
        const inputs = formSteps[step].querySelectorAll( "select, textarea");

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

    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateStep(currentStep) && currentStep < formSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    showStep(currentStep);})