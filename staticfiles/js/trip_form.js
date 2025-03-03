document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const formSteps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progressBar");
    const nextButtons = document.querySelectorAll("button.next-step");
    const prevButtons = document.querySelectorAll("button.prev-step");
    let selectedCountryCode = null;
    let selectedCities = [];

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
        const inputs = formSteps[step].querySelectorAll("input, select, textarea");

        inputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                valid = false;
                input.classList.add("is-invalid");

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

    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateStep(currentStep) && currentStep < formSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
                document.getElementById('tripForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
                document.getElementById('tripForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    showStep(currentStep);

    const tripForm = document.getElementById('tripForm');
    if (tripForm) {
        tripForm.addEventListener('submit', function (e) {
            if (!validateStep(currentStep)) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    function initPlacesAutocomplete() {
        const countryField = document.getElementById('id_country');
        const cityField = document.getElementById('city-input');
        const citiesList = document.getElementById('selected-cities-list');
        const citiesField = document.getElementById('id_cities');

        if (!countryField || !citiesList || !citiesField) return;

        const countryAutocomplete = new google.maps.places.Autocomplete(countryField, {
            types: ['(regions)'],
            fields: ['address_components', 'formatted_address', 'name']
        });

        countryAutocomplete.addListener('place_changed', function () {
            const place = countryAutocomplete.getPlace();
            if (place.address_components) {
                const countryComponent = place.address_components.find(component =>
                    component.types.includes('country')
                );

                if (countryComponent) {
                    selectedCountryCode = countryComponent.short_name;
                    countryField.value = countryComponent.long_name;
                    selectedCities = [];
                    updateSelectedCitiesList();
                    initCityAutocomplete();
                    cityField.disabled = false;
                    cityField.placeholder = `Add cities in ${countryComponent.long_name}...`;
                }
            }
        });

        function initCityAutocomplete() {
            if (!cityField) return;

            const cityAutocomplete = new google.maps.places.Autocomplete(cityField, {
                types: ['(cities)'],
                fields: ['address_components', 'formatted_address', 'name']
            });

            cityAutocomplete.setComponentRestrictions({ country: [selectedCountryCode] });

            cityAutocomplete.addListener('place_changed', function () {
                const place = cityAutocomplete.getPlace();

                if (place.address_components) {
                    const localityComponent = place.address_components.find(component =>
                        component.types.includes('locality')
                    );

                    const cityName = localityComponent ? localityComponent.long_name : place.name;

                    if (!selectedCities.includes(cityName)) {
                        selectedCities.push(cityName);
                        updateSelectedCitiesList();
                        cityField.value = '';
                    } else {
                        alert(`${cityName} is already added.`);
                    }
                }
            });
        }

        function updateSelectedCitiesList() {
            citiesList.innerHTML = '';
            citiesField.value = selectedCities.join(', ');

            selectedCities.forEach((city, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                const cityText = document.createElement('span');
                cityText.textContent = city;

                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'btn btn-sm btn-danger';
                removeButton.textContent = '×';
                removeButton.addEventListener('click', function () {
                    selectedCities.splice(index, 1);
                    updateSelectedCitiesList();
                });

                listItem.appendChild(cityText);
                listItem.appendChild(removeButton);
                citiesList.appendChild(listItem);
            });
        }

        initCityAutocomplete();
    }

    if (typeof google !== "undefined" && google.maps && google.maps.places) {
        initPlacesAutocomplete();
    } else {
        console.error("Google Places API not loaded.");
    }
});


