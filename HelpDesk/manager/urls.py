from django.urls import path
from . import views

urlpatterns = [
    path('Index', views.GetIndex, name="Get_index"),

    path("", views.GetSignIn, name="Get_sign_in"),
    path("PostSignIn", views.PostSignIn, name="Post_sign_in"),
    path("logout", views.Logout, name="Logout"),

    path("CreateAccount", views.GetCreateAccount, name="Get_create_account"),
    path("PostCreateAccount", views.PostCreateAccount, name="Post_create_account"),

    path("CreateFAQ", views.GetCreateFAQ, name="Get_create_faq"),
    path("PostCreateFAQ", views.PostCreateFAQ, name="Post_create_faq"),

    path("CreateWork/<problem_key>", views.GetCreateWork, name="Get_create_work"),
    path("PostCreateWork", views.PostCreateWork, name="Post_create_work"),

    path("UpdateWork/<work_key>", views.GetUpdateWork, name="Get_update_work"),
    path("PostUpdateWork", views.PostUpdateWork, name="Post_update_work"),

    path("DeleteWork/<work_key>", views.GetDeleteWork, name="Get_delete_work"),

    path("PassProblem/<problem_key>", views.GetPassProblem, name="Get_pass_problem"),

    path("ProblemDetail/<problem_key>", views.GetProblemDetail, name="Get_problem_detail"),
]