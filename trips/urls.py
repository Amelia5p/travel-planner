from django.urls import path
from .views import PlanningWizardView,my_trips, delete_trip

urlpatterns = [
    path('create/', PlanningWizardView.as_view(), name='create_trip'),
    path('my-trips/', my_trips, name='my_trips'),
    path('delete/<int:trip_id>/', delete_trip, name='delete_trip'),
]



