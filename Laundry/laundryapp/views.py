from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,logout
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from .models import Student, Worker, LaundrySlip
from .serializers import LaundrySlipSerializer, StudentSerializer, WorkerSerializer
from django.http import HttpResponse



@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access this view
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Authenticate user using email as username
    user = authenticate(username=email, password=password)

    if not user:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({"error": "User account is disabled"}, status=status.HTTP_403_FORBIDDEN)

    # Determine user role
    role = None
    if hasattr(user, 'student'):
        role = 'student'
    elif hasattr(user, 'worker'):
        role = 'worker'
    else:
        return Response({"error": "User is not assigned to any role"}, status=status.HTTP_400_BAD_REQUEST)

    # Generate or retrieve token
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "role": role,
        "name": user.username  # Optional: Return user info if needed
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_slip(request):
    roll_no = request.data.get('roll_no')
    particulars = request.data.get('particulars')

    if not particulars or not isinstance(particulars, dict):
        return Response({"error": "Invalid particulars"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student = Student.objects.get(roll_no=roll_no)
        slip = LaundrySlip.objects.create(student=student, particulars=particulars)
        return Response({"message": "Slip created successfully", "slip_id": slip.id}, status=status.HTTP_201_CREATED)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def update_slip_status(request, slip_id):
    new_status = request.data.get('status')

    if new_status not in [choice[0] for choice in LaundrySlip.STATUS_CHOICES]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        slip = LaundrySlip.objects.get(id=slip_id)
        if not hasattr(request.user, 'worker'):
            return Response({"error": "Only workers can update the status"}, status=status.HTTP_403_FORBIDDEN)

        slip.status = new_status
        slip.save()
        return Response({"message": "Slip status updated", "new_status": slip.status}, status=status.HTTP_200_OK)
    except LaundrySlip.DoesNotExist:
        return Response({"error": "Slip not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def slip_list(request):
    if hasattr(request.user, 'student'):
        slips = LaundrySlip.objects.filter(student=request.user.student)
    elif hasattr(request.user, 'worker'):
        print('slip_list')
        slips = LaundrySlip.objects.all()
    else:
        return Response({"error": "Invalid role"}, status=status.HTTP_403_FORBIDDEN)

    serializer = LaundrySlipSerializer(slips, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_particulars(request):
    slip_id = request.data.get('slip_id')
    updated_particulars = request.data.get('particulars')

    if not updated_particulars or not isinstance(updated_particulars, dict):
        return Response({"error": "Invalid particulars"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        slip = LaundrySlip.objects.get(id=slip_id)
        slip.particulars = updated_particulars
        slip.save()
        return Response({"message": "Particulars updated successfully"}, status=status.HTTP_200_OK)
    except LaundrySlip.DoesNotExist:
        return Response({"error": "Slip not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_slip_details(request, slip_id):
    try:
        slip = LaundrySlip.objects.get(id=slip_id)
        slip_data = {
            "id": slip.id,
            "student": {
                "roll_no": slip.student.roll_no,
                "name": slip.student.name,
            },
            "particulars": slip.particulars,
            "status": slip.status,
            "created_at": slip.date_issued,
            "issue": slip.issue, 
        }
        return Response(slip_data, status=status.HTTP_200_OK)
    except LaundrySlip.DoesNotExist:
        return Response({"error": "Slip not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user

    if hasattr(user,'student'):
        profile = StudentSerializer(user.student).data
        role = 'student'

    elif hasattr(user, 'worker'):
        profile = WorkerSerializer(user.worker).data
        role = 'worker'
    
    else:
        return Response({"error": "Invalid role"}, status=status.HTTP_403_FORBIDDEN)

    return Response({
        "role": role,
        "profile": profile
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
    except:
        return Response({"error": "Invalid token"},status=status.HTTP_403_FORBIDDEN)

    logout(request._request)
    return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_issue(request, slip_id):
    try:
        slip = LaundrySlip.objects.get(id=slip_id)
        if slip.student.user != request.user:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        issue = request.data.get('issue', '').strip()
        if not issue:
            return Response({"error": "Issue description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        slip.issue = issue
        slip.save()

        return Response({"message": "Issue reported successfully"}, status=status.HTTP_200_OK)
    except LaundrySlip.DoesNotExist:
        return Response({"error": "Slip not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def home(request):
     return HttpResponse("Welcome to the Laundry Management System!")
