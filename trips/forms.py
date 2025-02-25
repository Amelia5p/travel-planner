from django import forms
from .models import Trip

class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ["trip_name", "country", "cities", "start_date", "end_date", "budget", 
                  "accommodation_name", "accommodation_type", "transport_mode", 
                  "itinerary"]
        widgets = {
            "start_date": forms.DateInput(attrs={"type": "date"}),
            "end_date": forms.DateInput(attrs={"type": "date"}),
            "cities": forms.TextInput(attrs={"placeholder": "Enter cities separated by commas"}),
            "itinerary": forms.Textarea(attrs={"rows": 3}),
        }