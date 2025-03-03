from django import forms
from .models import Trip
from django.core.exceptions import ValidationError
from datetime import date

class TripForm(forms.ModelForm):
    """Form for creating and editing Trip objects."""
    
    class Meta:
        model = Trip
        fields = [
            'trip_name', 
            'country', 
            'cities', 
            'start_date', 
            'end_date', 
            'budget',
            'accommodation_name',
            'accommodation_type',
            'transport_mode',
            'itinerary'
        ]
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'cities': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Enter cities separated by commas'}),
            'itinerary': forms.Textarea(attrs={'rows': 5, 'placeholder': 'Enter your day-by-day itinerary'})
        }
        
    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        
        if start_date and end_date:
            if start_date > end_date:
                raise ValidationError("End date should be after start date.")
            
            if start_date < date.today():
                raise ValidationError("Start date cannot be in the past.")
                
        return cleaned_data