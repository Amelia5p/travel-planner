// Credit: Brennan Tymrak 2019-2024, see read me

(function() {
    if (window.tripFormInitialized) return;
    window.tripFormInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
       
        const addButton = document.getElementById('add-form');
        const formsContainer = document.getElementById('itinerary-container');

        if (!addButton || !formsContainer) return;

       
        const totalFormsInput = document.querySelector('[name$="-TOTAL_FORMS"]');
        if (!totalFormsInput) return;

        addButton.addEventListener('click', function() {
            // Count current number of forms
            const forms = formsContainer.querySelectorAll('.itinerary-form');
            const formCount = forms.length;

            // Clone the last form
            const lastForm = forms[formCount - 1];
            const newForm = lastForm.cloneNode(true);

            // Update cloned form
            newForm.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.name.includes('TOTAL_FORMS') || 
                    input.name.includes('INITIAL_FORMS') || 
                    input.name.includes('MAX_NUM_FORMS')) {
                    return; 
                }

                // Update form index,name and id attributes
                const nameMatch = input.name.match(/(.+?)-(\d+)-(.+)/);
                if (nameMatch) {
                    input.name = input.name.replace(`-${nameMatch[2]}-`, `-${formCount}-`);
                    if (input.id) {
                        input.id = input.id.replace(`-${nameMatch[2]}-`, `-${formCount}-`);
                    }
                }

                if (input.type === 'text' || input.type === 'date' || input.tagName.toLowerCase() === 'textarea') {
                    input.value = '';
                }
               
                if (input.tagName.toLowerCase() === 'select') {
                    input.selectedIndex = 0;
                }
            });

            // Increase the day number by 1
            const dayInput = newForm.querySelector('[name*="day"]'); 
            if (dayInput) {
                const previousDayInput = lastForm.querySelector('[name*="day"]');
                if (previousDayInput) {
                    dayInput.value = parseInt(previousDayInput.value) + 1 || 1;
                } else {
                    dayInput.value = 1;
                }
            }
            
            // Append the new form to the container
            formsContainer.appendChild(newForm);

            // Update TOTAL_FORMS value
            totalFormsInput.value = formCount + 1;
        });
    });
  
    document.addEventListener("DOMContentLoaded", function() {
        // Initialize variables for selected cities and country code.
        let selectedCities = [];
        let selectedCountryCode = null;
        
        // Initialize Google Maps Autocomplete 
        function initAutocomplete() {
          const countryInput = document.getElementById("country");
          const countryHiddenInput = document.getElementById("country_input");
          const cityInput = document.getElementById("cities");
          const cityError = document.getElementById("city-error");
          const selectedCitiesList = document.getElementById("selected-cities");
          const selectedCitiesInput = document.getElementById("cities_input");
          
          // Country Autocomplete
          if (countryInput) {
            let countryAutocomplete = new google.maps.places.Autocomplete(countryInput, {
              types: ["(regions)"],
            });
            
            countryAutocomplete.addListener("place_changed", function () {
              let place = countryAutocomplete.getPlace();
              if (place && place.address_components) {
                let countryComponent = place.address_components.find(component =>
                  component.types.includes("country")
                );
                selectedCountryCode = countryComponent ? countryComponent.short_name : null;
                countryHiddenInput.value = place.formatted_address || place.name;
                clearCityInput(); 
                cityInput.disabled = false;
              }
            });
          }
          
          // City Autocomplete
          if (cityInput) {
            let cityAutocomplete = new google.maps.places.Autocomplete(cityInput, {
              types: ["(cities)"],
            });
            
            cityAutocomplete.addListener("place_changed", function () {
              let place = cityAutocomplete.getPlace();
              if (!place || !place.address_components) {
                return;
              }
              let cityName = place.name;
              let cityCountryComponent = place.address_components.find(component =>
                component.types.includes("country")
              );
              if (!cityCountryComponent) {
                cityInput.value = "";
                return;
              }
              let cityCountryCode = cityCountryComponent.short_name;
              if (!selectedCountryCode) {
                cityError.textContent = "Please select a country first.";
                cityInput.value = "";
                return;
              }
              if (cityCountryCode !== selectedCountryCode) {
                cityError.textContent = `Please select a city in ${countryInput.value}.`;
                cityInput.value = "";
              } else {
                cityError.textContent = "";
                // Add city only if it's not already in the list
                if (!selectedCities.includes(cityName)) {
                  selectedCities.push(cityName);
                }
                updateSelectedCities();
                cityInput.value = "";
              }
            });
          }
          
          // Update the displayed list of selected cities
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
            // selected cities in hidden input field
            selectedCitiesInput.value = selectedCities.join(",");
          }
          
          // Clear input
          function clearCityInput() {
            selectedCities = [];
            updateSelectedCities();
            cityError.textContent = "";
            cityInput.disabled = true;
          }
        }
        
        
        if (typeof google !== "undefined" && google.maps && google.maps.places) {
          initAutocomplete();
        }
        
        // form submission, validate 
        const form = document.querySelector("form");
        if (form) {
          form.addEventListener("submit", function (e) {
            document.getElementById("country_input").value = document.getElementById("country").value;
            const selectedCitiesInput = document.getElementById("cities_input");
            if (!selectedCitiesInput.value.trim()) {
              e.preventDefault();
              alert("Please add at least one city before proceeding.");
            }
          });
        }
      });
      
})();
