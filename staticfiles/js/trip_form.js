// Credit: Brennan Tymrak 2019-2024, see read me

(function() {
    if (window.tripFormInitialized) return;
    window.tripFormInitialized = true;
  
    // -----------------------------
    // Itinerary Form Code
    // -----------------------------
    document.addEventListener('DOMContentLoaded', function() {
      const addButton = document.getElementById('add-form');
      const formsContainer = document.getElementById('itinerary-container');
      if (!addButton || !formsContainer) return;
      const totalFormsInput = document.querySelector('[name$="-TOTAL_FORMS"]');
      if (!totalFormsInput) return;
  
      addButton.addEventListener('click', function() {
        const forms = formsContainer.querySelectorAll('.itinerary-form');
        const formCount = forms.length;
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
  
    // -----------------------------
    // Country & City selection
    // -----------------------------
    document.addEventListener("DOMContentLoaded", function() {
   
      let selectedCities = [];
      let selectedCountryCode = null;
  
      
      const countryInput = document.getElementById("country");
      const countryHiddenInput = document.getElementById("country_input");
      const citySelector = document.getElementById("city-selector");
      const citiesInput = document.getElementById("cities");
      const cityError = document.getElementById("city-error");
      const form = document.querySelector("form");
  

      if (citiesInput && citiesInput.value.trim() !== "") {
        selectedCities = citiesInput.value.split(",").map(city => city.trim());
      }
  
      // Initialize country autocomplete
      if (countryInput && typeof google !== "undefined" && google.maps && google.maps.places) {
        let countryAutocomplete = new google.maps.places.Autocomplete(countryInput, {
          types: ["(regions)"]
        });
        countryAutocomplete.addListener("place_changed", function() {
          let place = countryAutocomplete.getPlace();
          if (place && place.address_components) {
            let countryComponent = place.address_components.find(component =>
              component.types.includes("country")
            );
            selectedCountryCode = countryComponent ? countryComponent.short_name : null;
            countryHiddenInput.value = place.formatted_address || place.name;
            if (cityError) cityError.textContent = "";
            if (citySelector) citySelector.disabled = false;
          }
        });
      }
  
    // Initialize city autocomplete
if (citySelector && typeof google !== "undefined" && google.maps && google.maps.places) {
    let cityAutocomplete = new google.maps.places.Autocomplete(citySelector, {
      types: ["(cities)"]
    });
    cityAutocomplete.addListener("place_changed", function() {
      let place = cityAutocomplete.getPlace();
      if (!place || !place.address_components) return;
      let cityName = place.name;
      let cityCountryComponent = place.address_components.find(component =>
        component.types.includes("country")
      );
      if (!cityCountryComponent) {
        citySelector.value = "";
        citySelector.focus();
        return;
      }
      let cityCountryCode = cityCountryComponent.short_name;
      if (!selectedCountryCode) {
        if (cityError) cityError.textContent = "Please select a country first.";
        citySelector.value = "";
        citySelector.focus();
        return;
      }
      if (cityCountryCode !== selectedCountryCode) {
        if (cityError) cityError.textContent = `Please select a city in ${countryInput.value}.`;
        citySelector.value = "";
        citySelector.focus();
        return;
      }
     
      if (cityError) cityError.textContent = "";
      if (!selectedCities.includes(cityName)) {
        selectedCities.push(cityName);
      }
    
      citiesInput.value = selectedCities.join(", ");
      citySelector.value = "";
      citySelector.focus();
    });
    
    citySelector.addEventListener("blur", function() {
      setTimeout(() => {
        citySelector.focus();
      }, 0);
    });
  }
  
  
      if (form) {
        form.addEventListener("submit", function() {
          countryHiddenInput.value = countryInput.value;
          console.log("Submitting with cities:", citiesInput.value);
        });
      }
    });
  })();
