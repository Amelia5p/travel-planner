from django.urls import path
from .views import PlanningWizardView

urlpatterns = [
    path('create-trip/', PlanningWizardView.as_view(), name='create_trip'),

]

