from django import forms
from .models import Trip, TripLocation, TripDetails, TripBudget, ItineraryDay
from .models import ActivitySuggestion
from django.forms import inlineformset_factory, BaseInlineFormSet


class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ['trip_name', 'start_date', 'end_date']
        widgets = {
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
        model = TripLocation
        fields = ['country', 'cities']
        widgets = {
            'country': forms.TextInput(attrs={
                'id': 'country',
                'class': 'form-control',
                'autocomplete': 'country',
                'pattern': r"^[A-Za-z\s\-\'\.]+$",
                'title': 'Please enter a valid country name'
                '(letters, spaces, hyphens, apostrophes, and periods only)'
            }),
            'cities': forms.TextInput(attrs={
                'id': 'cities',
                'class': 'form-control',
                'autocomplete': 'address-level2',
                'pattern': r"^[A-Za-z\s\-\'\.,;]+$",
                'title': 'Please enter valid city names'
                '(letters, spaces, and basic punctuation only)'
            }),
        }


class TripDetailsForm(forms.ModelForm):
    class Meta:
        model = TripDetails
        fields = ['accommodation_type', 'transport_type']


class TripBudgetForm(forms.ModelForm):
    class Meta:
        model = TripBudget
        fields = ['budget']


class ItineraryDayForm(forms.ModelForm):
    class Meta:
        model = ItineraryDay
        fields = ['day_number', 'morning', 'afternoon', 'evening']
        widgets = {
            'morning': forms.Textarea(
                attrs={'rows': 3, 'class': 'form-control'}),
            'afternoon': forms.Textarea(
                attrs={'rows': 3, 'class': 'form-control'}),
            'evening': forms.Textarea(
                attrs={'rows': 3, 'class': 'form-control'}),
            'day_number': forms.NumberInput(
                attrs={'class': 'form-control'})
        }


ItineraryDayFormSet = inlineformset_factory(
    Trip,
    ItineraryDay,
    form=ItineraryDayForm,
    extra=1,
    can_delete=True
)


class BaseItineraryDayFormSet(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        super(BaseItineraryDayFormSet, self).__init__(*args, **kwargs)
        if self.instance.pk:
            if self.queryset.exists():
                self.extra = 0
            else:
                self.extra = 1


ItineraryDayFormSet = inlineformset_factory(
    Trip,
    ItineraryDay,
    formset=BaseItineraryDayFormSet,
    fields=['day_number', 'morning', 'afternoon', 'evening'],
    extra=1,
    can_delete=True
)


class ActivitySuggestionForm(forms.ModelForm):
    class Meta:
        model = ActivitySuggestion
        fields = ['suggestion']
        widgets = {
            'suggestion': forms.Textarea(
                attrs={'rows': 2, 'class': 'form-control'}),
        }
