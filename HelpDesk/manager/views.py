from django.shortcuts import render, redirect

import pyrebase
import json

# Create your views here.

    # Read info firebase_config
file_config = open("./HelpDesk/firebase_config.txt", "r")
firebase_config = json.loads(file_config.read())
file_config.close()

firebase = pyrebase.initialize_app(firebase_config)
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
    name = infoUser.get("name")
    return render(request, "manager/Index.html", {"name": name})


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


def GetCreateWork(request, problem_key):    
    users = database.child("users").get().val()
    emailList = []
    nameList = []
    for key in users:
        position = users[key].get("position")
        if position == "technician":
            emailList.append(users[key].get("email"))
            nameList.append(users[key].get("name"))
    user_zip = zip(emailList, nameList)

    faqs = database.child("faqs").get().val()
    keyList = []
    questionList = []
    for key in faqs:
        keyList.append(key)
        questionList.append(faqs[key].get("question"))
    faq_zip = zip(keyList, questionList)

    return render(request, "manager/CreateWork.html", {"problem_key": problem_key, "user_zip": user_zip, "faq_zip": faq_zip})


def PostCreateWork(request):
    problem = request.POST.get("problem")
    name_work = request.POST.get("name")
    user_fix = request.POST.get("user")
    deadline = request.POST.get("deadline")
    faq_key = request.POST.get("faq")

    data = {
        "problem": problem,
        "name_work": name_work,
        "user_fix": user_fix,
        "deadline": deadline,
        "faq_key": faq_key,
        "status": 0
    }
    database.child("works").push(data)
    return redirect("../manager/Index")
