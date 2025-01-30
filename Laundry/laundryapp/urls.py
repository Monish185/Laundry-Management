from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_user, name="login_user"),
    path("create-slip/", views.create_slip, name="create_slip"),
    path("update-slip-status/<int:slip_id>/", views.update_slip_status, name="update_slip_status"),
    path("slip-list/", views.slip_list, name="slip_list"),
    path("edit-particulars/", views.edit_particulars, name="edit_particulars"),
    path('get-slip-details/<int:slip_id>/', views.get_slip_details, name='get-slip-details'),
    path('profile/',views.get_profile, name="profile"),
    path('logout/', views.logout, name='logout_user'),
    path('report-issue/<int:slip_id>/', views.report_issue, name='report_issue'),
]
