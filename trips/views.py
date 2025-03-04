from django.shortcuts import render, get_object_or_404, redirect
from formtools.wizard.views import SessionWizardView
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import TripForm, TripLocationForm, TripDetailsForm, TripBudgetForm, ItineraryDayFormSet
from .models import Trip, TripLocation, TripDetails, TripBudget, ItineraryDay

class PlanningWizardView(SessionWizardView):
    form_list = [
        ('0', TripForm),
        ('1', TripLocationForm),
        ('2', TripDetailsForm),
        ('3', TripBudgetForm),
        ('4', ItineraryDayFormSet)
    ]
    template_name = 'trips/create_trip.html'

    def get_form(self, step=None, data=None, files=None):
        form = None
        
        if step is None:
            step = self.steps.current
            
        if step == '4':  # Itinerary formset step
            # For the formset step, we need special handling
            if data:
                form = ItineraryDayFormSet(data, prefix=self.get_form_prefix(step))
            else:
                form = ItineraryDayFormSet(prefix=self.get_form_prefix(step))
            return form
        
        return super().get_form(step, data, files)
    
    def get_context_data(self, form, **kwargs):
        context = super().get_context_data(form=form, **kwargs)
        
        # Add indication if we're on the formset step
        if self.steps.current == '4':
            context['is_formset'] = True
        
        return context

    def done(self, form_list, **kwargs):
        """ Save all forms and formsets properly """
        user = self.request.user 
        
        # Get all form data
        form_data = [form.cleaned_data for form in form_list[:4]]
        
     
        trip_form_data = form_data[0]
        trip_location_form_data = form_data[1]
        trip_details_form_data = form_data[2]
        trip_budget_form_data = form_data[3]
        itinerary_formset = form_list[4] 
        
       
        trip = Trip.objects.create(
            user=user,
            trip_name=trip_form_data['trip_name'],
            start_date=trip_form_data['start_date'],
            end_date=trip_form_data['end_date']
        )
        
      
        TripLocation.objects.create(
            trip=trip,
            country=trip_location_form_data['country'],
            cities=trip_location_form_data['cities']
        )
        
        # Create and save TripDetails
        TripDetails.objects.create(
            trip=trip,
            accommodation_type=trip_details_form_data['accommodation_type'],
            transport_type=trip_details_form_data['transport_type']
        )
        
        # Create and save TripBudget
        TripBudget.objects.create(
            trip=trip,
            budget=trip_budget_form_data['budget']
        )
        
        # Get the formset data and save it
        itinerary_formset = self.get_form(
            step='4',
            data=self.storage.get_step_data('4'),
            files=self.storage.get_step_files('4')
        )
        
        if itinerary_formset.is_valid():
            # Link each form in the formset to the trip
            instances = itinerary_formset.save(commit=False)
            for instance in instances:
                instance.trip = trip
                instance.save()
        
        messages.success(self.request, "Your trip has been successfully created!")
        return redirect('my_trips')



@login_required
def my_trips(request):
    """Display the user's saved trips."""
    user_trips = Trip.objects.filter(user=request.user).order_by('created_at')
    return render(request, 'trips/my_trips.html', {'trips': user_trips})

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.forms import inlineformset_factory
from .models import Trip, ItineraryDay
from .forms import TripForm, ItineraryDayFormSet

@login_required
def trip_details(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    # Create an inline formset for ItineraryDay linked to the Trip
    ItineraryDayFormSet = inlineformset_factory(
        Trip, ItineraryDay,
        fields=['day_number', 'date', 'morning', 'afternoon', 'evening'],
        extra=1,  # Only one extra form at a time
        can_delete=True
    )
    
    formset = ItineraryDayFormSet(request.POST or None, instance=trip)

    if request.method == "POST":
        if formset.is_valid():
            # Save all instances, linking to the trip
            instances = formset.save(commit=False)
            for instance in instances:
                # Ensure the instance is linked to the trip
                instance.trip = trip
                
                # If no day number is set, auto-assign next number
                if not instance.day_number:
                    max_day = trip.itinerary_days.aggregate(models.Max('day_number'))['day_number__max'] or 0
                    instance.day_number = max_day + 1
                
                instance.save()
            
            formset.save_m2m()
            return redirect("trip_details", trip_id=trip.id)

    # Retrieve all itinerary days for display
    itinerary_days = trip.itinerary_days.all().order_by('day_number')

    return render(
        request, 
        "trips/trip_details.html", 
        {"trip": trip, "itinerary_days": itinerary_days, "formset": formset}
    )





@login_required
def delete_trip(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)

    if request.method == 'POST':
        trip.delete()
        messages.success(request, "Your trip has been deleted successfully.")  
        return redirect('my_trips')

    return render(request, 'trips/delete_trip.html', {'trip': trip})













