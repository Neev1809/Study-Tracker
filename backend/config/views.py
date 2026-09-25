from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

def index(request):
    return render(request, 'index.html')

def handleSignup(request):
    #fetching the form data
    if request.method == 'POST':
        username = request.POST['auth-username']
        fname = request.POST['fname']
        lname = request.POST['lname']
        email = request.POST['auth-email']
        pass1 = request.POST['auth-password']
        pass2 = request.POST['auth-confirm-password']

        #details validation checks
        #username lenth
        if len(username) > 16:
            messages.error(request, "username must be under 16 characters!")
            return redirect('home')

        #username must be alphanumeric
        if not username.isalnum():
            messages.error(request, "username must only contain letters and numbers!")
            return redirect('home')
        
        #both passwords must match
        if pass1 != pass2:
            messages.error(request, "passwords do not match")
            return redirect('home')

        #creating the user
        myuser = User.objects.create_user(username, email, pass1)
        myuser.first_name = fname
        myuser.last_name = lname
        myuser.save()
        messages.success(request, "Your Study Tracker account has been created successfully")
        return redirect('home')
    else:
        return HttpResponse('404 - Not Found')

def handleLogin(request):
    if request.method == 'POST':
        loginusername = request.POST['auth-username']
        loginpass = request.POST['auth-password']

        user = authenticate(username=loginusername, password=loginpass)

        if user is not None:
            login(request, user)
            messages.success(request, "Logged in successfully!")
            return redirect('home')

        else:
            messages.error(request, "Invalid credentials!")
            return redirect('home')

    return HttpResponse('404 - not found')

def handleLogout(request):
    logout(request)
    messages.success(request, "Successfully Logged Out!")
    return redirect('home')

    return HttpResponse('handleLogout')

def get_messages(request):
    """Return any queued Django messages as JSON and clear them from the session."""
    msgs = [
        {'level': m.level_tag, 'text': str(m)}
        for m in messages.get_messages(request)
    ]
    return JsonResponse({'messages': msgs})

def get_current_user(request):
    """Return the current user's authentication status and details."""
    if request.user.is_authenticated:
        return JsonResponse({
            'isAuthenticated': True,
            'username': request.user.username,
            'firstName': request.user.first_name,
            'email': request.user.email,
        })
    return JsonResponse({'isAuthenticated': False})

