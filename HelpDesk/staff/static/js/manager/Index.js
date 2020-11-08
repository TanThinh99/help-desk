function ToURL(url) {
    window.location.href = url;
}

var data_problems_done = firebase.database().ref("problems").orderByChild("status").equalTo("3");
data_problems_done.on("value", function(snapshot) {
    info = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>content</th>";
            str += "<th>image</th>";
            str += "<th>status</th>";
            str += "<th></th>";
            str += "<th></th>";
        str += "</tr>";
        for (x in info) {
            str += "<tr>";
                str += "<td>"+ info[x].content +"</td>";
                if(info[x].image_url != "")
                {
                    str += "<td><img src='"+ info[x].image_url +"' style='height: 50px;'></td>";
                }
                else
                {
                    str += "<td></td>";
                }                
                str += "<td>"+ info[x].status +"</td>";
                str += "<td><button onclick='ProblemDetail(\""+ x +"\")'>Xem</button></td>";
                str += "<td><button onclick='WorkList(\""+ x +"\")'>Các công việc</button></td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("problemsDone").innerHTML = str;
});

var data_problems = firebase.database().ref("problems");
data_problems.on("value", function(snapshot) {
    info = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>content</th>";
            str += "<th>image</th>";
            str += "<th>status</th>";
            str += "<th></th>";
            str += "<th></th>";
            str += "<th></th>";
            str += "<th></th>";
        str += "</tr>";
        for (x in info) {
            if(info[x].status != "3") {
                str += "<tr>";
                    str += "<td>"+ info[x].content +"</td>";
                    if(info[x].image_url != "")
                    {
                        str += "<td><img src='"+ info[x].image_url +"' style='height: 50px;'></td>";
                    }
                    else
                    {
                        str += "<td></td>";
                    }
                    str += "<td>"+ info[x].status +"</td>";
                    str += "<td><button onclick='ProblemDetail(\""+ x +"\")'>Xem</button></td>";
                    if(info[x].status == "2")
                    {
                        str += "<td><button onclick='PassProblem(\""+ x +"\")'>Duyệt</button></td>";
                    }
                    else
                    {
                        str += "<td><button onclick='PassProblem(\""+ x +"\")' disabled>Duyệt</button></td>";
                    }                        
                    str += "<td><button onclick='CreateWork(\""+ x +"\")'>Tạo công việc</button></td>";
                    str += "<td><button onclick='WorkList(\""+ x +"\")'>Các công việc</button></td>";
                str += "</tr>";
            }
        }
    str += "</table>";
    document.getElementById("problemsNotDone").innerHTML = str;
});

var data_faq = firebase.database().ref("faqs");
data_faq.on("value", function(snapshot) {
    faqs = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>question</th>";
            str += "<th>answer</th>";
            str += "<th></th>";
            str += "<th></th>";
        str += "</tr>";
        for (x in faqs) {
            str += "<tr>";
                str += "<td>"+ faqs[x].question +"</td>";
                str += "<td>"+ faqs[x].answer +"</td>";
                str += "<td><button onclick='UpdateFAQ(\""+ x +"\")'>Cập nhật</button></td>";
                str += "<td><button onclick='DeleteFAQ(\""+ x +"\")'>Xóa</button></td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("faqs").innerHTML = str;
});

    // Get user_name for work follow problems
dsUser = []
data_user = firebase.database().ref("users").once('value', function(snapshot) {
    users = snapshot.val()
    for(x in users) {
        dsUser[x] = users[x].name;
    }
});

function WorkList(problem_key) {
        // Change works follow problems
    var data_work = firebase.database().ref("works").orderByChild("problem").equalTo(problem_key);
    data_work.on("value", function(snapshot) {
        works = snapshot.val();
        str = "<table border='1'>";
            str += "<tr>";
                str += "<th>work_name</th>";
                str += "<th>user_fix</th>";
                str += "<th>deadline</th>";
                str += "<th>status</th>";
                str += "<th></th>";
                str += "<th></th>";
                str += "<th></th>";
            str += "</tr>";
            for (x in works) {
                str += "<tr>";
                    str += "<td>"+ works[x].work_name +"</td>";                        
                    str += "<td>"+ dsUser[works[x].user_fix] +"</td>";
                    str += "<td>"+ works[x].deadline +"</td>";
                    str += "<td>"+ works[x].status +"</td>";
                    if(works[x].status == "3" || works[x].status == "1")
                    {
                        str += "<td><button onclick='UpdateWork(\""+ x +"\")' disabled>Cập nhật</button></td>";
                        str += "<td><button onclick='DeleteWork(\""+ x +"\")' disabled>Xóa</button></td>";
                        str += "<td><button onclick='MoveWork(\""+ x +"\")' disabled>Chuyển</button></td>";
                    }
                    else if(works[x].status == "2")
                    {
                        str += "<td><button onclick='UpdateWork(\""+ x +"\")' disabled>Cập nhật</button></td>";
                        str += "<td><button onclick='DeleteWork(\""+ x +"\")' disabled>Xóa</button></td>";
                        str += "<td><button onclick='MoveWork(\""+ x +"\")'>Chuyển</button></td>";
                    }
                    else if(works[x].status == "0")
                    {
                        str += "<td><button onclick='UpdateWork(\""+ x +"\")'>Cập nhật</button></td>";
                        str += "<td><button onclick='DeleteWork(\""+ x +"\")'>Xóa</button></td>";
                        str += "<td><button onclick='MoveWork(\""+ x +"\")' disabled>Chuyển</button></td>";
                    }
                str += "</tr>";
            }
        str += "</table>";
        document.getElementById("works").innerHTML = str;
    });       
}

function PassProblem(problem_key) {
    if(confirm("Bạn sẽ duyệt sự cố này?")) {
        $.get("../PassProblem/", {
            "problem_key": problem_key
        }, function(data) {

        });
    }
}

function CreateWork(problem_key) {
    window.location.href = "CreateWork/"+ problem_key;
}

function UpdateWork(work_key) {
    window.location.href = "UpdateWork/"+ work_key;
}

function DeleteWork(work_key) {
    if(confirm("Bạn sẽ xóa công việc này?")) {
        $.get("../DeleteWork/", {
            "work_key": work_key,
        }, function(data) {

        });
    }
}

function MoveWork(work_key) {
    window.location.href = "UpdateWork/"+ work_key;
}

function ProblemDetail(problem_key) {
    window.location.href = "ProblemDetail/"+ problem_key;
}

function UpdateFAQ(faq_key)
{
    window.location.href = "../UpdateFAQ/"+faq_key;
}

function DeleteFAQ(faq_key)
{
    if(confirm("Bạn sẽ xóa FAQ này?"))
    {
        $.get("../DeleteFAQ/", {
            "faq_key": faq_key
        }, function(data) {
            if(data != "")
            {
                alert(data);
            }
        });
    }
}
