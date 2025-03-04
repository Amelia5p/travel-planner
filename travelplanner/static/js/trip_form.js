(function() {
    // Prevent add button from adding 2 days at a time.
    if (window.tripFormInitialized) return;
    window.tripFormInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
        const addButton = document.getElementById('add-form');
        const formsContainer = document.getElementById('itinerary-forms');

        if (!addButton || !formsContainer) return;

        // Credit: Brennan Tymrak 2019-2024, see read me
        const totalFormsInput = document.querySelector('[name$="-TOTAL_FORMS"]');

        if (!totalFormsInput) return;

        addButton.addEventListener('click', function() {
            
            const forms = formsContainer.querySelectorAll('.itinerary-form');
            const formCount = forms.length;

            // Clone form
            const lastForm = forms[formCount - 1];
            const newForm = lastForm.cloneNode(true);

           
            newForm.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.name.includes('TOTAL_FORMS') || 
                    input.name.includes('INITIAL_FORMS') || 
                    input.name.includes('MAX_NUM_FORMS')) {
                    return;
                }

                // Update form
                const nameMatch = input.name.match(/(.+?)-(\d+)-(.+)/);
                if (nameMatch) {
                    input.name = input.name.replace(`-${nameMatch[2]}-`, `-${formCount}-`);
                    
                    if (input.id) {
                        input.id = input.id.replace(`-${nameMatch[2]}-`, `-${formCount}-`);
                    }
                }

                // Clear input
                if (input.type === 'text' || input.type === 'date' || input.tagName.toLowerCase() === 'textarea') {
                    input.value = '';
                }

                if (input.tagName.toLowerCase() === 'select') {
                    input.selectedIndex = 0;
                }
            });

            // Increase the day number
            const dayInput = newForm.querySelector('[name*="day"]'); 
            if (dayInput) {
                const previousDayInput = lastForm.querySelector('[name*="day"]');
                if (previousDayInput) {
                    dayInput.value = parseInt(previousDayInput.value) + 1 || 1;
                } else {
                    dayInput.value = 1;
                }
            }

            
            formsContainer.appendChild(newForm);

            
            totalFormsInput.value = formCount + 1;
        });
    });
})();
