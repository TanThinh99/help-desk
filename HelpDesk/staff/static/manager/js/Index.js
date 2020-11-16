function ToURL(url) {
    window.location.href = url;
}

var data_problems_done = firebase.database().ref("problems").orderByChild("status").equalTo("3");
data_problems_done.on("value", function(snapshot) {
    info = snapshot.val();
    var str = "<table border='1'>";
        str += "<tr>";
            str += "<th class='titleTable' colspan='3'>";
                str += "Danh sách sự cố đã được giải quyết";
            str += "</th>";
        str += "</tr>";
        str += "<tr>";
            str += "<th>Nội dung</th>";
            str += "<th>Hình ảnh</th>";
            str += "<th>Thao tác</th>";
        str += "</tr>";
        for (x in info) {
            str += "<tr>";
                str += "<td class='content'>"+ info[x].content +"</td>";
                if(info[x].image_url != "")
                {
                    str += "<td><img src='"+ info[x].image_url +"' alt='Hình sự cố' onclick='ZoomImage(\""+ info[x].image_url +"\")'></td>";
                }
                else
                {
                    str += "<td></td>";
                }

                str += "<td class='functions'>";
                    str += "<div class='dropdown'><div class='dropdownBtn'>Các thao tác</div>";
                        str += "<div class='dropdown-content'>";
                            str += "<a onclick='ProblemDetail(\""+ x +"\")' class='content-item'>Chi tiết</a>";
                            str += "<a onclick='WorkList(\""+ x +"\", true)' class='content-item'>Xem công việc</a>";
                        str += "</div>";
                    str += "</div>";
                str += "</td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("problemsDoneTable").innerHTML = str;
});

var data_problems = firebase.database().ref("problems");
data_problems.on("value", function(snapshot) {
    info = snapshot.val();
    var str = "<table border='1'>";
        str += "<tr>";
            str += "<th class='titleTable' colspan='4'>";
                str += "Danh sách sự cố chưa giải quyết";
            str += "</th>";
        str += "</tr>";
        str += "<tr>";
            str += "<th>Nội dung</th>";
            str += "<th>Hình ảnh</th>";
            str += "<th>Trạng thái</th>";
            str += "<th>Thao tác</th>";
        str += "</tr>";
        for (x in info) {
            if(info[x].status != "3") {
                str += "<tr>";
                    str += "<td class='content'>"+ info[x].content +"</td>";
                    if(info[x].image_url != "")
                    {
                        str += "<td><img src='"+ info[x].image_url +"' alt='Hình sự cố' onclick='ZoomImage(\""+ info[x].image_url +"\")'></td>";
                    }
                    else
                    {
                        str += "<td></td>";
                    }
                    if(info[x].status == "0")
                    {
                        str += "<td class='status'>Đã gửi</td>";
                    }
                    else if(info[x].status == "1")
                    {
                        str += "<td class='status'>Đang điều tra</td>";
                    }
                    else if(info[x].status == "2")
                    {
                        str += "<td class='status'>Chờ duyệt</td>";
                    }
                    
                    str += "<td class='functions'>";
                        str += "<div class='dropdown'><div class='dropdownBtn'>Các thao tác</div>";
                            str += "<div class='dropdown-content'>";
                                str += "<a onclick='ProblemDetail(\""+ x +"\")' class='content-item'>Chi tiết</a>";
                                str += "<a onclick='CreateWork(\""+ x +"\")' class='content-item'>Tạo công việc</a>";
                                str += "<a onclick='PassProblem(\""+ x +"\")' class='content-item'>Duyệt</a>";
                                str += "<a onclick='WorkList(\""+ x +"\", false)' class='content-item'>Xem công việc</a>";
                            str += "</div>";
                        str += "</div>";
                    str += "</td>";
                str += "</tr>";
            }
        }
    str += "</table>";
    document.getElementById("problemsNotDoneTable").innerHTML = str;
});

var data_faq = firebase.database().ref("faqs");
data_faq.on("value", function(snapshot) {
    faqs = snapshot.val();
    str = "<tr>";
        str += "<th class='widthQuestion'>Câu hỏi</th>";
        str += "<th class='widthAnswer'>Trả lời</th>";
        str += "<th class='widthFunction'>Thao tác</th>";
    str += "</tr>";
    for (x in faqs) {
        str += "<tr>";
            str += "<td class='question'>"+ faqs[x].question +"</td>";
            str += "<td class='answer'>"+ faqs[x].answer +"</td>";
            str += "<td class='functions'>";
                str += "<a onclick='UpdateFAQ(\""+ x +"\")' class='function-item'>Cập nhật</a>";
                str += "<a onclick='DeleteFAQ(\""+ x +"\")' class='function-item'>Xóa</a>";
            str += "</td>";
            // str += "<td><button onclick='UpdateFAQ(\""+ x +"\")'>Cập nhật</button></td>";
            // str += "<td><button onclick='DeleteFAQ(\""+ x +"\")'>Xóa</button></td>";
        str += "</tr>";
    }
    document.getElementById("faqTable").innerHTML = str;
});

    // Get user_name for work follow problems
dsUser = []
data_user = firebase.database().ref("users").once('value', function(snapshot) {
    users = snapshot.val()
    for(x in users) {
        dsUser[x] = users[x].name;
    }
});

function WorkList(problem_key, isProblemDone) {
        // Change works follow problems
    var data_work = firebase.database().ref("works").orderByChild("problem").equalTo(problem_key);
    data_work.on("value", function(snapshot) {
        works = snapshot.val();
        var str = "<table border='1'>";
            str += "<tr>";
            if(isProblemDone)
            {
                str += "<th class='titleTable' colspan='3'>";
            }
            else
            {
                str += "<th class='titleTable' colspan='5'>";
            }
                    str += "Danh sách công việc theo sự cố";
                str += "</th>"
            str += "</tr>";
            str += "<tr>";
                str += "<th>Tên công việc</th>";
                str += "<th>Người giải quyết</th>";
                str += "<th>Hạn chót</th>";
                if( !isProblemDone )
                {
                    str += "<th>Trạng thái</th>";
                    str += "<th>Thao tác</th>";
                }
            str += "</tr>";
            for (x in works) {
                str += "<tr>";
                    str += "<td class='content'>"+ works[x].work_name +"</td>";                        
                    str += "<td class='userFix'>"+ dsUser[works[x].user_fix] +"</td>";
                    str += "<td class='deadline'>"+ works[x].deadline +"</td>";
                    if( !isProblemDone )
                    {
                        var status = "";
                        if(works[x].status == "0")
                        {
                            status = "Đã gửi";
                        }
                        else if(works[x].status == "1")
                        {
                            status = "Đang điều tra";
                        }
                        else if(works[x].status == "2")
                        {
                            status = "Không thể hoàn thành";
                        }
                        else if(works[x].status == "3")
                        {
                            status = "Đã hoàn thành";
                        }
                        str += "<td class='status'>"+ status +"</td>";
                        str += "<td class='functions'>";
                            str += "<div class='dropdown'><div class='dropdownBtn'>Các thao tác</div>";
                                str += "<div class='dropdown-content'>";
                                if(works[x].status == "0")
                                {
                                    str += "<a onclick='UpdateWork(\""+ x +"\")' class='content-item'>Cập nhật</a>";
                                    str += "<a onclick='DeleteWork(\""+ x +"\")' class='content-item'>Xóa</a>";
                                }
                                else
                                {
                                    str += "<a href='' class='content-item disabled-link'>Cập nhật</a>";
                                    str += "<a href='' class='content-item disabled-link'>Xóa</a>";
                                }
                                
                                if(works[x].status == "2")
                                {
                                    str += "<a onclick='MoveWork(\""+ x +"\")' class='content-item'>Chuyển</a>";
                                }
                                else
                                {
                                    str += "<a href='' class='content-item disabled-link'>Chuyển</a>";
                                }
                                str += "</div>";
                            str += "</div>";
                        str += "</td>";
                    }
                str += "</tr>";
            }
        str += "</table>";

        if(isProblemDone)
        {
            document.getElementById("worksOfProblemDone").innerHTML = str;
        }
        else
        {
            document.getElementById("worksOfProblemNotDone").innerHTML = str;
        }
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
