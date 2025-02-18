from django import forms
from .models import Profile

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model= Profile
        fields= ['age','location','bio']
        widgets = {
                    'bio': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
                    'location': forms.TextInput(attrs={'class': 'form-control'}),
                    'age': forms.NumberInput(attrs={'class': 'form-control'}),
                }
