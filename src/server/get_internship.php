<?php

	$link=pg_connect("host=localhost port=5432 dbname=earth_quake user=postgres password=postgres");
	
	if(!$link){
		die('Erreur de connexion');
	}

	$n= pg_escape_string($_GET['N']);
	$xmin= pg_escape_string($_GET["xmin"]);
	$ymin= pg_escape_string($_GET["ymin"]);
	$xmax= pg_escape_string($_GET["xmax"]);
	$ymax= pg_escape_string($_GET["ymax"]);

	$tab= array('id','latitude','longitude','magnitude','profondeur');
	$requete = " SELECT id,latitude,longitude,magnitude,profondeur,dateheure
	FROM tdt_source WHERE ST_within( geom , ST_MakeEnvelope($xmin ,$ymin, $xmax, $ymax,4326 ) ) 
	ORDER BY magnitude DESC LIMIT $n ";

	$result = pg_query($link, $requete);

	if(!$result) { die ('erreur de requête'); }

	$tabOut = array() ; 

	while($ligne = pg_fetch_object($result)) {
		$tabOut[] = $ligne ; 
	}

	echo json_encode( $tabOut ) ;

?>


