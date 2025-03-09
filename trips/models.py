from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete =models.CASCADE, related_name= 'trips')
    trip_name = models.CharField(max_length=255, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.trip_name} ({self.start_date} to {self.end_date})"
    
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1
    
class TripLocation(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='location')
    country = models.CharField(max_length=100)
    cities = models.TextField(blank=True)

    def get_cities_list(self):
        return [city.strip() for city in self.cities.split(',')]
    
    
    def __str__(self):
        return f"{self.country}: {self.cities}"
    
class TripDetails(models.Model):
        
    ACCOMMODATION_CHOICES = [
        ('hotel', 'Hotel'),
        ('hostel', 'Hostel'),
        ('airbnb', 'Airbnb'),
        ('camping', 'Camping'),
        ('other', 'Other'),
    ]
    
    TRANSPORT_CHOICES = [
        ('car', 'Car'),
        ('plane', 'Plane'),
        ('train', 'Train'),
        ('bus', 'Bus'),
        ('walking', 'Walking'),
        ('other', 'Other'),
    ]

    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='details')
    accommodation_type = models.CharField(max_length=100, choices=ACCOMMODATION_CHOICES)
    transport_type = models.CharField(max_length=100, choices=TRANSPORT_CHOICES)

    def __str__(self):
        return f"Details for {self.trip.trip_name}"

class TripBudget(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='budget')
    budget= models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.budget} for {self.trip.trip_name}"


class ItineraryDay(models.Model):
    trip = models.ForeignKey(Trip, on_delete= models.CASCADE, related_name='itinerary_days')
    day_number = models.PositiveIntegerField(null=False, blank=False, default=1)
    date = models.DateField(null=True, blank=True)
    morning = models.TextField(blank=True, null=True)
    afternoon = models.TextField(blank=True, null=True)
    evening = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['day_number']
        unique_together = ['trip', 'day_number']
    
    
    def __str__(self):
        return f"Day {self.day_number} of {self.trip.trip_name}"

class ActivitySuggestion(models.Model):
    itinerary_day = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE, related_name='suggestions')
    suggested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    suggestion = models.TextField()

    def __str__(self):
        return f"Suggestion for Day {self.itinerary_day.day_number}: {self.suggestion[:20]}"
