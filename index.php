<!DOCTYPE html>
<html lang="en">
    <head>
        <?php
            include("php/secret.php");

            error_reporting(E_ALL);
            ini_set('display_errors', 'On');

            // Get the default tags
            $PDO = getDatabase();
            $tags_stmt = $PDO->prepare("SELECT `index`, `text` FROM tags WHERE `index` != 1 AND `default` = TRUE;");
            $tags_stmt->execute();

            $tags = $tags_stmt->fetchAll();
            
			// Respects 'Request Desktop Site'
			if (preg_match("/(iPhone|iPod|iPad|Android|BlackBerry)/i", $_SERVER["HTTP_USER_AGENT"])) {
				?><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"><?php
			}
        ?>

        <title>Rom-com Bingo</title>

        <?php
        function rs( $length = 8 ) { $chars = "abcdefghijklmnopqrstuvwxyz0123456789"; $rs = substr( str_shuffle( $chars ), 0, $length ); return $rs; } 
        ?>
        <link rel="stylesheet" type="text/css" href="/projects/bingo/assets/main.css?id=<?php echo rs(); ?>">
        <script type="module" src="/projects/bingo/assets/common.js"></script>
        <script type="module" src="/projects/bingo/assets/main.js"></script>
        <style>
            @media (max-width: 650px) {
                html {
                    overflow: auto;
                }

                body {
                    height: calc(100dvh - 300px - 8px - 2 * 10px);
                    overflow: scroll;
                }

                .selector {
                    position: absolute;
                    left: 0px;
                    bottom: 0px;

                    z-index: 2;

                    height: 300px;
                    padding: 10px;
                    overflow-y: scroll;

                    background-color: white;
                    border-top: 2px solid #143347;
                }
            }
        </style>
    </head>
    <body>
        <div class="marquee">
            <div class="header">
                <div class="title">Rom-Com Bingo</div>
            </div>
            <div class="center">
                <div class="text">
                    <p>Coming Soon</p>
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

        <button id="create" disabled>Create Bingo</button>
        
        <div class="selector">
            <div class="option add">_________</div>
            <?php
            foreach ($tags as $tag) {
                echo '<div class="option" data-index="' . $tag['index'] . '">' . $tag['text'] . '</div>';
            }
            ?>
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
                <form>
                    <h2>Create Bingo</h2>
                    <div id="error"></div>
                    <label for="movieName">Movie name:</label>
                    <input type="text" id="movieName" name="movieName" placeholder="Enter the movie title here" maxlength="100">
                    <button type="submit" id="submitBingo">Submit</button>
                </form>
                <a class="shareLink" href="" target="_blank">Share Bingo Screen!</a>
            </div>
        </div>

        <!-- Used for the popup when creating a new tag -->
        <div id="newTag" class="popup">
            <div class="popup-content">
                <span class="close">&times;</span>
                <form>
                    <h2>Create Tag</h2>
                    <label for="tagText">Tag text:</label>
                    <input type="text" id="tagText" name="tagText" placeholder="Enter the text of the tag here" maxlength="100">
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    </body>
</html>