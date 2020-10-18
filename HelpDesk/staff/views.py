from django.shortcuts import render, redirect

import pyrebase
import json

# Create your views here.

    # Read info firebase_config
file_config = open("./HelpDesk/firebase_config.txt", "r")
firebaseConfig = json.loads(file_config.read())
file_config.close()

firebase = pyrebase.initialize_app(firebaseConfig)
fire_auth = firebase.auth()
database = firebase.database()


def GetIndex(request):
    try:
        token = request.session["token"]
    except KeyError:
        return redirect("")

    account = fire_auth.get_account_info(token)
    users = account["users"]
    user = users[0]
    uid = user.get("localId")
    info = database.child("users").child(uid).get().val()
    name = info.get("name")
    return render(request, "staff/Index.html", {"name": name, "user": uid})


def GetCreateProblem(request):
    return render(request, "staff/CreateProblem.html")


def PostCreateProblem(request):
    try:
        token = request.session["token"]
    except KeyError:
        string = "Bạn đã đăng xuất. Vui lòng đăng nhập lại !!"
        return redirect("../../")

    # Get email, name of user
    account = fire_auth.get_account_info(token)
    users = account["users"]
    user = users[0]
    uid = user.get("localId")
    info = database.child("users").child(uid).get().val()
    name = info.get("name")

    content = request.POST.get("content")
    image_name = request.POST.get("image_name")
    image_url = request.POST.get("image_url")
    status = 0

    data = {
        "user_create": uid,
        "content": content,
        "image_name": image_name,
        "image_url": image_url,
        "status": status
    }
    database.child("problems").push(data)
    return redirect("../staff/Index")