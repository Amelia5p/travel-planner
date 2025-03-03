from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from .models import Trip
from .forms import TripForm



@login_required
def create_trip(request):
    """Create trip view, save to database, and redirect to My Trips page."""
    if request.method == 'POST':
        form = TripForm(request.POST)
        if form.is_valid():
            trip = form.save(commit=False)
            trip.user = request.user
            trip.save()
            messages.success(request, "Trip created successfully!")
            return redirect('my_trips')  # Assuming you have a 'my_trips' URL pattern
    else:
        form = TripForm()
    
    context = {
        'form': form,
        'editing': False,
        'google_api_key': settings.GOOGLE_PLACES_API_KEY
    }
    return render(request, 'trips/create_trip.html', context)

@login_required
def edit_trip(request, trip_id):
    """Edit an existing trip."""
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    if request.method == 'POST':
        form = TripForm(request.POST, instance=trip)
        if form.is_valid():
            form.save()
            messages.success(request, "Trip updated successfully!")
            return redirect('my_trips')
    else:
        form = TripForm(instance=trip)
    
    context = {
        'form': form,
        'editing': True,
        'google_api_key': settings.GOOGLE_MAPS_API_KEY if hasattr(settings, 'GOOGLE_MAPS_API_KEY') else None
    }
    return render(request, 'trips/create_trip.html', context)



