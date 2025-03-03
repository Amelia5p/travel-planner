from django.contrib import admin
# from .models import Trip, TripLocation, TripDetails, TripBudget, ItineraryDay

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'start_date', 'end_date', 'created_at')
    search_fields = ('name', 'user__username')
    list_filter = ('start_date', 'end_date', 'user')

@admin.register(TripLocation)
class TripLocationAdmin(admin.ModelAdmin):
    list_display = ('trip', 'country', 'cities')
    search_fields = ('country', 'cities')

@admin.register(TripDetails)
class TripDetailsAdmin(admin.ModelAdmin):
    list_display = ('trip', 'accommodation_type', 'transport_type')
    list_filter = ('accommodation_type', 'transport_type')

@admin.register(TripBudget)
class TripBudgetAdmin(admin.ModelAdmin):
    list_display = ('trip', 'budget')

@admin.register(ItineraryDay)
class ItineraryDayAdmin(admin.ModelAdmin):
    list_display = ('trip', 'day_number', 'date')
    list_filter = ('trip',)
    ordering = ('trip', 'day_number')
