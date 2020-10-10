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
    return render(request, "technician/Index.html", {"name": name})


def GetUser(token):
    account = fire_auth.get_account_info(token)
    users = account["users"]
    user = users[0]
    uid = user["localId"]
    return uid
