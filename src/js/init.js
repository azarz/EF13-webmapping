var okHTML;

var map,liste_pos;

window.onload = init;


function init(){
    okHTML = document.getElementById("valider");
    okHTML.addEventListener('click',position);
    initMap();

}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center:new google.maps.LatLng(0,0),
});
}



function position(e){

    e.preventDefault();
    var xmin = document.getElementById("xmin").value;
    console.log(xmin);
    var xmax = document.getElementById("xmax").value;
    var ymin = document.getElementById("ymin").value;
    var ymax = document.getElementById("ymax").value;


    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'tp_6_02.php?xmin=' + xmin + '&ymin='+ ymin+ '&xmax=' + xmax +'&ymax='+ymax, true);
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    ajax.addEventListener('readystatechange',    function(e) {
            if(ajax.readyState == 4 && ajax.status == 200) {
                result=ajax.responseText;
                console.log(result);
                monJson = JSON.parse(result);
                //console.log(monJson);
                //console.log(result);
                liste_pos=[];
                for(i=0; i<monJson.length; i++){
                    var res='{ "latitude" : '+monJson[i].latitude+', "longitude" : '+monJson[i].longitude+'}'
                    var res2= JSON.parse(res);
                    var res3= new google.maps.LatLng(monJson[i].latitude, monJson[i].longitude);
                    liste_pos.push(res3);}
                    var markers = liste_pos.map(function(location, i) {
                        return new google.maps.Marker({
                            position: location,
                            //label: labels[i % labels.length]
                        });
                    });
                    var markerCluster = new MarkerClusterer(map, markers,
                            {imagePath: 'm'
                        });
                }
                    /*var myLatlng = new google.maps.LatLng(monJson[i].latitude,monJson[i].longitude);
                    var tdt = new google.maps.Marker({
                        position: myLatlng,
                    });

                    tdt.setMap(map);
                }
                console.log(liste_pos);*/


            //on execute la requete
        });
        ajax.send();
}
