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