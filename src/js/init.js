var btnSearch;

var map;

window.onload = init;


function init(){
    initMap();
    btnSearch = document.getElementById("btnSearch");
    btnSearch.addEventListener('click', searchInternships);
    
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center:new google.maps.LatLng(48.841014, 2.587320),
    });
}



function position(event){

    // On empêche le comportement par défaut
    event.preventDefault();

    // Récupération des coordonnées du centre de la carte
    var centerLat = map.getCenter().lat();
    var centerLon = map.getCenter().lng();

    
    var request = new XMLHttpRequest();

    request.addEventListener('readystatechange',    function(e) {
            if(request.readyState == 4 && request.status == 200) {

                result = request.responseText;
                internshipList = JSON.parse(result);

            }
        });

        request.open('GET', 'server/get_internship.php?lat=' + centerLat + '&lon='+ centerLon, true);
        request.send();
}
