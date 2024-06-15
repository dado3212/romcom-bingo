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

        <!-- Meta tags -->
        <meta name="robots" content="index, follow, archive">
        <meta name="description" content="Make bingo boards and play along as you watch a trope-filled rom-com! Come up with your own tropes, or use some of our common ones. It's the perfect second screen experience!">
        <meta charset="utf-8" />
        <meta http-equiv="Cache-control" content="public">

        <!-- SEO and Semantic Markup -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:creator" content="@alex_beals">

        <meta property="og:title" content="Rom-Com Bingo">
        <meta property="og:type" content="website">
        <meta property="og:image" content="https://alexbeals.com/projects/bingo/php/preview.php">
        <meta property="og:url" content="https://alexbeals.com/projects/bingo/">
        <meta property="og:description" content="Make bingo boards and play along as you watch a trope-filled rom-com! Come up with your own tropes, or use some of our common ones. It's the perfect second screen experience!">

        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="/projects/bingo/assets/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/projects/bingo/assets/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/projects/bingo/assets/favicon/favicon-16x16.png">
        <link rel="manifest" href="/projects/bingo/assets/favicon/site.webmanifest">
        <link rel="mask-icon" href="/projects/bingo/assets/favicon/safari-pinned-tab.svg" color="#5bbad5">
        <link rel="shortcut icon" href="/projects/bingo/assets/favicon/favicon.ico">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="msapplication-config" content="/projects/bingo/assets/favicon/browserconfig.xml">
        <meta name="theme-color" content="#ffffff">

        <title>Rom-com Bingo</title>

        <link rel="stylesheet" type="text/css" href="/projects/bingo/assets/main.css">
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