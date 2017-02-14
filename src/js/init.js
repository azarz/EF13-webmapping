/******** Variables globales *******/

var btnSearch;

var map;
var markers = [];

window.onload = init;


/************ Initialisation de la page ****************/

function init(){
    initMap();
    btnSearch = document.getElementById("btnSearch");
    btnSearch.addEventListener('click', searchInternships);
}

function initMap() {
    /**
    Initalisation de la map, centrée sur l'ENSG
    */
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(48.841014, 2.587320),
    });
}



/************* Écouteurs d'évènements ***************/

function searchInternships(event){
    /**
    Recherche des stages en fonction de la position de recherche
    */

    // On empêche le comportement par défaut
    event.preventDefault();

    // Récupération des coordonnées du centre de la carte
    var centerLat = map.getCenter().lat();
    var centerLon = map.getCenter().lng();

    
    var request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
            if(request.readyState == 4 && request.status == 200) {

                result = request.responseText;
                internshipList = JSON.parse(result);
                console.log(internshipList);

            }
        });

        request.open('GET', 'server/get_internship.php?lat=' + centerLat + '&lon='+ centerLon, true);
        request.send();
}
