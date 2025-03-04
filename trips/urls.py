from django.urls import path
from .views import PlanningWizardView, EditTripWizardView, my_trips, delete_trip, trip_details

urlpatterns = [
    path('create/', PlanningWizardView.as_view(), name='create_trip'),
    path('my-trips/', my_trips, name='my_trips'),
    path('delete/<int:trip_id>/', delete_trip, name='delete_trip'),
    path('trip_details/<int:trip_id>/', trip_details, name='trip_details'),
    path('trip/edit/<int:trip_id>/', EditTripWizardView.as_view(), name='edit_trip_wizard'),
]