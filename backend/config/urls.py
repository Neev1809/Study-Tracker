"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
from tracker import views as tracker_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='home'),
    path('session', views.index, name='session'),
    path('signup', views.handleSignup, name='handleSignup'),
    path('login', views.handleLogin, name='handleLogin'),
    path('logout', views.handleLogout, name='handleLogout'),
    path('api/messages', views.get_messages, name='get_messages'),
    path('api/user', views.get_current_user, name='get_current_user'),
    path('api/subjects', tracker_views.get_subjects, name='get_subjects'),
    path('api/sessions', tracker_views.get_sessions, name='get_sessions'),
    path('api/sessions/save', tracker_views.save_session, name='save_session'),
]

