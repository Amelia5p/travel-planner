from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from .models import Trip
from .forms import TripForm


# Create your views here.
def create_trip(request):
    """ Create trip view, if the form is valid the trip will be saved,
        Redirected to dashboard. 
    """
    if request.method == "POST":
        form = TripForm(request.POST)
        if form.is_valid():
            trip = form.save()
            trip.user = request.user
            trip.save()
            messages.success(request, "Trip Saved!")
        return redirect("trip_dashboard")
    else:
        form = TripForm()

       
    google_api_key = settings.GOOGLE_PLACES_API_KEY  

    return render(request, "trips/create_trip.html", {
        "form": form,
        "google_api_key": google_api_key,
    })
