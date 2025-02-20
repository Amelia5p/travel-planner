from django.contrib import admin
from .models import Trip 

# Register your models here.

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("trip_name", "user", "country", "start_date", "end_date", "budget")
    search_fields = ("trip_name", "country", "user__username")
    list_filter = ("country", "start_date", "end_date")