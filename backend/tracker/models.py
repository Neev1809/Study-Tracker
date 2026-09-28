from django.db import models
from django.contrib.auth.models import User


class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    target_hours = models.FloatField(default=0)

    def __str__(self):
        return self.name


class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date = models.DateField()
    duration = models.FloatField()
    topic = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.subject.name} - {self.duration} hrs"