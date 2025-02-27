from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name= "trips")
    trip_name = models.CharField(max_length=300)
    country = models.CharField(max_length=100)
    cities = models.TextField(help_text="Enter city names separated by ',")
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    accommodation_name = models.CharField(max_length=255, null=True, blank=True)
    accommodation_type = models.CharField(
        max_length=50,
        choices=[("Hotel", "Hotel"), ("Airbnb", "Airbnb"), ("Hostel", "Hostel"), ("Other", "Other")],
        default="Hotel"
    )

   
    transport_mode= models.CharField(
        max_length=50, 
        choices =[("Flight","Flight"),("Train","Train"),("Bus","Bus"),("Car/Taxi","Car,Taxi")],
        default="Flight"
    )

    itinerary = models.TextField(null=True, blank=True, help_text="Enter itinerary details for each day.")


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.trip_name} ({self.country})"

