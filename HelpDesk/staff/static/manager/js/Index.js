function ToURL(url) {
    window.location.href = url;
}

var data_problems_done = firebase.database().ref("problems").orderByChild("status").equalTo("3");
data_problems_done.on("value", function(snapshot) {
    info = snapshot.val();
    var str = '<table border="1" width="100%">\
                <tr>\
                    <th class="titleTable" colspan="4">\
                        Danh sách sự cố đã được giải quyết\
                    </th>\
                </tr>\
                <tr>\
                    <th width="70%">Nội dung</th>\
                    <th width="15%">Hình ảnh</th>\
                    <th width="15%" colspan="2">Thao tác</th>\
                </tr>';
        for (x in info) {
            // str += "<tr>";
            //     str += "<td class='content'>"+ info[x].content +"</td>";
            //     if(info[x].image_url != "")
            //     {
            //         str += "<td><img src='"+ info[x].image_url +"' alt='Hình sự cố' onclick='ZoomImage(\""+ info[x].image_url +"\")'></td>";
            //     }
            //     else
            //     {
            //         str += "<td></td>";
            //     }

            //     str += "<td class='functions'>";
            //         str += "<div class='dropdown'><div class='dropdownBtn'>Các thao tác</div>";
            //             str += "<div class='dropdown-content'>";
            //                 str += "<a onclick='ProblemDetail(\""+ x +"\")' class='content-item'>Chi tiết</a>";
            //                 str += "<a onclick='WorkList(\""+ x +"\", true)' class='content-item'>Xem công việc</a>";
            //             str += "</div>";
            //         str += "</div>";
            //     str += "</td>";
            // str += "</tr>";
            str += '<tr>\
                        <td class="content">\
                            '+ info[x].content +'\
                        </td>';
                        if(info[x].image_url != "")
                        {
                            str += '<td><img src="'+ info[x].image_url +'" alt="Hình sự cố" class="problemImage" onclick="ZoomImage(\''+ info[x].image_url +'\')"></td>';
                        }
                        else
                        {
                            str += "<td></td>";
                        }
                        // <td>\
                        //     <img src="'+ info[x].image_url +'" alt="Hình sự cố" class="problemImage" onclick="ZoomImage(\''+ info[x].image_url +'\')">\
                        // </td>\
                        str += '<td>\
                            <div class="function">\
                            <a onclick="ProblemDetail(\''+ x +'\')"><img src="./../static/image/XemChiTiet.jpg" alt=""></a>\
                                <span class="tip">Xem chi tiết</span>\
                            </div>\
                        </td>\
                        <td>\
                            <div class="function">\
                            <a onclick="WorkList(\''+ x +'\', true)"><img src="./../static/image/XemCongViec.png" alt=""></a>\
                                <span class="tip">Xem công việc</span>\
                            </div>\
                        </td>\
                    </tr>';
        }
    str += "</table>";
    document.getElementById("problemDoneTable").innerHTML = str;
});

