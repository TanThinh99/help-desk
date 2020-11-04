user = document.getElementById("user").value;
data_problem = firebase.database().ref("problems").orderByChild("user_create").equalTo(user);
data_problem.once("value", function(snapshot) {
    problems = snapshot.val();
    str = "<table border='1'>";
        str += "<tr>";
            str += "<th>content</th>";
            str += "<th>image</th>";
            str += "<th>status</th>";
            str += "<th></th>";
        str += "</tr>";
        for(x in problems) {
            str += "<tr>";
                str += "<td>"+ problems[x].content +"</td>";
                str += "<td><img src='"+ problems[x].image_url +"' alt='"+ problems[x].image_name +"' style='height: 50px'</td>";
                str += "<td>"+ problems[x].status +"</td>";
                str += "<td><button onclick='ProblemDetail(\""+ x +"\")'>Xem</button></td>";
            str += "</tr>";
        }
    str += "</table>";
    document.getElementById("problems").innerHTML = str;
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

function ProblemDetail(problem_key) {
    window.location.href = "../ProblemDetail/"+ problem_key;
}