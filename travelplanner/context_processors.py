from django.conf import settings

def google_maps_api_key(request):
    return {'GOOGLE_PLACES_API_KEY': settings.GOOGLE_PLACES_API_KEY}



def admin_status(request):
    is_admin = request.user.groups.filter(name='Admin').exists() if request.user.is_authenticated else False
    return {'is_admin': is_admin}

