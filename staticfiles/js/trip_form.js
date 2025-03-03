document.addEventListener("DOMContentLoaded", function () {
    // Multi-step form navigation
    let currentStep = 0;
    const formSteps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progressBar");
    const nextButtons = document.querySelectorAll("button.next-step");
    const prevButtons = document.querySelectorAll("button.prev-step");
    let selectedCountryCode = null;

    // Show step
    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.style.display = index === step ? "block" : "none";
        });
        updateProgressBar();
    }

    // Update progress bar
    function updateProgressBar() {
        const stepPercentage = ((currentStep + 1) / formSteps.length) * 100;
        progressBar.style.width = stepPercentage + "%"; 
        progressBar.textContent = `Step ${currentStep + 1} of ${formSteps.length}`;
    }

    // Validation
    function validateStep(step) {
        let valid = true;
        const inputs = formSteps[step].querySelectorAll("input, select, textarea");

        inputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                valid = false;
                input.classList.add("is-invalid");
                
                // Add error feedback if not already present
                const parentDiv = input.closest('.form-group');
                if (parentDiv && !parentDiv.querySelector('.invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'This field is required.';
                    parentDiv.appendChild(feedback);
                }
            } else {
                input.classList.remove("is-invalid");
            }
        });

        return valid;
    }

    // Next button
    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateStep(currentStep) && currentStep < formSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
                
                // Scroll to top of form
                const formElement = document.getElementById('tripForm');
                if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Back button
    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
                
                // Scroll to top of form
                const formElement = document.getElementById('tripForm');
                if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Initialize the first step
    showStep(currentStep);

    // Form submission handling
    const tripForm = document.getElementById('tripForm');
    if (tripForm) {
        tripForm.addEventListener('submit', function(e) {
            if (!validateStep(currentStep)) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    // Google Places API Integration
    function initPlacesAutocomplete() {
        // Country field autocomplete
        const countryField = document.getElementById('id_country');
        if (countryField) {
            // Create container for city selection
            const citiesContainer = document.createElement('div');
            citiesContainer.id = 'selected-cities-container';
            citiesContainer.className = 'mt-2';
            
            const citiesList = document.createElement('ul');
            citiesList.id = 'selected-cities-list';
            citiesList.className = 'list-group';
            
            const errorContainer = document.createElement('div');
            errorContainer.id = 'city-error';
            errorContainer.className = 'text-danger small';
            
            // Insert containers into the DOM near the cities field
            const citiesField = document.getElementById('id_cities');
            if (citiesField && citiesField.parentNode) {
                citiesField.parentNode.appendChild(errorContainer);
                citiesField.parentNode.appendChild(citiesContainer);
                citiesContainer.appendChild(citiesList);
            }
            
            // Array to store selected cities
            let selectedCities = [];
            
            // Initialize country autocomplete
            const countryAutocomplete = new google.maps.places.Autocomplete(countryField, {
                types: ['(regions)'],
                fields: ['address_components', 'formatted_address', 'name']
            });
            
            // Set bias to return results around the world
            countryAutocomplete.setComponentRestrictions({
                country: []
            });
            
            // When a country is selected
            countryAutocomplete.addListener('place_changed', function() {
                const place = countryAutocomplete.getPlace();
                
                if (place.address_components) {
                    // Find country component
                    const countryComponent = place.address_components.find(component => 
                        component.types.includes('country')
                    );
                    
                    if (countryComponent) {
                        selectedCountryCode = countryComponent.short_name;
                        countryField.value = countryComponent.long_name;
                        
                        // Clear previous cities when country changes
                        selectedCities = [];
                        updateSelectedCitiesList();
                        
                        // Create and initialize city field if it wasn't created before
                        initCityAutocomplete();
                        
                        // Enable city input
                        const cityInput = document.getElementById('city-input');
                        if (cityInput) {
                            cityInput.disabled = false;
                            cityInput.placeholder = `Add cities in ${countryComponent.long_name}...`;
                        }
                    }
                }
            });
            
            // Initialize city autocomplete
            function initCityAutocomplete() {
                // Check if we already have a city input
                let cityInput = document.getElementById('city-input');
                
                // If not, create one
                if (!cityInput) {
                    // Create a container for the city input
                    const cityInputContainer = document.createElement('div');
                    cityInputContainer.className = 'input-group mt-3';
                    
                    // Create the city input field
                    cityInput = document.createElement('input');
                    cityInput.type = 'text';
                    cityInput.className = 'form-control';
                    cityInput.id = 'city-input';
                    cityInput.placeholder = 'Select a country first...';
                    cityInput.disabled = true;
                    
                    // Add a label for the city input
                    const cityLabel = document.createElement('label');
                    cityLabel.htmlFor = 'city-input';
                    cityLabel.textContent = 'Add Cities';
                    cityLabel.className = 'form-label';
                    
                    // Add the input to the form
                    const citiesField = document.getElementById('id_cities');
                    if (citiesField && citiesField.parentNode) {
                        citiesField.style.display = 'none'; // Hide the original textarea
                        citiesField.parentNode.insertBefore(cityLabel, citiesField);
                        citiesField.parentNode.insertBefore(cityInputContainer, citiesField.nextSibling);
                        cityInputContainer.appendChild(cityInput);
                    }
                }
                
                // Initialize or reinitialize city autocomplete
                const cityAutocomplete = new google.maps.places.Autocomplete(cityInput, {
                    types: ['(cities)'],
                    fields: ['address_components', 'formatted_address', 'name']
                });
                
                // Restrict to the selected country
                if (selectedCountryCode) {
                    cityAutocomplete.setComponentRestrictions({
                        country: [selectedCountryCode]
                    });
                }
                
                // When a city is selected
                cityAutocomplete.addListener('place_changed', function() {
                    const place = cityAutocomplete.getPlace();
                    
                    if (place.address_components) {
                        // Find city component
                        const localityComponent = place.address_components.find(component => 
                            component.types.includes('locality')
                        );
                        
                        const cityName = localityComponent ? localityComponent.long_name : place.name;
                        
                        // Verify the city is in the selected country
                        const countryComponent = place.address_components.find(component => 
                            component.types.includes('country')
                        );
                        
                        if (countryComponent && countryComponent.short_name === selectedCountryCode) {
                            // Check if city is already added
                            if (!selectedCities.includes(cityName)) {
                                selectedCities.push(cityName);
                                updateSelectedCitiesList();
                                
                                // Clear input for next city
                                cityInput.value = '';
                                document.getElementById('city-error').textContent = '';
                            } else {
                                document.getElementById('city-error').textContent = `${cityName} is already in your list.`;
                            }
                        } else {
                            document.getElementById('city-error').textContent = 'Please select a city in the chosen country.';
                            cityInput.value = '';
                        }
                    }
                });
            }
            
            // Update the list of selected cities
            function updateSelectedCitiesList() {
                const citiesList = document.getElementById('selected-cities-list');
                const citiesField = document.getElementById('id_cities');
                
                if (citiesList && citiesField) {
                    // Clear the current list
                    citiesList.innerHTML = '';
                    
                    // Add each city to the list with a remove button
                    selectedCities.forEach((city, index) => {
                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                        
                        const cityText = document.createElement('span');
                        cityText.textContent = city;
                        
                        const removeButton = document.createElement('button');
                        removeButton.type = 'button';
                        removeButton.className = 'btn btn-sm btn-danger';
                        removeButton.textContent = '×';
                        removeButton.setAttribute('aria-label', `Remove ${city}`);
                        
                        removeButton.addEventListener('click', function() {
                            selectedCities.splice(index, 1);
                            updateSelectedCitiesList();
                        });
                        
                        listItem.appendChild(cityText);
                        listItem.appendChild(removeButton);
                        citiesList.appendChild(listItem);
                    });
                    
                    // Update the hidden cities field
                    citiesField.value = selectedCities.join(', ');
                    
                    // Show or hide the cities container
                    const container = document.getElementById('selected-cities-container');
                    if (container) {
                        container.style.display = selectedCities.length > 0 ? 'block' : 'none';
                    }
                }
            }
        }
        
        // Accommodation name autocomplete
        const accommodationField = document.getElementById('id_accommodation_name');
        if (accommodationField) {
            const accommodationAutocomplete = new google.maps.places.Autocomplete(accommodationField, {
                types: ['lodging'],
                fields: ['name', 'formatted_address']
            });
            
            accommodationAutocomplete.addListener('place_changed', function() {
                const place = accommodationAutocomplete.getPlace();
                accommodationField.value = place.name + ' - ' + place.formatted_address;
            });
        }
    }

    // Initialize Google Places if available
    if (typeof google !== "undefined" && google.maps && google.maps.places) {
        initPlacesAutocomplete();
    } else {
        console.log("Google Places API not loaded. Using basic form inputs.");
    }

    // Date validation
    const startDateInput = document.getElementById("id_start_date");
    const endDateInput = document.getElementById("id_end_date");

    if (startDateInput && endDateInput) {
        const today = new Date().toISOString().split("T")[0];
        startDateInput.min = today;
        endDateInput.min = today;

        startDateInput.addEventListener("change", function () {
            if (startDateInput.value) {
                endDateInput.min = startDateInput.value;
                if (endDateInput.value && endDateInput.value < startDateInput.value) {
                    endDateInput.value = startDateInput.value;
                }
            }
        });
    }

    // Budget formatter
    const budgetInput = document.getElementById('id_budget');
    if (budgetInput) {
        budgetInput.addEventListener('blur', function() {
            if (this.value) {
                const value = parseFloat(this.value);
                if (!isNaN(value)) {
                    this.value = value.toFixed(2);
                }
            }
        });
    }

    // Add sample itinerary button
    const itineraryField = document.getElementById('id_itinerary');
    if (itineraryField) {
        const sampleBtn = document.createElement('button');
        sampleBtn.type = 'button';
        sampleBtn.className = 'btn btn-sm btn-outline-secondary mt-1';
        sampleBtn.textContent = 'Add sample format';
        sampleBtn.onclick = function() {
            // Calculate days based on selected dates if available
            let days = 3; // Default
            const startDate = new Date(document.getElementById('id_start_date').value);
            const endDate = new Date(document.getElementById('id_end_date').value);
            
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const timeDiff = endDate - startDate;
                days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            }
            
            let sample = '';
            for (let i = 1; i <= days; i++) {
                sample += `Day ${i}: [Activities for day ${i}]\n`;
            }
            itineraryField.value = sample;
        };
        
        if (itineraryField.parentNode) {
            itineraryField.parentNode.appendChild(sampleBtn);
        }
    }
});
