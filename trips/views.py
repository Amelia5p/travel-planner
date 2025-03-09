from django.shortcuts import render, get_object_or_404, redirect
from formtools.wizard.views import SessionWizardView
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from .forms import TripForm, TripLocationForm, TripDetailsForm, TripBudgetForm, ItineraryDayFormSet, ActivitySuggestionForm
from .models import Trip, TripLocation, TripDetails, TripBudget, ItineraryDay
from django.forms import inlineformset_factory
from .models import Trip, ItineraryDay
from .forms import TripForm, ItineraryDayFormSet
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Max


class PlanningWizardView(LoginRequiredMixin,SessionWizardView):
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
            prefix = self.get_form_prefix(step)  

            if data:
                return ItineraryDayFormSet(data, instance=trip, prefix=prefix)
            return ItineraryDayFormSet(instance=trip, prefix=prefix)

        return super().get_form(step, data, files)

    
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
    
        # Save the formset
        if itinerary_formset.is_valid():
            instances = itinerary_formset.save(commit=False)
            for instance in instances:
                instance.trip = trip
                instance.save()
        else:
           
            print(itinerary_formset.errors)
    
        messages.success(self.request, "Your trip has been successfully created!")
        return redirect('my_trips')
        
    def get_trip(self):
        """ Fetch the trip instance for editing or creating. """
        if not hasattr(self, 'trip'):
            trip_id = self.kwargs.get('trip_id')
            if trip_id:
                self.trip = get_object_or_404(Trip, id=trip_id, user=self.request.user)
            else:
                # Create a new trip if no trip exists
                self.trip = Trip(user=self.request.user)
        return self.trip

# Trip details
@login_required
def trip_details(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id)

    if trip.user != request.user and not request.user.groups.filter(name='Admin').exists():
        raise Http404("You do not have permission to view this trip.")

    formset = ItineraryDayFormSet(request.POST or None, instance=trip)

    if request.method == "POST":
        if formset.is_valid():
            instances = formset.save(commit=False)
            for instance in instances:
                instance.trip = trip

                if not instance.day_number:
                    max_day = trip.itinerary_days.aggregate(Max('day_number'))['day_number__max'] or 0
                    instance.day_number = max_day + 1

                instance.save()

            formset.save_m2m()
            return redirect("trip_details", trip_id=trip.id)

    itinerary_days = trip.itinerary_days.all().order_by('day_number')
    is_admin = request.user.groups.filter(name='Admin').exists()

    return render(
        request,
        "trips/trip_details.html",
        {
            "trip": trip,
            "itinerary_days": itinerary_days,
            "formset": formset,
            "is_admin": is_admin
        }
    )

 #My Trips View
@login_required
def my_trips(request):
    """Display the user's saved trips."""
    user_trips = Trip.objects.filter(user=request.user).order_by('created_at')
    return render(request, 'trips/my_trips.html', {'trips': user_trips})



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
class EditTripWizardView(LoginRequiredMixin, SessionWizardView):
    form_list = [
        ('0', TripForm),
        ('1', TripLocationForm),
        ('2', TripDetailsForm),
        ('3', TripBudgetForm),
        ('4', ItineraryDayFormSet)  
    ]
    template_name = 'trips/edit_trip.html'

    def get_form(self, step=None, data=None, files=None):
        if step is None:
            step = self.steps.current

        if step == '4':  
            trip = self.get_trip()
            prefix = self.get_form_prefix(step)

            if data:
                formset = ItineraryDayFormSet(data, instance=trip, prefix=prefix)
            else:
                formset = ItineraryDayFormSet(instance=trip, prefix=prefix)

            return formset

        return super().get_form(step, data, files)


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
            
            for obj in itinerary_formset.deleted_objects:
                obj.delete()
        
        messages.success(self.request, "Your trip has been successfully updated!")
        return redirect('trip_details', trip_id=trip.id)


# Admin only view
@login_required
@user_passes_test(lambda u: u.groups.filter(name='Admin').exists())
def all_trips(request):
    trips = Trip.objects.all().order_by('-created_at')
    return render(request, 'trips/all_trips.html', {'trips': trips})

def is_admin(user):
    return user.groups.filter(name='Admin').exists()

@login_required
@user_passes_test(is_admin)
def suggest_activity(request, day_id):
    day = get_object_or_404(ItineraryDay, id=day_id)
    
    if request.method == "POST":
        form = ActivitySuggestionForm(request.POST)
        if form.is_valid():
            suggestion = form.save(commit=False)
            suggestion.itinerary_day = day
            suggestion.suggested_by = request.user
            suggestion.save()
            messages.success(request, "Activity suggestion added successfully!")
            return redirect('trip_details', trip_id=day.trip.id)
    else:
        form = ActivitySuggestionForm()

    return render(request, 'trips/suggest_activity.html', {'form': form, 'day': day})

