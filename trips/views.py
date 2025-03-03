from django.shortcuts import render
from formtools.wizard.views import SessionWizardView
from .forms import TripForm,TripLocationForm
from django.http import HttpResponse

class PlanningWizardView(SessionWizardView):
    form_list= [TripForm,TripLocationForm]
    template_name = 'trips/create_trip.html'

    def done(self, form_list, **kwargs):
        return HttpResponse("form submitted!")


