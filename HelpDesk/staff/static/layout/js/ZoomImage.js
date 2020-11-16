function ZoomImage(link) 
{
    document.getElementById("imageNeedZoom").src = link;
    document.getElementById("zoomImage").style.display = "block";
}

function CloseImage()
{
    document.getElementById("zoomImage").style.display = "none";
}