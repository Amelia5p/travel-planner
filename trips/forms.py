from django import forms
from .models import Trip, TripLocation
from datetime import timedelta


class TripForm(forms.ModelForm):
    class Meta:
          model = Trip
          fields= ['trip_name', 'start_date', 'end_date']
          widgets= {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
          }

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        
        if start_date and end_date and end_date < start_date:
            raise forms.ValidationError("End date cannot be before start date")
        
        return cleaned_data
    
class TripLocationForm(forms.ModelForm):
     class Meta:
          model= TripLocation
          fields= ['country', 'cities']



