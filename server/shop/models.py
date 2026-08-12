from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# py manage.py shell  -to open django shell
# from django.contrib.auth.models import User; User.objects.all().delete()  -to delete all users
# quit() exit() To exit shell screen 

# Authentication
class Profile(models.Model):
    USER = 'user'
    VENDOR = 'vendor'

    ROLE_CHOICES = [
        (USER, 'User'),
        (VENDOR, 'Vendor'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=USER
    )

    def __str__(self):
        return self.user.username 


# Floors
class Floor(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Apartments

class Apartment(models.Model):

    AVAILABLE = 'available'
    OCCUPIED = 'occupied'
    MAINTENANCE = 'maintenance'

    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (OCCUPIED, 'Occupied'),
        (MAINTENANCE, 'Maintenance'),
    ]

    name = models.CharField(max_length=100)
    floor = models.ForeignKey(
        Floor,
        on_delete=models.CASCADE,
        related_name='apartments'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=AVAILABLE
    )
    partitions = models.BooleanField(default=False)
    complete = models.BooleanField(default=False)
    partitions_no = models.PositiveIntegerField(default=0)

    monthly = models.BooleanField(default=False)
    daily = models.BooleanField(default=False)
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    
    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return self.name




# Partitions
class Partition(models.Model):

    name = models.CharField(max_length=100)

    apartment = models.ForeignKey(
        Apartment,
        on_delete=models.CASCADE,
        related_name='partition_item'
    )

    daily = models.BooleanField(default=False)
    monthly = models.BooleanField(default=False)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return self.name
