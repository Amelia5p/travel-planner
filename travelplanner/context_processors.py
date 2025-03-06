
def admin_status(request):
    is_admin = request.user.groups.filter(name='Admin').exists() if request.user.is_authenticated else False
    return {'is_admin': is_admin}

