from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required


# Create your views here.

# Sign up view, if the form is valid the user will be saved,
# Automatically logged in, redirected to profile page.


def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('profile')
    else:
        form = UserCreationForm()
    
    return render(request, 'users/signup.html', {'form': form})  

@login_required 
def profile(request):
    return render(request, 'users/profile.html')


def home(request):
    return render(request, 'home.html')
