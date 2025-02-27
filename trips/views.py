from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from .models import Trip
from .forms import TripForm

@login_required
def create_trip(request):
    """ Create trip view, save to database, and redirect to My Trips page. """
    google_api_key = settings.GOOGLE_PLACES_API_KEY  

    if request.method == "POST":
        form = TripForm(request.POST)
        if form.is_valid():
            trip = form.save(commit=False)  
            trip.user = request.user 
            trip.save()  
            messages.success(request, "Trip Saved!")  
            return redirect("my_trips") 
        else:
            messages.error(request, "There was an error saving your trip.")

    else:
        form = TripForm()

    return render(request, "trips/create_trip.html", {
        "form": form,
        "google_api_key": google_api_key,
    })


@login_required
def my_trips(request):
    """Allow users to view their trips on dashboard """
    trips = Trip.objects.filter(user=request.user).order_by("-start_date")
    return render(request, "trips/my_trips.html", {"trips": trips})

@login_required
def trip_detail(request, trip_id):
    """Allow users to view trip details"""
    trip = Trip.objects.get(id=trip_id, user=request.user)  
    return render(request, "trips/trip_detail.html", {"trip": trip})

