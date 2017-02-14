<?php

	header("Content-Type: application/json; charset=UTF-8");
	
	// Lien vers la base de données postGIS en local
	$link=pg_connect("host=localhost port=5432 dbname=internships user=postgres password=postgres");
	
	if(!$link){
		die('Erreur de connexion');
	}

	// Récupération des paramètres de la requête GET en les sécurisant
	// Il s'agit de la latitude et de la longitude du lieu de recherche
	$lat_r = pg_escape_string($_GET["lat"]);
	$lon_r = pg_escape_string($_GET["lon"]);


	/**
	Requête pour les 2 stages les plus proches du lieu de recherche, contient toujours 2 résultats
	*/
	$requestNearest = "SELECT id, lat, lng, lat_c, lng_c
			FROM internships  
			ORDER BY ST_Distance( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_r, $lat_r), 4326) ) ASC 
			LIMIT 2";

	$resultNearest = pg_query($link, $requestNearest);

	if(!$resultNearest) { 
		die('Erreur de requête'); 
	}


	/**
	Requête pour les 28 stages les plus proches du lieu de recherche dans un rayon de 28km, potentiellement vide car on exclut les 2 résultats précédents
	Le 0.25 dans le ST_DWithin de la clause WHERE correspond à une distance angulaire de 0.25° dans le système EPSG:4326, soit WGS84 plate carrée
	Ce qui correspond à peu près à 28 km car 1° correspond à 111 km à l'équateur et 28*4 = 112
	*/
	$requestRadius = "SELECT id, lat, lng, lat_c, lng_c
				FROM internships 
				WHERE ST_DWithin( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_r, $lat_r), 4326), 0.25) 
				ORDER BY ST_Distance( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_r, $lat_r), 4326) ) ASC 
				LIMIT 28 OFFSET 2";

	$resultRadius = pg_query($link, $requestRadius);

	if(!$resultRadius) { 
		die('Erreur de requête'); 
	}


	// Notre sortie
	$tabOut = array() ; 

	// On commence par remplir avec les résultats plus proches
	while($ligne = pg_fetch_object($resultNearest)) {
		$tabOut[] = $ligne; 
	}

	// Puis on remplit les résultats dans un rayon de 28km
	while($ligne = pg_fetch_object($resultRadius)) {
		$tabOut[] = $ligne; 
	}

	// On écrit le résultat
	echo json_encode($tabOut);

?>


