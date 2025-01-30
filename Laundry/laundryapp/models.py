from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student', blank=True, null=True)
    name = models.CharField(max_length=50)
    roll_no = models.CharField(max_length=8, unique=True)
    email = models.EmailField(max_length=100, unique=True, blank=True, null=True)
    role = models.CharField(max_length=7, default='student', editable=False)
    password = models.CharField(max_length=50, default='', null=False, blank=False)

    def save(self, *args, **kwargs):
        if not self.user_id:  
            user, created = User.objects.get_or_create(
                username=self.email,  
                defaults={'email': self.email}
            )
            user.set_password(self.password)  
            user.save() 
            self.user = user
        else:
            self.user.username = self.email 
            self.user.email = self.email
            self.user.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.roll_no})"


class LaundrySlip(models.Model):
    STATUS_CHOICES = [
        ('not done', 'Not Done'),
        ('ready', 'Ready'),
        ('done', 'Done'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='laundry_slips')
    date_issued = models.DateTimeField(auto_now_add=True)
    particulars = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not done')
    issue = models.TextField(null=True, blank=True)
    def __str__(self):
        return f"Slip for {self.student.name} ({self.date_issued.date()})"



class Worker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker', blank=True, null=True)
    name = models.CharField(max_length=50)
    contact = models.CharField(max_length=10)
    email = models.EmailField(max_length=100, unique=True)
    assigned_slips = models.ManyToManyField(LaundrySlip, blank=True, related_name='workers')
    role = models.CharField(max_length=7, default='worker', editable=False)
    password = models.CharField(max_length=50, default='', null=False, blank=False)

    def save(self, *args, **kwargs):
        if not self.user_id:
            user, created = User.objects.get_or_create(
                username=self.email, 
                defaults={'email': self.email}
            )
            user.set_password(self.password)  
            user.save() 
            self.user = user
        else:
            self.user.username = self.email  
            self.user.email = self.email
            self.user.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.contact})"
