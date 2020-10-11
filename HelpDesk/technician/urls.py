from django.urls import path
from . import views

urlpatterns = [
    path("Index", views.GetIndex, name="Get_index"),
    path("WorkDetail/<workKey>", views.GetWorkDetail, name="Get_work_detail"),

    path("CreateSolution/<workKey>", views.GetCreateSolution, name="Get_create_solution"),
    path("PostCreateSolution", views.PostCreateSolution, name="Post_create_solution"),
    path("CanNotDone/<workKey>", views.CanNotDone, name="Can_not_done"),
]