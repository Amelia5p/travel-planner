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
          if (
            input.name.includes('TOTAL_FORMS') || 
            input.name.includes('INITIAL_FORMS') || 
            input.name.includes('MAX_NUM_FORMS')
          ) {
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
          if (
            input.type === 'text' || 
            input.type === 'date' || 
            input.tagName.toLowerCase() === 'textarea'
          ) {
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
  
    document.addEventListener("DOMContentLoaded", function() {
      // Initialize variables for selected cities and country code.
      let selectedCities = [];
      let selectedCountryCode = null;
      
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
              selectedCities.push(cityName);
              updateSelectedCities();
              cityInput.value = "";
            }
          });
        }
        
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
          
          selectedCitiesInput.value = selectedCities.join(",");
        }
        
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
      
      // Define the form variable by selecting the form element from the DOM.
      const form = document.querySelector("form");
      if (form) {
        form.addEventListener("submit", function () {
          document.getElementById("country_input").value = document.getElementById("country").value;
          
          let cityElements = document.querySelectorAll("#selected-cities li");
          let cityList = [];
          cityElements.forEach(city => cityList.push(city.innerText.trim()));
          document.getElementById("cities_input").value = cityList.join(",");
        });
      }
    });
  })();
  