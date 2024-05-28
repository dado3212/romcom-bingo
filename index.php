<!DOCTYPE html>
<html>
    <head>
        <?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');

			// Respects 'Request Desktop Site'
			if (preg_match("/(iPhone|iPod|iPad|Android|BlackBerry)/i", $_SERVER["HTTP_USER_AGENT"])) {
				?><meta name="viewport" content="width=device-width, initial-scale=1.0"><?php
			}

            include("php/secret.php");

            // Get all of the tags that we want to use
            $PDO = getDatabase();
            // Index 1 is 'Free Space'
            $tags_stmt = $PDO->prepare("SELECT `index`, `text` FROM tags WHERE `index` != 1;");
            $tags_stmt->execute();

            $tags = $tags_stmt->fetchAll();

            // print_r(var_export($tags, true));

            // if ($stmt->rowCount() == 1) {
            //     $color = $stmt->fetch()["color"];

            //     // Increment count of times viewed by one
            //     $stmt = $PDO->prepare("UPDATE associations SET count = count + 1 WHERE query=:query");
            //     $stmt->bindValue(":query", $query, PDO::PARAM_STR);
            //     $stmt->execute();
            // } else {
            //     // Query is new, generate it
            //     $color = getColorFromImages(getImagesFromWord($query));

            //     // Check to make sure that someone didn't JUST add it
            //     $stmt = $PDO->prepare("SELECT * FROM associations WHERE query=:query");
            //     $stmt->bindValue(":query", $query, PDO::PARAM_STR);
            //     $stmt->execute();

            //     if ($stmt->rowCount() == 0) {
            //         // Add it to the database
            //         $add = $PDO->prepare("INSERT INTO associations (query, color) VALUES (:query, :color)");
            //         $add->bindValue(":query", $query, PDO::PARAM_STR);
            //         $add->bindValue(":color", $color, PDO::PARAM_STR);
            //         $add->execute();
            //     } else {
            //         $color = $stmt->fetch()["color"];

            //         // Increment count of times viewed by one
            //         $stmt = $PDO->prepare("UPDATE associations SET count = count + 1 WHERE query=:query");
            //         $stmt->bindValue(":query", $query, PDO::PARAM_STR);
            //         $stmt->execute();
            //     }
            // }
        ?>

        <title>Rom-com Bingo</title>

        <?php
        function rs( $length = 8 ) { $chars = "abcdefghijklmnopqrstuvwxyz0123456789"; $rs = substr( str_shuffle( $chars ), 0, $length ); return $rs; } 
        ?>
        <link rel="stylesheet" type="text/css" href="assets/main.css?id=<?php echo rs(); ?>">
        <script src="assets/main.js"></script>
    </head>
    <body>
        <h1>Rom-com Bingo!</h1>
        <div>Your one stop shop for your second screen experience.</div>

        <div class="bingo">
            <div class="row">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
            <div class="row">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
            <div class="row">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"><p>Free Space ★</p></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
            <div class="row">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
            <div class="row">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
        </div>
        
        <div class="selector">
        <?php
            foreach ($tags as $tag) {
                echo '<div class="option" data-index="' . $tag['index'] . '">' . $tag['text'] . '</div>';
            }
        ?>
        </div>

        <svg width="0" height="0">
            <filter id="grainy" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".537"></feTurbulence>
                <feColorMatrix type="saturate" values="0"></feColorMatrix>
                <feBlend mode="multiply" in="SourceGraphic"></feBlend>
            </filter>
        </svg>
    </body>
</html>