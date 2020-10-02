from django.urls import path
from . import views

urlpatterns = [
    path('Welcome', views.FirstView, name="first_view"),
]