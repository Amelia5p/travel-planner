from django.shortcuts import render, get_object_or_404, redirect
from formtools.wizard.views import SessionWizardView
from .forms import TripForm,TripLocationForm,TripDetailsForm, TripBudgetForm, ItineraryDayForm
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Trip
from django.contrib.auth.decorators import login_required
from django.contrib import messages

# Create Trip View 
class PlanningWizardView(SessionWizardView):
    form_list= [TripForm,TripLocationForm,TripDetailsForm,TripBudgetForm,ItineraryDayForm]
    template_name = 'trips/create_trip.html'
# Save trip
    def done(self, form_list, **kwargs):
        user = self.request.user 
               
        trip_form = form_list[0]
        trip_location_form = form_list[1]
        trip_details_form = form_list[2]
        trip_budget_form = form_list[3]
        itinerary_day_form = form_list[4]

        
        trip = trip_form.save(commit=False)
        trip.user = user  
        trip.save()

     
        trip_location = trip_location_form.save(commit=False)
        trip_location.trip = trip
        trip_location.save()

        trip_details = trip_details_form.save(commit=False)
        trip_details.trip = trip
        trip_details.save()

        trip_budget = trip_budget_form.save(commit=False)
        trip_budget.trip = trip
        trip_budget.save()

        itinerary_day = itinerary_day_form.save(commit=False)
        itinerary_day.trip = trip
        itinerary_day.save()

        return redirect('my_trips')


@login_required
def my_trips(request):
    """Display the user's saved trips."""
    user_trips = Trip.objects.filter(user=request.user).order_by('-start_date')
    return render(request, 'trips/my_trips.html', {'trips': user_trips})


@login_required
def delete_trip(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)

    if request.method == 'POST':
        trip.delete()
        messages.success(request, "Your trip has been deleted successfully.")  
        return redirect('my_trips')

    return render(request, 'trips/delete_trip.html', {'trip': trip})














