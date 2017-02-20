/******** Variables globales *******/

// Éléments DOM
var btnSearch;
var btnSend;

// Éléments cartographiques
var map;
var oms;    //Pour la gestion des stages au même endroit
var redMarkers = [];
var blueMarkers = [];

// Liste des identifiants des stages chargés
var idList = [];

// Fonction au lancement de la fenêtre
window.onload = init;


/************ Initialisation de la page ****************/

function init(){
    initMap();
    searchInternships();
    btnSearch = document.getElementById("btnSearch");
    btnSearch.addEventListener('click', searchInternships);

    btnSend = document.getElementById("btnSend");
    btnSend.addEventListener('click', sendPosition);
}

function initMap() {
    /**
    Initalisation de la map, centrée sur l'ENSG
    */
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(48.841014, 2.587320),
    });

    oms = new OverlappingMarkerSpiderfier(map);
}



/************* Écouteurs d'évènements ***************/

function searchInternships(event){
    /**
    Recherche des stages en fonction de la position de recherche, et ajout de marqueurs
    */

    // On empêche le comportement par défaut
    if(event){
        event.preventDefault();
    }

    // Récupération des coordonnées du centre de la carte
    var centerLat = map.getCenter().lat();
    var centerLon = map.getCenter().lng();

    
    var request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function() {
        if(request.readyState == 4 && request.status == 200) {

            // Récupération du JSON
            result = request.responseText;
            internshipList = JSON.parse(result);

            // Suppression des précédents marqueurs
            for (i = 0; i < redMarkers.length; i++){
                redMarkers[i].setMap(null);
                blueMarkers[i].setMap(null);
            }
            redMarkers = [];
            blueMarkers = [];
            idList = [];


            // Définition des numéros des marqueurs
            var labels = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var labelIndex = 0;

            // On parcourt la liste des résultats
            for(i = 0; i < internshipList.length; i++){
                // Initialisation de la position des marqueurs
                var redLatLng = {lat: internshipList[i].lat, lng: internshipList[i].lng};
                var blueLatLng;

                // Si une position corrigée est disponible, on l'utilise pour le marqueur bleu
                if(internshipList[i].lat_c && internshipList[i].lng_c){
                    blueLatLng = {lat: internshipList[i].lat_c, lng: internshipList[i].lng_c};
                // Sinon, on utilise la position d'origine
                } else{
                    blueLatLng = {lat: internshipList[i].lat, lng: internshipList[i].lng};
                }

                // Numéro du marqueur
                var numero = labels[labelIndex++ % labels.length];

                // Définition des marqueurs et ajout à leur liste respective
                var redMarker = new google.maps.Marker({
                    draggable: false,
                    position: redLatLng,
                    icon: {url: 'http://maps.google.com/mapfiles/ms/icons/red.png', labelOrigin: {x:15,y:10}},
                    label: numero,
                    map: map,
                    zIndex: 4
                });

                redMarkers.push(redMarker);
                oms.addMarker(redMarker);

                var blueMarker = new google.maps.Marker({
                    draggable: true,
                    position: blueLatLng,
                    icon: {url: 'http://maps.google.com/mapfiles/ms/icons/blue.png', labelOrigin: {x:15,y:10}},
                    label: numero,
                    map: map,
                    zIndex: 5
                });

                blueMarkers.push(blueMarker);
                oms.addMarker(blueMarker);

                // Ajout de l'identifiant dans l'ordre de lecture
                idList.push(internshipList[i].id);
            }

        } 
    });

        // On envoie la requête au serveur
        request.open('GET', 'server/get_internship.php?lat=' + centerLat + '&lon='+ centerLon, true);
        request.send();
}



function sendPosition(event){
    /**
    Envoi des posistion corrigées des marqueurs bleus au serveur
    */

    // On empêche le comportement par défaut
    event.preventDefault();

    // Tableau des nouvelles positions
    var newPos = [];

    // On le remplit avec des tableaux associatifs de coordonnées corrigées correspondant à un ID
    for (i = 0; i < blueMarkers.length; i++){
        var row = {id: idList[i], 
                   lat_c: blueMarkers[i].getPosition().lat(),
                   lng_c: blueMarkers[i].getPosition().lng()
        };

        newPos.push(row);
    }

    // On convertit en JSON
    newPosJSON = JSON.stringify(newPos);

    sendRequest = new XMLHttpRequest();

    // On prévient losque la mise à jour est terminée
    sendRequest.addEventListener('readystatechange', function(){
        if(sendRequest.readyState == 4 && sendRequest.status == 200){
            alert('Modification enregistrée')
        }
    });

    // On envoie la requpete au serveur
    sendRequest.open('POST', 'server/update_db.php', true);
    sendRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    sendRequest.send("data=" + newPosJSON);
}
