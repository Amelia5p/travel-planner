from django.shortcuts import render, get_object_or_404, redirect
from formtools.wizard.views import SessionWizardView
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import TripForm, TripLocationForm, TripDetailsForm, TripBudgetForm, ItineraryDayFormSet
from .models import Trip, TripLocation, TripDetails, TripBudget, ItineraryDay
from django.forms import inlineformset_factory
from .models import Trip, ItineraryDay
from .forms import TripForm, ItineraryDayFormSet
from django.contrib.auth.mixins import LoginRequiredMixin


# Create trip views
class PlanningWizardView(LoginRequiredMixin, SessionWizardView):

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
            
        if step == '4':  
            
            if data:
                form = ItineraryDayFormSet(data, prefix=self.get_form_prefix(step))
            else:
                form = ItineraryDayFormSet(prefix=self.get_form_prefix(step))
            return form
        
        return super().get_form(step, data, files)
    
    def get_context_data(self, form, **kwargs):
        context = super().get_context_data(form=form, **kwargs)
        
        
        if self.steps.current == '4':
            context['is_formset'] = True
        
        return context

    def done(self, form_list, **kwargs):
        
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
    
# My Trips View
@login_required
def my_trips(request):
    """Display the user's saved trips."""
    user_trips = Trip.objects.filter(user=request.user).order_by('created_at')
    return render(request, 'trips/my_trips.html', {'trips': user_trips})

# Trip details view
@login_required
def trip_details(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    
    ItineraryDayFormSet = inlineformset_factory(
        Trip, ItineraryDay,
        fields=['day_number','morning', 'afternoon', 'evening'],
        extra=1,  
        can_delete=True
    )
    
    formset = ItineraryDayFormSet(request.POST or None, instance=trip)

    if request.method == "POST":
        if formset.is_valid():
           
            instances = formset.save(commit=False)
            for instance in instances:
               
                instance.trip = trip
                
               
                if not instance.day_number:
                    max_day = trip.itinerary_days.aggregate(models.Max('day_number'))['day_number__max'] or 0
                    instance.day_number = max_day + 1
                
                instance.save()
            
            formset.save_m2m()
            return redirect("trip_details", trip_id=trip.id)

    
    itinerary_days = trip.itinerary_days.all().order_by('day_number')

    return render(
        request, 
        "trips/trip_details.html", 
        {"trip": trip, "itinerary_days": itinerary_days, "formset": formset}
    )

# Delete trip view
@login_required
def delete_trip(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)

    if request.method == 'POST':
        trip.delete()
        messages.success(request, "Your trip has been deleted successfully.")  
        return redirect('my_trips')

    return render(request, 'trips/delete_trip.html', {'trip': trip})

# Edit Trip View

ItineraryDayFormSet = inlineformset_factory(
    Trip, ItineraryDay,
    fields=['day_number', 'morning', 'afternoon', 'evening'],
    extra=0, 
    can_delete=True
)

class EditTripWizardView(LoginRequiredMixin, SessionWizardView):
    form_list = [
        ('0', TripForm),
        ('1', TripLocationForm),
        ('2', TripDetailsForm),
        ('3', TripBudgetForm),
        ('4', ItineraryDayFormSet)  
    ]
    template_name = 'trips/create_trip.html'

    def get_form(self, step=None, data=None, files=None):
        if step is None:
            step = self.steps.current

        if step == '4':
            trip = self.get_trip()
            if data:
                return ItineraryDayFormSet(data, instance=trip, prefix=self.get_form_prefix(step))
            return ItineraryDayFormSet(instance=trip, prefix=self.get_form_prefix(step))

        return super().get_form(step, data, files)

    def get_context_data(self, form, **kwargs):
        context = super().get_context_data(form=form, **kwargs)
        
        if self.steps.current == '4':
            context['is_formset'] = True
        
        return context

    def get_trip(self):
        if not hasattr(self, 'trip'):
            trip_id = self.kwargs.get('trip_id')
            self.trip = get_object_or_404(Trip, id=trip_id, user=self.request.user)
        return self.trip

    def get_form_initial(self, step):
        trip = self.get_trip()

        if step == '0':
            return {
                'trip_name': trip.trip_name,
                'start_date': trip.start_date,
                'end_date': trip.end_date
            }
        elif step == '1':
            try:
                triplocation = TripLocation.objects.get(trip=trip)
                return {
                    'country': triplocation.country,
                    'cities': triplocation.cities
                }
            except TripLocation.DoesNotExist:
                return {}
        elif step == '2':
            try:
                tripdetails = TripDetails.objects.get(trip=trip)
                return {
                    'accommodation_type': tripdetails.accommodation_type,
                    'transport_type': tripdetails.transport_type
                }
            except TripDetails.DoesNotExist:
                return {}
        elif step == '3':
            try:
                tripbudget = TripBudget.objects.get(trip=trip)
                return {
                    'budget': tripbudget.budget
                }
            except TripBudget.DoesNotExist:
                return {}
        return {}

    def done(self, form_list, **kwargs):
        trip = self.get_trip()
        
       
        form_data = [form.cleaned_data for form in form_list[:4]]
        
        trip_form_data = form_data[0]
        trip_location_form_data = form_data[1]
        trip_details_form_data = form_data[2]
        trip_budget_form_data = form_data[3]
        itinerary_formset = form_list[4]
        
        trip.trip_name = trip_form_data['trip_name']
        trip.start_date = trip_form_data['start_date']
        trip.end_date = trip_form_data['end_date']
        trip.save()

        TripLocation.objects.update_or_create(
            trip=trip,
            defaults={
                'country': trip_location_form_data['country'],
                'cities': trip_location_form_data['cities']
            }
        )

        TripDetails.objects.update_or_create(
            trip=trip,
            defaults={
                'accommodation_type': trip_details_form_data['accommodation_type'],
                'transport_type': trip_details_form_data['transport_type']
            }
        )

        TripBudget.objects.update_or_create(
            trip=trip,
            defaults={
                'budget': trip_budget_form_data['budget']
            }
        )


        itinerary_formset = self.get_form(
            step='4',
            data=self.storage.get_step_data('4'),
            files=self.storage.get_step_files('4')
        )

        if itinerary_formset.is_valid():
            instances = itinerary_formset.save(commit=False)
            for instance in instances:
                instance.trip = trip
                instance.save()
        
        messages.success(self.request, "Your trip has been successfully updated!")
        return redirect('trip_details', trip_id=trip.id)
