from django.urls import path
from . import views

urlpatterns = [
    path("Index", views.GetIndex, name="Get_index"),
]