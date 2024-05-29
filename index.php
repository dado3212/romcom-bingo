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
                $bingo_stmt = $PDO->prepare("SELECT `index`, `tags` FROM boards WHERE `index`=:index");
                $bingo_stmt->bindValue(":index", $bingo, PDO::PARAM_INT);
                $bingo_stmt->execute();

                $bingo_info = $bingo_stmt->fetch();
                // If you fail to find a matching bingo board, just redirect to the create screen
                if ($bingo_info === false) {
                    header('Location: //alexbeals.com/projects/bingo/');
                }
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

                // print_r(var_export(json_encode($json_data), true));
                echo "<script> var startingTags = " . json_encode($json_data) . ";</script>";
                $tags = [];
            } else {
                $tags_stmt = $PDO->prepare("SELECT `index`, `text` FROM tags WHERE `index` != 1");
                $tags_stmt->execute();
    
                $tags = $tags_stmt->fetchAll();
            }

            // print_r(var_export($tags, true));

            
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
            <button class="create">Create Bingo</button>
        <?php } ?>

        <?php if ($bingo !== 0) {  ?>
            <div class="colors">
            </div>
        <?php } ?>
        
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