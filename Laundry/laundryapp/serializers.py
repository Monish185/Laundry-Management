from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, LaundrySlip, Worker

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'name', 'roll_no', 'email', 'role']

# LaundrySlip Serializer
class LaundrySlipSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = LaundrySlip
        fields = ['id', 'student', 'date_issued', 'particulars', 'status','issue']

# Worker Serializer
class WorkerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_slips = LaundrySlipSerializer(many=True, read_only=True)

    class Meta:
        model = Worker
        fields = ['id', 'user', 'name', 'contact', 'email', 'assigned_slips', 'role']