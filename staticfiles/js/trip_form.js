document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const formSteps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progressBar");
    const nextButtons = document.querySelectorAll("button.next-step");
    const prevButtons = document.querySelectorAll("button.prev-step");
    let selectedCountryCode = null;

    //  Show step
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
            }
        });
    });

    // Back button
    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });


    showStep(currentStep);

    
    function initAutocomplete() {
        const countryInput = document.getElementById("id_country");
        const cityInput = document.getElementById("cities");
        const cityError = document.getElementById("city-error");
        const selectedCitiesList = document.getElementById("selected-cities");
        const selectedCitiesInput = document.getElementById("selected_cities_input");
        let selectedCities = [];

        // Country
        if (countryInput) {
            let countryAutocomplete = new google.maps.places.Autocomplete(countryInput, {
                types: ["(regions)"], 
            });

            countryAutocomplete.addListener("place_changed", function () {
                let place = countryAutocomplete.getPlace();
                if (place.address_components) {
                    let countryComponent = place.address_components.find(component => 
                        component.types.includes("country")
                    );
                    selectedCountryCode = countryComponent ? countryComponent.short_name : null;
                    countryInput.value = place.formatted_address || place.name;
                    clearCityInput(); 
                    cityInput.disabled = false; 
                }
            });
        }

        // City
        if (cityInput) {
            let cityAutocomplete = new google.maps.places.Autocomplete(cityInput, {
                types: ["(cities)"],
            });

            cityAutocomplete.addListener("place_changed", function () {
                let place = cityAutocomplete.getPlace();
                let cityName = place.name;

                if (!selectedCountryCode) {
                    cityError.textContent = "Please select a country first.";
                    cityInput.value = "";
                    return;
                }

                let cityCountryCode = place.address_components.find(component =>
                    component.types.includes("country")
                ).short_name;

                if (cityCountryCode !== selectedCountryCode) {
                    cityError.textContent = `Please select a city in ${countryInput.value}.`;
                    cityInput.value = ""; 
                } else {
                    cityError.textContent = ""; 

                    // check if the city already there
                    if (!selectedCities.includes(cityName)) {
                        selectedCities.push(cityName); 
                        updateSelectedCities();
                        cityInput.value = "";
                        cityAutocomplete.set("place", null);
                    } else {
                        cityError.textContent = `${cityName} is already selected.`;
                    }
                }
            });
        }

         // Update cities 
        function updateSelectedCities() {
            selectedCitiesList.innerHTML = ""; 

            selectedCities.forEach((city, index) => {
                let li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.textContent = city;

                
                let removeBtn = document.createElement("button");
                removeBtn.className = "btn btn-danger btn-sm";
                removeBtn.textContent = "X";
                removeBtn.onclick = function () {
                    selectedCities.splice(index, 1);
                    updateSelectedCities();
                };

                li.appendChild(removeBtn);
                selectedCitiesList.appendChild(li);
            });

            // Store hidden cities
            selectedCitiesInput.value = selectedCities.join(",");
        }

        // Clear selected cities
        function clearCityInput() {
            selectedCities = []; //
            updateSelectedCities();
            cityError.textContent = "";
            cityInput.disabled = true; 
        }
    }
    if (typeof google !== "undefined" && google.maps && google.maps.places) {
        initAutocomplete();
    } else {
        console.error("Google Places API is not loaded.");
    }
});

// Ensure end date can't be before start date on form
document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("start_date");
    const endDateInput = document.getElementById("end_date");

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
});
