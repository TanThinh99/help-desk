from django.urls import path
from . import views

urlpatterns = [
    path('Welcome', views.FirstView, name="first_view"),

    path("TaoTaiKhoan", views.GetCreateAccount, name="Get_create_account"),
    path("PostCreateAccount", views.PostCreateAccount, name="Post_create_account"),
]