import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Subject, StudySession

DEFAULT_SUBJECTS = ['Django', 'Python', 'React', 'MySQL', 'DSA']

def get_subjects(request):
    """Return available subjects for the current user or defaults."""
    if request.user.is_authenticated:
        subjects = list(Subject.objects.filter(user=request.user).values('id', 'name', 'target_hours'))
        if not subjects:
            for name in DEFAULT_SUBJECTS:
                Subject.objects.create(user=request.user, name=name, target_hours=20.0)
            subjects = list(Subject.objects.filter(user=request.user).values('id', 'name', 'target_hours'))
        return JsonResponse({'subjects': subjects})
    else:
        subjects = [{'id': i + 1, 'name': name, 'target_hours': 20.0} for i, name in enumerate(DEFAULT_SUBJECTS)]
        return JsonResponse({'subjects': subjects})

@csrf_exempt
def save_session(request):
    """Record a completed study session."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except Exception:
            data = request.POST

        subject_name = data.get('subject', '').strip()
        topic = data.get('topic', '').strip()
        try:
            seconds = float(data.get('seconds', 0))
        except (ValueError, TypeError):
            seconds = 0

        duration_hours = max(round(seconds / 3600.0, 2), 0.01) if seconds > 0 else 0.0

        if not subject_name:
            return JsonResponse({'error': 'Subject is required'}, status=400)

        if request.user.is_authenticated:
            subject, _ = Subject.objects.get_or_create(
                user=request.user,
                name=subject_name,
                defaults={'target_hours': 20.0}
            )
            session = StudySession.objects.create(
                user=request.user,
                subject=subject,
                topic=topic,
                duration=duration_hours,
                date=timezone.now().date()
            )
            return JsonResponse({
                'success': True,
                'session': {
                    'id': session.id,
                    'subject': subject.name,
                    'topic': session.topic,
                    'duration': session.duration,
                    'date': session.date.isoformat(),
                }
            })
        else:
            return JsonResponse({
                'success': True,
                'guest': True,
                'session': {
                    'id': 'guest',
                    'subject': subject_name,
                    'topic': topic,
                    'duration': duration_hours,
                    'date': timezone.now().date().isoformat(),
                }
            })

    return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_sessions(request):
    """Return recent study sessions."""
    if request.user.is_authenticated:
        sessions = StudySession.objects.filter(user=request.user).order_by('-id')[:20]
        data = [
            {
                'id': s.id,
                'subject': s.subject.name,
                'topic': s.topic,
                'duration': s.duration,
                'date': s.date.isoformat(),
            }
            for s in sessions
        ]
        return JsonResponse({'sessions': data})
    return JsonResponse({'sessions': []})
