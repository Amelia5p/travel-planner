from django.db import models
from django.contrib.auth.models import User   

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.PositiveBigIntegerField(null=True, blank=True)
    location = models.CharField(max_length= 50, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