var data_problems = firebase.database().ref("problems");
data_problems.on("value", function(snapshot) {
    info = snapshot.val();
    // var str = "<table border='1'>";
    //     str += "<tr>";
    //         str += "<th class='titleTable' colspan='4'>";
    //             str += "Danh sách sự cố chưa giải quyết";
    //         str += "</th>";
    //     str += "</tr>";
    //     str += "<tr>";
    //         str += "<th>Nội dung</th>";
    //         str += "<th>Hình ảnh</th>";
    //         str += "<th>Trạng thái</th>";
    //         str += "<th>Thao tác</th>";
    //     str += "</tr>";
    var str = '<table border="1" width="100%">\
                <tr>\
                    <th class="titleTable" colspan="7">\
                        Danh sách sự cố chưa giải quyết\
                    </th>\
                </tr>\
                <tr>\
                    <th width="50%">Nội dung</th>\
                    <th width="10%">Hình ảnh</th>\
                    <th width="15%">Trạng thái</th>\
                    <th colspan="4" width="25%">Các thao tác</th>\
                </tr>';
        for (x in info) {
            if(info[x].status != "3") {
                str += "<tr>";
                    str += "<td class='content'>"+ info[x].content +"</td>";
                    if(info[x].image_url != "")
                    {
                        str += "<td><img src='"+ info[x].image_url +"' alt='Hình sự cố' class='problemImage' onclick='ZoomImage(\""+ info[x].image_url +"\")'></td>";
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
                    
                    // str += "<td class='functions'>";
                    //     str += "<div class='dropdown'><div class='dropdownBtn'>Các thao tác</div>";
                    //         str += "<div class='dropdown-content'>";
                    //             str += "<a onclick='ProblemDetail(\""+ x +"\")' class='content-item'>Chi tiết</a>";
                    //             str += "<a onclick='CreateWork(\""+ x +"\")' class='content-item'>Tạo công việc</a>";
                    //             if(info[x].status == "2")
                    //             {
                    //                 str += "<a onclick='PassProblem(\""+ x +"\")' class='content-item'>Duyệt</a>";
                    //             }
                    //             else
                    //             {
                    //                 str += "<a onclick='PassProblem(\""+ x +"\")' class='content-item disabled-link'>Duyệt</a>";
                    //             }
                    //             str += "<a onclick='WorkList(\""+ x +"\", false)' class='content-item'>Xem công việc</a>";
                    //         str += "</div>";
                    //     str += "</div>";
                    // str += "</td>";
                // str += "</tr>";
                    str += '<td>\
                        <div class="function">\
                            <a onclick="ProblemDetail(\''+ x +'\')"><img src="./image/XemChiTiet.jpg" alt=""></a>\
                            <span class="tip">Xem chi tiết</span>\
                        </div>\
                    </td>';
                    if(info[x].status == "2")
                    {
                        str += '<td>\
                                    <div class="function">\
                                        <a onclick="PassProblem(\''+ x +'\')"><img src="./../static/image/Duyet.png" alt=""></a>\
                                        <span class="tip">Duyệt</span>\
                                    </div>\
                                </td>';
                    }
                    else
                    {
                        str += '<td>\
                                    <div class="function">\
                                        <img src="./../static/image/Duyet.png" alt="" class="disabled-link">\
                                        <span class="tip">Duyệt</span>\
                                    </div>\
                                </td>';
                    }                    
                    str += '<td>\
                        <div class="function">\
                            <a onclick="CreateWork(\''+ x +'\')"><img src="./../static/image/TaoCongViec.png" alt=""></a>\
                            <span class="tip">Tạo công việc</span>\
                        </div>\
                    </td>\
                    <td>\
                        <div class="function">\
                            <a onclick="WorkList(\''+ x +'\', false)"><img src="./../static/image/XemCongViec.png" alt=""></a>\
                            <span class="tip">Xem công việc</span>\
                        </div>\
                    </td>\
                </tr>';
            }
        }
    str += "</table>";
    document.getElementById("problemNotDoneTable").innerHTML = str;
});

// var data_faq = firebase.database().ref("faqs");
// data_faq.on("value", function(snapshot) {
//     faqs = snapshot.val();
//     str = "<tr>";
//         str += "<th class='widthQuestion'>Câu hỏi</th>";
//         str += "<th class='widthAnswer'>Trả lời</th>";
//         str += "<th class='widthFunction'>Thao tác</th>";
//     str += "</tr>";
//     for (x in faqs) {
//         str += "<tr>";
//             str += "<td class='question'>"+ faqs[x].question +"</td>";
//             str += "<td class='answer'>"+ faqs[x].answer +"</td>";
//             str += "<td class='functions'>";
//                 str += "<a onclick='UpdateFAQ(\""+ x +"\")' class='function-item'>Cập nhật</a>";
//                 str += "<a onclick='DeleteFAQ(\""+ x +"\")' class='function-item'>Xóa</a>";
//             str += "</td>";
//             // str += "<td><button onclick='UpdateFAQ(\""+ x +"\")'>Cập nhật</button></td>";
//             // str += "<td><button onclick='DeleteFAQ(\""+ x +"\")'>Xóa</button></td>";
//         str += "</tr>";
//     }
//     document.getElementById("faqTable").innerHTML = str;
// });

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
        var str = '<div class="workTable" style="display: block;">\
                    <table border="1" width="100%">\
                        <tr>';
            if(isProblemDone)
            {
                str += "<th class='titleTable' colspan='3'>";
            }
            else
            {
                str += "<th class='titleTable' colspan='7'>";
            }
                    str += 'Danh sách công việc theo sự cố\
                    </th>\
                </tr>\
                <tr>';
                // str += "<th>Tên công việc</th>";
                // str += "<th>Người giải quyết</th>";
                // str += "<th>Hạn chót</th>";
                // if( !isProblemDone )
                // {
                //     str += "<th>Trạng thái</th>";
                //     str += "<th>Thao tác</th>";
                // }
                if( isProblemDone )
                {
                    str += '<th width="50%">Tên công việc</th>\
                            <th width="25%">Người giải quyết</th>\
                            <th width="25%">Hạn chót</th>';
                }
                else
                {
                    str += '<th width="30%">Tên công việc</th>\
                            <th width="18%">Người giải quyết</th>\
                            <th width="19%">Hạn chót</th>\
                            <th width="13%">Trạng thái</th>\
                            <th colspan="3" width="20%">Thao tác</th>';
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
                        // str += "<td class='functions'>";
                        //     str += "<div class='dropdown'><div class='dropdownBtn'>Các thao tác</div>";
                        //         str += "<div class='dropdown-content'>";
                        //         if(works[x].status == "0")
                        //         {
                        //             str += "<a onclick='UpdateWork(\""+ x +"\")' class='content-item'>Cập nhật</a>";
                        //             str += "<a onclick='DeleteWork(\""+ x +"\")' class='content-item'>Xóa</a>";
                        //         }
                        //         else
                        //         {
                        //             str += "<a href='' class='content-item disabled-link'>Cập nhật</a>";
                        //             str += "<a href='' class='content-item disabled-link'>Xóa</a>";
                        //         }
                                
                        //         if(works[x].status == "2")
                        //         {
                        //             str += "<a onclick='MoveWork(\""+ x +"\")' class='content-item'>Chuyển</a>";
                        //         }
                        //         else
                        //         {
                        //             str += "<a href='' class='content-item disabled-link'>Chuyển</a>";
                        //         }
                        //         str += "</div>";
                        //     str += "</div>";
                        // str += "</td>";
                        
                        if(works[x].status == "0")
                        {
                            str += '<td>\
                                        <div class="function">\
                                            <a onclick="UpdateWork(\''+ x +'\')"><img src="./../static/image/update.png" alt=""></a>\
                                            <span class="tip">Cập nhật</span>\
                                        </div>\
                                    </td>\
                                    <td>\
                                        <div class="function">\
                                            <a onclick="DeleteWork(\''+ x +'\')"><img src="./../static/image/delete.png" alt=""></a>\
                                            <span class="tip">Xóa</span>\
                                        </div>\
                                    </td>';
                        }
                        else
                        {
                            str += '<td>\
                                        <div class="function">\
                                            <img src="./../static/image/update.png" alt="" class="disabled-link">\
                                            <span class="tip">Cập nhật</span>\
                                        </div>\
                                    </td>\
                                    <td>\
                                        <div class="function">\
                                            <img src="./../static/image/delete.png" alt="" class="disabled-link">\
                                            <span class="tip">Xóa</span>\
                                        </div>\
                                    </td>';
                        }                        
                        if(works[x].status == "2")
                        {
                            str += '<td>\
                                        <div class="function">\
                                            <a onclick="MoveWork(\''+ x +'\')"><img src="./../static/image/moveWork.png" alt=""></a>\
                                            <span class="tip">Chuyển</span>\
                                        </div>\
                                    </td>';
                        }
                        else
                        {
                            str += '<td>\
                                        <div class="function">\
                                            <img src="./../static/image/moveWork.png" alt="" class="disabled-link">\
                                            <span class="tip">Chuyển</span>\
                                        </div>\
                                    </td>';
                        }
                    }
                str += "</tr>";
            }
        str += "</table>";
        document.getElementById("modalContent").innerHTML = str;
        document.getElementById('modalFrame').style.display = 'block';
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

function ChooseMenuItem(event, tableType)
{
    var menuItemList = document.getElementsByClassName('menuItem');
    for(item of menuItemList)
    {
        item.classList.remove('menuItemActive');
    }

    var tabContentList = document.getElementsByClassName('tabContent');
    for(tab of tabContentList)
    {
        tab.style.display = 'none';
    }

    document.getElementById(tableType).style.display = 'block';
    event.currentTarget.classList.add('menuItemActive');
}

document.getElementById('modalClose').onclick = function() {
    document.getElementById('modalFrame').style.display = 'none';
}
