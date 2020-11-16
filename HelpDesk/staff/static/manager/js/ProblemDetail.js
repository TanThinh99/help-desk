var dsUser = [];
users = firebase.database().ref("users").once("value", function(snapshot) {
    users = snapshot.val()
    for(key in users)
    {
        dsUser[key] = users[key].name;
    }   
});

problem_key = document.getElementById("problem_key").value;
data_reply = firebase.database().ref("replies").orderByChild("problem").equalTo(problem_key);
data_reply.on("value", function(snapshot) {
    replies = snapshot.val();
    str = "";
    for(key in replies)
    {
        str += "<div style='border: 1px dashed gray; margin: 4px 0px 4px 0px; padding-left: 6px'>";
            str += "<p>";
                str += "<strong>"+ dsUser[replies[key].user_create] +"</strong>";
                str += " <em>"+ replies[key].time +"</em>";
            str += "</p>";
            str += "<p>"+ replies[key].content +"</p>";
            if(replies[key].image_url != "")
            {
                str += "<img src='"+ replies[key].image_url +"' style='height: 80px'>";
            }                
        str += "</div>";
    }
    document.getElementById("replies").innerHTML = str;
});

document.getElementById("guiPhanHoiBtn").onclick = function() 
{
    var status = document.getElementById("status").value;
    if(status != "3")
    {
        var content = document.getElementById("content").value;
        file = document.getElementById("image").files[0];
        if(file != undefined)
        {
            d = new Date();
            now = d.toISOString()

            storage = firebase.storage();
            storageRef = storage.ref();
            thisRef = storageRef.child(now).put(file);

            thisRef.on("state_changed", function(snapshot) {
                console.log("Upload file successful");
            },
            function(error) {

            },
            function() {
                //Download url of file
                thisRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    document.getElementById("image_url").value = downloadURL;
                    $.get("../CreateReply/", {
                        "problem_key": problem_key, 
                        "content": content, 
                        "image_url": downloadURL
                    }, function(data) {
                        
                    });
                })
            })
        }
        else
        {
            $.get("../CreateReply/", {
                "problem_key": problem_key, 
                "content": content, 
                "image_url": "0"
            }, function(data) {
                
            });
        }
        ResetReply();
    }
    else
    {
        alert("Sự cố này đã được giải quyết xong. Không thể gửi phản hồi nữa");
    }
}

function ResetReply()
{
    document.getElementById("content").value = "";
    document.getElementById("image").value = "";
}