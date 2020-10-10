from django.urls import path
from . import views

urlpatterns = [
    path("Index", views.GetIndex, name="Get_index"),

    path("", views.GetSignIn, name="Get_sign_in"),
    path("PostSignIn", views.PostSignIn, name="Post_sign_in"),
    path("logout", views.Logout, name="Logout"),

    path("CreateProblem", views.GetCreateProblem, name="Get_create_problem"),
    path("PostCreateProblem", views.PostCreateProblem, name="Post_create_problem"),
]