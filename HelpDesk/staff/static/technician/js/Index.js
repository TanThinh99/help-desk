user = document.getElementById("user").value;
var data = firebase.database().ref("works").orderByChild("user_fix").equalTo(user);
data.on("value", function(snapshot) {
    works = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>work_name</th>";
            str += "<th>deadline</th>";
            str += "<th>status</th>";
            str += "<th></th>";
        str += "</tr>";
        for(x in works) {
            str += "<tr>";
                str += "<td>"+ works[x].work_name +"</td>";
                str += "<td>"+ works[x].deadline +"</td>";
                str += "<td>"+ works[x].status +"</td>";
                str += "<td><button onclick='WorkDetail(\""+ x +"\")'>Xem</button></td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("works").innerHTML = str;
});

var data_solution = firebase.database().ref("solutions").orderByChild("user_fix").equalTo(user);
data_solution.once("value", function(snapshot) {
    solutions = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>work</th>";
            str += "<th>content</th>";
            str += "<th>time_fix</th>";
        str += "</tr>";
        for(x in solutions) {
            str += "<tr>";
                firebase.database().ref("works").child(solutions[x].work).once("value", function(snapshot) {
                    work_name = snapshot.val().work_name;
                    str += "<td>"+ work_name +"</td>";
                });
                str += "<td>"+ solutions[x].content +"</td>";
                str += "<td>"+ solutions[x].time_fix +"</td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("solutions").innerHTML = str;
});

var data_faq = firebase.database().ref("faqs");
data_faq.once("value", function(snapshot) {
    faqs = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>question</th>";
            str += "<th>answer</th>";
        str += "</tr>";
        for(x in faqs) {
            str += "<tr>";
                str += "<td>"+ faqs[x].question +"</td>";
                str += "<td>"+ faqs[x].answer +"</td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("faqs").innerHTML = str;
});

function WorkDetail(work_key) {
    window.location.href = "WorkDetail/"+ work_key;
}