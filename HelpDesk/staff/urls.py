from django.urls import path
from . import views

urlpatterns = [
    path("", views.GetSignIn, name="Get_sign_in"),
    path("PostSignIn", views.PostSignIn, name="Post_sign_in"),

    path("logout", views.Logout, name="Logout"),
]