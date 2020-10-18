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


def GetSignIn(request):
    return render(request, "manager/SignIn.html")


def PostSignIn(request):
    email = request.POST.get("email")
    passw = request.POST.get("password")

    try:
        user = fire_auth.sign_in_with_email_and_password(email, passw)
    except:
        return redirect("../SignIn")

    # Save token
    token = user.get("idToken")
    request.session["token"] = token
    
    # Get User information
    uid = user.get("localId")
    info = database.child("users").child(uid).get().val()
    name = info.get("name")
    position = info.get("position")

    if position == "staff":
        return redirect("staff/Index")
    elif position == "manager":
        return redirect("../Index")
    elif position == "technician":
        return redirect("technician/Index")


def Logout(request):
    try:
        token = request.session['token']
        del request.session['token']
    except KeyError:
        string = "Bạn đã đăng xuất. Vui lòng đăng nhập lại !!"
        return redirect("../")
    return redirect("../")


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

    return redirect("../Index")


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
    return redirect("../Index")


def GetCreateWork(request, problem_key):    
    users = database.child("users").get().val()
    keyList = []
    nameList = []
    for key in users:
        position = users[key].get("position")
        if position == "technician":
            keyList.append(key)
            nameList.append(users[key].get("name"))
    user_zip = zip(keyList, nameList)

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
    work_name = request.POST.get("name")
    user_fix = request.POST.get("user")
    deadline = request.POST.get("deadline")
    faq = request.POST.get("faq")
       
        # Create WORK
    data = {
        "problem": problem,
        "work_name": work_name,
        "user_fix": user_fix,
        "deadline": deadline,
        "faq": faq,
        "status": 0
    }
    database.child("works").push(data)
    
        # Update problem (status = 1)
    data = {
        "status": 1
    }
    database.child("problems").child(problem).update(data)
    return redirect("../Index")


def GetUpdateWork(request, work_key):
    work = database.child("works").child(work_key).get().val()
    work_name = work.get("work_name")
    deadline = work.get("deadline")
    
    users = database.child("users").order_by_child("position").equal_to("technician").get().val()
    keyList = []
    nameList = []
    for key in users:
        keyList.append(key)
        nameList.append(users[key].get("name"))
    user_zip = zip(keyList, nameList)

    faqs = database.child("faqs").get().val()
    keyList = []
    questionList = []
    for key in faqs:
        keyList.append(key)
        questionList.append(faqs[key].get("question"))
    faq_zip = zip(keyList, questionList)
    data = {
        "work_key": work_key,
        "work_name": work_name,
        "deadline": deadline,
        "user_zip": user_zip, 
        "faq_zip": faq_zip
    }
    return render(request, "manager/UpdateWork.html", data)


def PostUpdateWork(request):
    work_key = request.POST.get("work_key")
    work_name = request.POST.get("name")
    user_fix = request.POST.get("user")
    deadline = request.POST.get("deadline")
    faq = request.POST.get("faq")
       
        # Create WORK
    data = {
        "work_name": work_name,
        "user_fix": user_fix,
        "deadline": deadline,
        "faq": faq,
        "status": 0
    }
    database.child("works").child(work_key).update(data)
    return redirect("../Index")


def GetDeleteWork(request, work_key):
    database.child("works").child(work_key).remove()
    return redirect("../Index")


def GetPassProblem(request, problem_key):
    data = {
        "status": 3
    }
    database.child("problems").child(problem_key).update(data)
    return redirect("../Index")
