from django.shortcuts import render, redirect

import pyrebase
import json
import datetime

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
        string = "Bạn đã đăng xuất. Vui lòng đăng nhập lại!!"
        return render(request, "manager/SignIn.html", {"report": string})

    infoAccount = fire_auth.get_account_info(token)
    user = infoAccount["users"]
    uid = user[0].get("localId")
    infoUser = database.child("users").child(uid).get().val()
    name = infoUser.get("name")
    try:
        thongBao = request.session["thongBao"]
        del request.session["thongBao"]
        data = {
            "thongBao": thongBao,
            "name": name
        }
    except KeyError:
        data = {"name": name}
    return render(request, "manager/Index.html", data)


def GetSignIn(request):
    return render(request, "manager/SignIn.html")


def PostSignIn(request):
    email = request.POST.get("email")
    passw = request.POST.get("password")

    try:
        user = fire_auth.sign_in_with_email_and_password(email, passw)
    except:
        return redirect("../")

    # Save token
    token = user.get("idToken")
    request.session["token"] = token
    
    # Get User information
    uid = user.get("localId")
    position = database.child("users").child(uid).child("position").get().val()
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


def GetUpdateFAQ(request, faq_key):
    faq = database.child("faqs").child(faq_key).get().val()
    return render(request, "manager/UpdateFAQ.html", {"faq_key": faq_key, "faq": faq})


def PostUpdateFAQ(request, faq_key):
    question = request.POST.get("question")
    answer   = request.POST.get("answer")
    data = {
        "question": question,
        "answer": answer
    }
    database.child("faqs").child(faq_key).update(data)
    request.session["thongBao"] = "Cập nhật FAQ thành công"
    return redirect("../Index")


def DeleteFAQ(request):
    faq_key = request.GET.get("faq_key")
    string = ""
    try:
        works = database.child("works").order_by_child("faq").equal_to(faq_key).get().val()
        string = "FAQ đã được dùng cho work nào đó, không thể xóa FAQ này!!"
    except:
        database.child("faqs").child(faq_key).remove()
    return render(request, "manager/temp.html", {"data": string})


def GetCreateWork(request, problem_key): 
    user_zip = ""   
    users = database.child("users").order_by_child("position").equal_to("technician").get().val()
    if users is not None:
        keyList = []
        nameList = []
        for key in users:
            keyList.append(key)
            nameList.append(users[key].get("name"))
        user_zip = zip(keyList, nameList)

    faq_zip = ""
    faqs = database.child("faqs").get().val()
    if(faqs is not None):
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
        "status": "0",
        "solution": ""
    }
    database.child("works").push(data)
    
        # Update problem (status = "1")
    data = {
        "status": "1"
    }
    database.child("problems").child(problem).update(data)
    return redirect("../Index")


def GetUpdateWork(request, work_key):
    work = database.child("works").child(work_key).get().val()
    work_name = work.get("work_name")
    deadline = work.get("deadline")
    
    user_zip = ""
    users = database.child("users").order_by_child("position").equal_to("technician").get().val()
    if users is not None:
        keyList = []
        nameList = []
        for key in users:
            keyList.append(key)
            nameList.append(users[key].get("name"))
        user_zip = zip(keyList, nameList)

    faq_zip = ""
    faqs = database.child("faqs").get().val()
    if faqs is not None:
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
        "status": "0"
    }
    database.child("works").child(work_key).update(data)
    return redirect("../Index")


def GetDeleteWork(request):
    work_key = request.GET.get("work_key")
    problem_key = database.child("works").child(work_key).child("problem").get().val()

    database.child("works").child(work_key).remove()

        # Test and update problem if all works in problem are done
    done = True
    try:
        works = database.child("works").order_by_child("problem").equal_to(problem_key).get().val()
    except:
        data = {
            "status": "2"
        }
        database.child("problems").child(problem_key).update(data)
        return render(request, "manager/temp.html")
    
    for x in works:
        if works[x].get("status") != "3":
            done = False
            break
    if done:
        data = {
            "status": "2"
        }
        database.child("problems").child(problem_key).update(data)
    return render(request, "manager/temp.html")


def GetPassProblem(request):
    problem_key = request.GET.get("problem_key")
    data = {
        "status": "3"
    }
    database.child("problems").child(problem_key).update(data)
    return render(request, "manager/temp.html")


def GetProblemDetail(request, problem_key):
    problem = database.child("problems").child(problem_key).get().val()
    uid = problem.get("user_create")
    user = database.child("users").child(uid).get().val()

        # Get position of account currently
    try:
        token = request.session["token"]
    except KeyError:
        return redirect("../")
    account = fire_auth.get_account_info(token)
    users = account["users"]
    user1 = users[0]
    uid = user1["localId"]
    position_currently = database.child("users").child(uid).child("position").get().val()

    data = {
        "problem_key": problem_key, 
        "problem": problem, 
        "user": user,
        "position_currently": position_currently
    }
    return render(request, "manager/ProblemDetail.html", data)


def CreateReply(request):
    try:
        token = request.session["token"]
    except KeyError:
        redirect("../")
    account = fire_auth.get_account_info(token)
    users = account["users"]
    user = users[0]
    uid = user.get("localId")

    problem_key = request.GET.get("problem_key")
    content     = request.GET.get("content")
    image_url   = request.GET.get("image_url")
    if(image_url == "0"):
        image_url = ""

    d = datetime.datetime.now()
    time = str(d.hour) +":"+ str(d.minute) +":"+ str(d.second) +" "+ str(d.day) +"-"+ str(d.month) +"-"+ str(d.year)
    data = {
        "problem": problem_key,
        "user_create": uid,
        "content": content,
        "image_url": image_url,
        "time": time
    }
    database.child("replies").push(data)
    return render(request, "manager/temp.html", {"data": ""})
