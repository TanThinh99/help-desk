from django.urls import path
from . import views

app_name = "staff"

urlpatterns = [
    path("Index", views.GetIndex, name="Get_index"),

    path("CreateProblem", views.GetCreateProblem, name="Get_create_problem"),
    path("PostCreateProblem", views.PostCreateProblem, name="Post_create_problem"),
]