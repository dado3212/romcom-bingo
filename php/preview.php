<?php
    // From SO: https://stackoverflow.com/a/26905377/3951475
    function imagettfstroketext(&$image, $size, $angle, $x, $y, &$textcolor, &$strokecolor, $fontfile, $text, $px) {
        for($c1 = ($x-abs($px)); $c1 <= ($x+abs($px)); $c1++)
            for($c2 = ($y-abs($px)); $c2 <= ($y+abs($px)); $c2++)
                $bg = imagettftext($image, $size, $angle, $c1, $c2, $strokecolor, $fontfile, $text);
        return imagettftext($image, $size, $angle, $x, $y, $textcolor, $fontfile, $text);
    }

    // Function to wrap text within the specified width
    function wrapText($font_size, $font, $text, $max_width) {
        $words = explode(' ', $text);
        $lines = [];
        $current_line = '';

        foreach ($words as $word) {
            $test_line = $current_line === '' ? $word : $current_line . ' ' . $word;
            $text_box = imagettfbbox($font_size, 0, $font, $test_line);
            $text_width = $text_box[2] - $text_box[0];

            if ($text_width > $max_width && $current_line !== '') {
                $lines[] = $current_line;
                $current_line = $word;
            } else {
                $current_line = $test_line;
            }
        }

        if ($current_line !== '') {
            $lines[] = $current_line;
        }

        return $lines;
    }

    function drawCentered($image, $block_width, $block_height, $x, $y, $text, $text_color) {
        putenv("GDFONTPATH=/usr/share/fonts/truetype/dejavu");
        $font = "DejaVuSansMono.ttf"; // Using DejaVu Sans Mono as an example

        // Start with a large font size and decrease until the text fits within the block
        $font_size = 120;
        $lines = [];
        while ($font_size > 5) {
            $lines = wrapText($font_size, $font, $text, $block_width);
            $total_text_height = count($lines) * $font_size * 1.4; // Assuming 1.2 line height

            if ($total_text_height <= $block_height) {
                break;
            }
            $font_size--;
        }

        $white_color = imagecolorallocate($image, 255, 255, 255);

        $text_y = $y + ($block_height - $total_text_height) / 2 + $font_size; // Adjust starting y position

        foreach ($lines as $line) {
            $text_box = imagettfbbox($font_size, 0, $font, $line);
            $text_width = $text_box[2] - $text_box[0];
            $text_x = $x + ($block_width - $text_width) / 2;

            imagettfstroketext($image, $font_size, 0, $text_x, $text_y, $text_color, $white_color, $font, $line, 7);
            $text_y += $font_size * 1.4; // Move to the next line
        }
    }

    // Array of color options
    $options = ['blue', 'green', 'orange', 'pink', 'red', 'teal', 'yellow'];

    if (
        isset($_GET["name"]) &&
        strlen($_GET["name"]) >= 0 &&
        strlen($_GET["name"]) <= 100
    ) {
        $name = htmlspecialchars(strtoupper($_GET["name"]));

        // Select a random background image
        srand(crc32($name));
        $image = imagecreatefromjpeg("./../assets/imgs/" . $options[array_rand($options)] . ".jpg");

        // Set text color to black
        $text_color = imagecolorallocate($image, 0, 0, 0);

        // Define the block dimensions and position
        $block_width = 420; // Width of the block
        $block_height = 100; // Height of the block
        $block_x = 125; // X position of the block
        $block_y = 153; // Y position of the block

        // Write the text within the block
        drawCentered($image, $block_width, $block_height, $block_x, $block_y, $name, $text_color);

        header("Content-Type: image/jpg");
        imagejpeg($image);
        imagedestroy($image);
    } else {
        header("Content-Type: image/jpg");
        readfile("./../assets/imgs/" . $options[array_rand($options)] . ".jpg");
    }

?>
