 // Credit: Brennan Tymrak 2019-2024, see read me

 (function() {
    if (window.tripFormInitialized) return;
    window.tripFormInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
        const addButton = document.getElementById('add-form');
        const formsContainer = document.getElementById('itinerary-forms');

        console.log('Add Button:', addButton);
        console.log('Forms Container:', formsContainer);

        if (!addButton || !formsContainer) return;

        const totalFormsInput = document.querySelector('[name$="-TOTAL_FORMS"]');
        const initialFormsInput = document.querySelector('[name$="-INITIAL_FORMS"]');
        const maxFormsInput = document.querySelector('[name$="-MAX_NUM_FORMS"]');

        console.log('Total Forms Input:', totalFormsInput);
        console.log('Initial Forms Input:', initialFormsInput);
        console.log('Max Forms Input:', maxFormsInput);

        // Log initial form details
        const initialForms = formsContainer.querySelectorAll('.itinerary-form');
        console.log('Initial Form Count:', initialForms.length);
        initialForms.forEach((form, index) => {
            console.log(`Form ${index} Details:`, {
                dayNumber: form.querySelector('[name*="day_number"]')?.value,
                morning: form.querySelector('[name*="morning"]')?.value,
                afternoon: form.querySelector('[name*="afternoon"]')?.value,
                evening: form.querySelector('[name*="evening"]')?.value
            });
        });

        if (!totalFormsInput) return;

        addButton.addEventListener('click', function() {
            const forms = formsContainer.querySelectorAll('.itinerary-form');
            const formCount = forms.length;

            console.log('Current Form Count Before Adding:', formCount);
            console.log('Current Total Forms Value:', totalFormsInput.value);

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

            // Append the new form
            formsContainer.appendChild(newForm);

            // Update total forms input
            totalFormsInput.value = formCount + 1;

            console.log('Updated Total Forms Value:', totalFormsInput.value);
        });

    });
})();