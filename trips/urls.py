from django.urls import path
from .views import (
    PlanningWizardView,
    my_trips,
    delete_trip,
    trip_details,
    EditTripWizardView,
    all_trips,
    suggest_activity,
)

urlpatterns = [
    path(
        'create/',
        PlanningWizardView.as_view(),
        name='create_trip'
        ),
    path(
        'my-trips/',
        my_trips,
        name='my_trips'
        ),
    path(
        'delete/<int:trip_id>/',
        delete_trip,
        name='delete_trip'
        ),
    path(
        'trip_details/<int:trip_id>/',
        trip_details,
        name='trip_details'
        ),
    path(
        'trip/edit/<int:trip_id>/',
        EditTripWizardView.as_view(),
        name='edit_trip_wizard'
        ),
    path(
        'admin/all_trips/',
        all_trips,
        name='all_trips'
        ),
    path(
        'itinerary_day/<int:day_id>/suggest_activity/',
        suggest_activity,
        name='suggest_activity'
        ),
]
