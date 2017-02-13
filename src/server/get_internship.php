<?php
	
	// Lien vers la base de données postGIS en local
	$link=pg_connect("host=localhost port=5432 dbname=internships user=postgres password=postgres");
	
	if(!$link){
		die('Erreur de connexion');
	}

	// Récupération des paramètres de la requête GET en les sécurisant
	// Il s'agit de la latitud et de la longitude du lieu de requête
	$lat_q = pg_escape_string($_GET["lat"]);
	$lon_q = pg_escape_string($_GET["lon"]);

	/**
	Le 0.25 dans le ST_DWithin de la clause WHERE correspond à une distance angulaire de 0.25° dans le système EPSG:4326, soit WGS84 plate carrée
	Ce qui correspond à peu près à 28 km car 1° correspond à 111 km à l'équateur et 28*4 = 112
	*/
	$requete = "SELECT id, lat, lng, lat_c, lng_c
				FROM internships 
				WHERE ST_DWithin( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_q, $lat_q), 4326), 0.25) 
				ORDER BY ST_Distance( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_q, $lat_q), 4326) ) ASC 
				LIMIT 30";

	$result = pg_query($link, $requete);

	if(!$result) { 
		die('Erreur de requête'); 
	}

	$tabOut = array() ; 

	while($ligne = pg_fetch_object($result)) {
		$tabOut[] = $ligne; 
	}

	echo json_encode($tabOut);

?>


