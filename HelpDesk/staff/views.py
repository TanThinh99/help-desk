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
    return render(request, "staff/Index.html", {"name": name})


def GetSignIn(request):
    return render(request, "staff/SignIn.html")


def PostSignIn(request):
    email = request.POST.get("email")
    passw = request.POST.get("password")

    try:
        user = fire_auth.sign_in_with_email_and_password(email, passw)
    except:
        return render(request, "staff/SignIn.html", {"report": "Đăng nhập thất bại"})

    # Save token
    token = user.get("idToken")
    request.session["token"] = token
    
    # Get User information
    uid = user.get("localId")
    info = database.child("users").child(uid).get().val()
    name = info.get("name")
    position = info.get("position")

    if position == "staff":
        return redirect("../Index")
    elif position == "manager":
        return redirect("manager/Index")
    elif position == "technician":
        return redirect("technician/Index")


def Logout(request):
    try:
        token = request.session['token']
        del request.session['token']
    except KeyError:
        string = "Bạn đã đăng xuất. Vui lòng đăng nhập lại !!"
        return render(request, "staff/SignIn.html", {"report": string})
    return render(request, "staff/SignIn.html", {"report": "Đăng xuất thành công"})


def GetCreateProblem(request):
    return render(request, "staff/CreateProblem.html")


def PostCreateProblem(request):
    try:
        token = request.session["token"]
    except KeyError:
        string = "Bạn đã đăng xuất. Vui lòng đăng nhập lại !!"
        return render(request, "staff/SignIn.html", {"report": string})

    # Get email, name of user
    account = fire_auth.get_account_info(token)
    users = account["users"]
    user = users[0]
    uid = user.get("localId")
    info = database.child("users").child(uid).get().val()
    email = info.get("email")
    name = info.get("name")

    content = request.POST.get("content")
    name_image = request.POST.get("name_image")
    url_image = request.POST.get("url_image")
    status = 0

    data = {
        "user_create": email,
        "content": content,
        "name_image": name_image,
        "url_image": url_image,
        "status": status
    }
    database.child("problems").push(data)
    return render(request, "staff/Index.html", {"report": "Gửi sự cố thành công", "name": name})