# users/urls.py
from django.contrib.auth import views as auth_views
from django.urls import path
from . import views
from users.views import logout_view


urlpatterns = [

    path('login/', auth_views.LoginView.as_view(
        template_name='users/login.html'
        ), name='login'
        ),
    path('logout/', logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('profile/delete/', views.delete_profile, name='delete_profile'),
    path('signup/', views.signup, name='signup'),
    path('login/', auth_views.LoginView.as_view(
        template_name='users/login.html'
        ), name='login'),
    path('signup/', views.signup, name='signup'),
]
