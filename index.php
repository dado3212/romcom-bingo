<!DOCTYPE html>
<html lang="en">
    <head>
        <?php
            include("php/secret.php");

            error_reporting(E_ALL);
            ini_set('display_errors', 'On');

            // Get all of the tags that we want to use
            $PDO = getDatabase();
            $bingo = intval($_GET["b"] ?? "");
            // If there is a bingo, then select it
            if ($bingo !== 0) {
                $bingo_stmt = $PDO->prepare(
                    "SELECT 
                        boards.`index`, boards.`tags`, movies.`name`
                    FROM boards
                    LEFT JOIN movies on movies.`index` = boards.`movie`
                    WHERE 
                        boards.`index`=:index"
                );
                $bingo_stmt->bindValue(":index", $bingo, PDO::PARAM_INT);
                $bingo_stmt->execute();

                $bingo_info = $bingo_stmt->fetch();
                // If you fail to find a matching bingo board, just redirect to the create screen
                if ($bingo_info === false) {
                    header('Location: //alexbeals.com/projects/bingo/');
                }
                $movie_name = $bingo_info['name'];
                $bingo_tags = json_decode($bingo_info['tags']);
                // Confirm that they're all numbers, otherwise redirect
                foreach ($bingo_tags as $tag) {
                    if (!intval($tag)) {
                        header('Location: //alexbeals.com/projects/bingo/');
                    }
                }

                $tag_info_stmt = $PDO->prepare("SELECT `index`, `text` FROM tags WHERE `index` IN (" . implode(',',$bingo_tags) . ");");
                $tag_info_stmt->execute();

                $raw_tag_info = $tag_info_stmt->fetchAll();

                $tag_info = [];
                foreach ($raw_tag_info as $tag) {
                    $tag_info[$tag['index']] = $tag['text'];
                }

                // Do a seeded randomization of the squares
                $randomization_seed = intval($_GET["r"] ?? "");
                if ($randomization_seed !== 0) {
                    mt_srand($randomization_seed);
                }
                $order = array_map(function ($val) { return mt_rand(); }, range(1, count($bingo_tags)));
                array_multisort($order, $bingo_tags);

                $json_data = [];
                foreach ($bingo_tags as $tag) {
                    $json_data[] = [
                        'text' => $tag_info[$tag],
                        'tagIndex' => $tag,
                    ];
                }

                echo "<script> var startingTags = " . json_encode($json_data) . ";</script>";
                $tags = [];
            } else {
                $tags_stmt = $PDO->prepare("SELECT `index`, `text` FROM tags WHERE `index` != 1 AND `default` = TRUE;");
                $tags_stmt->execute();
    
                $tags = $tags_stmt->fetchAll();
            }
            
			// Respects 'Request Desktop Site'
			if (preg_match("/(iPhone|iPod|iPad|Android|BlackBerry)/i", $_SERVER["HTTP_USER_AGENT"])) {
				?><meta name="viewport" content="width=device-width, initial-scale=1.0"><?php
			}
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
        <div>Your one stop shop for your second screen experience.<?php if ($bingo === 0) { echo " This is the create screen!"; } ?></div>

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
                <div class="cell"><p>Free Space</p></div>
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

        <?php if ($bingo === 0) {  ?>
            <button id="create" disabled>Create Bingo</button>
        <?php } ?>

        <?php if ($bingo !== 0) {  ?>
            <div class="colors">
            </div>
        <?php } ?>

        <?php if ($bingo !== 0) {  ?>
            <div class="movie">
                <img src="assets/clapper.svg"/>
                <p><?php echo $movie_name; ?></p>
            </div>
        <?php } ?>
        
        <div class="selector">
        <?php
            foreach ($tags as $tag) {
                echo '<div class="option" data-index="' . $tag['index'] . '">' . $tag['text'] . '</div>';
            }
        ?>
            <div class="option add">_________</div>
        </div>

        <!-- Used for the background image when selecting -->
        <svg width="0" height="0">
            <filter id="grainy" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".537"></feTurbulence>
                <feColorMatrix type="saturate" values="0"></feColorMatrix>
                <feBlend mode="multiply" in="SourceGraphic"></feBlend>
            </filter>
        </svg>

        <!-- Used for the popup when creating a bingo -->
        <div id="newBingo" class="popup">
            <div class="popup-content">
                <span id="closePopup" class="close">&times;</span>
                <h2>Create Bingo</h2>
                <label for="movieName">Movie name:</label>
                <input type="text" id="movieName" name="movieName" placeholder="Enter the movie title here">
                <button id="submitBingo">Submit</button>
                <a class="shareLink" href="" target="_blank">Share Bingo Screen!</a>
            </div>
        </div>

        <!-- Used for the popup when creating a new tag -->
        <div id="newTag" class="popup">
            <div class="popup-content">
                <span class="close">&times;</span>
                <h2>Create Tag</h2>
                <label for="tagText">Tag text:</label>
                <input type="text" id="tagText" name="tagText" placeholder="Enter the text of the tag here">
                <button id="submitTag">Submit</button>
            </div>
        </div>
    </body>
</html>