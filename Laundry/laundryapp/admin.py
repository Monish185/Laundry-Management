from django.contrib import admin
from .models import Student,Worker,LaundrySlip

class StudentAdmin(admin.ModelAdmin):
    exclude = ('user',)  # Exclude user from the form

    def save_model(self, request, obj, form, change):
        if not obj.user:
            obj.save()  # Triggers the save method to create user
        super().save_model(request, obj, form, change)

admin.site.register(Student, StudentAdmin)

class WorkerAdmin(admin.ModelAdmin):
    exclude = ('user',)

    def save_model(self, request, obj, form, change):
        if not obj.user:
            obj.save()  
        super().save_model(request, obj, form, change)

admin.site.register(Worker, WorkerAdmin)


@admin.register(LaundrySlip)
class LaundrySlipAdmin(admin.ModelAdmin):
    list_display = ('student', 'date_issued', 'status')
    list_filter = ('status', 'date_issued')
    search_fields = ('student__name', 'student__roll_no')
    ordering = ('-date_issued',)
