from django.urls import path
from . import views

urlpatterns = [
    path('Index', views.GetIndex, name="Get_index"),

    path("CreateAccount", views.GetCreateAccount, name="Get_create_account"),
    path("PostCreateAccount", views.PostCreateAccount, name="Post_create_account"),

    path("CreateFAQ", views.GetCreateFAQ, name="Get_create_faq"),
    path("PostCreateFAQ", views.PostCreateFAQ, name="Post_create_faq"),

    path("CreateWork/<problem_key>", views.GetCreateWork, name="Get_create_work"),
    path("PostCreateWork", views.PostCreateWork, name="Post_create_work"),
]