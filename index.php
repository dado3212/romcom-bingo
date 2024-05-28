<!DOCTYPE html>
<html>
    <head>
        <?php
			// Respects 'Request Desktop Site'
			if (preg_match("/(iPhone|iPod|iPad|Android|BlackBerry)/i", $_SERVER["HTTP_USER_AGENT"])) {
				?><meta name="viewport" content="width=device-width, initial-scale=1.0"><?php
			}
        ?>

        <title>Rom-com Bingo</title>

        <?php
        function rs( $length = 8 ) { $chars = "abcdefghijklmnopqrstuvwxyz0123456789"; $rs = substr( str_shuffle( $chars ), 0, $length ); return $rs; } 
        ?>
        <link rel="stylesheet" type="text/css" href="css/main.css?id=<?php echo rs(); ?>">

        <script>
            window.onload = () => {
                const elements = document.querySelectorAll('.option');

                // Add a click event listener to each element
                elements.forEach(function(element) {
                    element.addEventListener('click', function() {
                        // This function is called whenever an element with 'your-class-name' is clicked
                        this.classList.toggle('selected');
                    });
                });
            };
        </script>
    </head>
    <body>
        <h1>Rom-com Bingo!</h1>
        <span>Your one stop shop for your second screen experience.</span>

        <div class="bingo">

        </div>
        
        <?php
            $default = [
                "Sharing food",
                "In the back of a car",
                "Reveal of emotion in very public place",
                "Classically chivalrous move",
                "Full breakfast that no one eats",
                "Poorly filmed FaceTime call",
                "Towel sequence",
                "Family weighing in",
                "Love triangle",
                "Texts on screen",
                "Cheating(?)",
                "They have sex",
                "Wake up flawless",
                "Tears",
                "This is an ad",
                "\"I want to pause\"",
                "It'll never work",
                "Denial of feelings",
                "Best friend gasp (deetz)",
                "Easy miscommunication",
                "Wisdom of teens",
                "They say the title",
                "Smack on the ass",
                "Drone footage",
                "Very obvious Chekov’s gun",
                "Fun credits sequence (opening/closing)",
                "Relationship broken up",
                "Time-skip",
                "Running through the airport",
                "Clumsy moment",
                "Almost kiss",
                "Accent!",
                "Travel montage",
                "Best friend heart to heart",
                "Matchmaker",
                "Overworked",
                "Double down",
            ];

            foreach ($default as $option) {
                echo '<div class="option">' . $option . '</div>';
            }
        ?>
    </body>
</html>