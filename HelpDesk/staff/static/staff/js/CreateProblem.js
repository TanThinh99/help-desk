document.getElementById("submitBtn").onclick = function() {
    file = document.getElementById("image").files[0];
    if(file != undefined)
    {
        d = new Date();
        now = d.toISOString();
            // UploadFile
        storage = firebase.storage();

        storageRef = storage.ref();

        thisRef = storageRef.child(now).put(file);

        thisRef.on("state_changed", function(snapshot) {
            console.log("Upload file successfully");
        },
        function(error) {

        },
        function() {
            // Upload file done, download url of file
            thisRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                document.getElementById("image_url").value = downloadURL;
                document.getElementById("createProblemForm").submit();
            });
        });
    }
    else
    {
        document.getElementById("createProblemForm").submit();
    }        
}