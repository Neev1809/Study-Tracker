from django.contrib import admin

# Register your models here.
from .models import Subject, StudySession

admin.site.register(Subject)
admin.site.register(StudySession)
