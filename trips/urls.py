from django.urls import path
from . import views


urlpatterns = [
    path('my-trips/', views.my_trips, name='my_trips'),  
    path('create/', views.create_trip, name='create_trip'),  
    path('trip/<int:trip_id>/', views.trip_detail, name='trip_detail'),
]
