<?php
	
	// Récupération de la donnée envoyée par le client
	$newDataJSON = pg_escape_string($_POST["data"]);
	$newData = json_decode($newDataJSON, true);

	// Lien vers la base de données postGIS en local
	$link = pg_connect("host=localhost port=5432 dbname=internships user=postgres password=postgres");

	if(!$link){
		die('Erreur de connexion');
	}

	// On parcourt les données reçues en modifiant la BDD en conséquence
	foreach($newData as $dataRow){
		$lat_c = $dataRow['lat_c'];
		$lng_c = $dataRow['lng_c'];
		$id = $dataRow['id'];
		$request = "UPDATE internships
					SET lat_c = $lat_c, lng_c = $lng_c
					WHERE id = $id";

		$result = pg_query($link, $request);

		if(!$result) { 
			die('Erreur de requête'); 
		}

		echo 'mise à jour OK';
	}
?>