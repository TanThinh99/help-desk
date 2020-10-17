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
        return redirect("../../")
    uid = GetUser(token)
    info = database.child("users").child(uid).get().val()
    name = info.get("name")
    return render(request, "technician/Index.html", {"name": name, "user": uid})


def GetUser(token):
    account = fire_auth.get_account_info(token)
    users = account["users"]
    user = users[0]
    uid = user["localId"]
    return uid


def GetWorkDetail(request, workKey):
        # Get work_name, deadline, status
    work = database.child("works").child(workKey).get().val()
    work_name = work.get("work_name")
    deadline = work.get("deadline")
    status = work.get("status")

    problem_key = work.get("problem")
    problem = database.child("problems").child(problem_key).get().val()
    problem_content = problem.get("content")

        # Get user_name
    user_key = problem.get("user_create")
    user = database.child("users").child(user_key).get().val()
    user_name = user.get("name")

        # Get question and answer in FAQ
    question = ""
    answer = ""
    faq_key = work.get("faq_key")
    faq = database.child("faqs").child(faq_key).get().val()
    if faq is not None:
        question = faq.get("question")
        answer = faq.get("answer")

        # Get solution (If have), if status is 2, work is done
    solution_content = ""
    time_fix = ""
    if status == 3:
        solution_key = work.get("solution")
        solution = database.child("solutions").child(solution_key).get().val()
        solution_content = solution.get("content")
        time_fix = solution.get("time_fix")

    data = {
        "work_key": workKey,
        "work_name": work_name,
        "user_name": user_name,
        "problem_content": problem_content,
        "question": question,
        "answer": answer,
        "deadline": deadline,
        "status": status,
        "solution_content": solution_content,
        "time_fix": time_fix
    }
    return render(request, "technician/WorkDetail.html", data)


def GetCreateSolution(request, workKey):
    return render(request, "technician/CreateSolution.html", {"workKey": workKey})


def PostCreateSolution(request):
    workKey = request.POST.get("workKey")
    content = request.POST.get("solution_content")
    time_fix = request.POST.get("time_fix")

    try:
        token = request.session["token"]
    except KeyError:
        return redirect("../../")
    uid = GetUser(token)
    problem_key = database.child("works").child(workKey).get().val().get("problem")

    data = {
        "user_fix": uid,
        "problem": problem_key,
        "work": workKey,
        "content": content,
        "time_fix": time_fix
    }
    solution = database.child("solutions").push(data)
    
        # Get solution_key to update WORK
    solution_key = solution["name"]
    data = {
        "solution": solution_key,
        "status": 2
    }
    database.child("works").child(workKey).update(data)
    
        # Test and update problem if all works in problem are done
    done = True
    works = database.child("works").order_by_child("problem").equal_to(problem_key).get().val()
    for x in works:
        if works[x].get("status") != 2:
            done = False
            break
    if done:
        data = {
            "status": 2
        }
        database.child("problems").child(problem_key).update(data)
    return redirect("../technician/Index")


def CanNotDone(request, workKey):
    data = {
        "status": 2
    }
    database.child("works").child(workKey).update(data)
    return redirect("../Index")
