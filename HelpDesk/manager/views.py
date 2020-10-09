from django.shortcuts import render

import pyrebase

# Create your views here.

firebaseConfig = {
    "apiKey": "AIzaSyC22V25o9VKeIPEAVFBfgvguv_C5dlWzn4",
    "authDomain": "help-desk-12c4d.firebaseapp.com",
    "databaseURL": "https://help-desk-12c4d.firebaseio.com",
    "projectId": "help-desk-12c4d",
    "storageBucket": "help-desk-12c4d.appspot.com",
    "messagingSenderId": "137334382999",
    "appId": "1:137334382999:web:73f716f1b85c76f1c724d2",
    "measurementId": "G-R11CH76CNH"
}
firebase = pyrebase.initialize_app(firebaseConfig)
fire_auth = firebase.auth()
database = firebase.database()

def GetIndex(request):
    try:
        token = request.session['token']
    except KeyError:
        string = "Bạn đã đăng xuất. Vui lòng đăng nhập lại 2!!"
        return render(request, "staff/SignIn.html", {"report": string})

    infoAccount = fire_auth.get_account_info(token)
    user = infoAccount["users"]
    uid = user[0].get("localId")
    infoUser = database.child("users").child(uid).get().val()
    print(infoUser)
    name = infoUser.get("name")
    return render(request, "manager/Index.html")

def GetCreateAccount(request):
    return render(request, "manager/CreateAccount.html")

def PostCreateAccount(request):
    email = request.POST.get("email")
    passw = request.POST.get("password")
    try:
        user = fire_auth.create_user_with_email_and_password(email, passw)
    except:
        return render(request, "manager/Index.html", {"report": "Tạo tài khoản thất bại"})
    
    name = request.POST.get("hoTen")
    position = request.POST.get("role")
    data = {
        "name": name,
        "email": email,
        "position": position
    }
    uid = user.get("localId")
    database.child("users").child(uid).set(data)

    return render(request, "manager/Index.html", {"report": "Tạo tài khoản thành công"})


def GetCreateFAQ(request):
    return render(request, "manager/CreateFAQ.html")


def PostCreateFAQ(request):
    question = request.POST.get("question")
    answer = request.POST.get("answer")

    data = {
        "question": question,
        "answer": answer
    }
    database.child("faqs").push(data)
    return render(request, "manager/Index.html", {"report": "Tạo một FAQ thành công"})