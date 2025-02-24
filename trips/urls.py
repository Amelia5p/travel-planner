from django.urls import path
from .views import create_trip, my_trips

urlpatterns = [
    path("create/", create_trip, name="create_trip"),  
    path("my-trips/", my_trips, name="my_trips"),  
    path("trip/<int:trip_id>/", trip_detail, name="trip_detail"),  
    path("trip/<int:trip_id>/edit/", trip_edit, name="trip_edit"),  
    path("trip/<int:trip_id>/delete/", trip_delete, name="trip_delete"),  
]
