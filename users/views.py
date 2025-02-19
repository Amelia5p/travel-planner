from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from .forms import ProfileUpdateForm
from django.contrib import messages 

# Create your views here.

# Sign up view, if the form is valid the user will be saved,
# Automatically logged in, redirected to profile page.


def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, "Profile created successfully!")
            login(request, user)
            return redirect('profile')
    else:
        form = UserCreationForm()
    
    return render(request, 'users/signup.html', {'form': form})  

# Profile view, renders profile HTML

@login_required 
def profile(request):
    return render(request, 'users/profile.html')

# Profile view, renders home HTML

def home(request):
    return render(request, 'home.html')

# Edit profile view, form
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Profile
from .forms import ProfileUpdateForm

@login_required  
def edit_profile(request):
   
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST': 
        form = ProfileUpdateForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfileUpdateForm(instance=profile)

    return render(request, 'users/edit_profile.html', {'form': form})

