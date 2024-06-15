<!DOCTYPE html>
<html lang="en">
    <head>
        <?php
            include("php/secret.php");

            error_reporting(E_ALL);
            ini_set('display_errors', 'On');

            // Get all of the tags that we want to use
            $PDO = getDatabase();
            $bingo = intval($_GET["bingo"] ?? "");
            // If there is a bingo, then redirect, this page is only for playing existing bingos
            if ($bingo === 0) {
                header('Location: //alexbeals.com/projects/bingo/');
            }
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
            
			// Respects 'Request Desktop Site'
			if (preg_match("/(iPhone|iPod|iPad|Android|BlackBerry)/i", $_SERVER["HTTP_USER_AGENT"])) {
				?><meta name="viewport" content="width=device-width, initial-scale=1.0"><?php
			}
        ?>

        <title>Rom-com Bingo</title>

        <?php
        function rs( $length = 8 ) { $chars = "abcdefghijklmnopqrstuvwxyz0123456789"; $rs = substr( str_shuffle( $chars ), 0, $length ); return $rs; } 
        ?>
        <link rel="stylesheet" type="text/css" href="/projects/bingo/assets/main.css?id=<?php echo rs(); ?>">
        <script type="module" src="/projects/bingo/assets/common.js"></script>
        <script type="module" src="/projects/bingo/assets/play.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
    </head>
    <body>
        <div class="marquee">
            <div class="header">
                <div class="title">Rom-Com Bingo</div>
            </div>
            <div class="center">
                <div class="text">
                    <p>
                    <?php 
                        echo $movie_name;
                    ?>
                    </p>
                </div>
            </div>
        </div>

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
        <div class="colors">
        </div>

        <!-- Used for the background image when selecting -->
        <svg width="0" height="0">
            <filter id="grainy" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".537"></feTurbulence>
                <feColorMatrix type="saturate" values="0"></feColorMatrix>
                <feBlend mode="multiply" in="SourceGraphic"></feBlend>
            </filter>
        </svg>
    </body>
</html>