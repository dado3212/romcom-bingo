<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'On');

  // From SO: https://stackoverflow.com/a/26905377/3951475
  function imagettfstroketext(&$image, $size, $angle, $x, $y, &$textcolor, &$strokecolor, $fontfile, $text, $px) {
    for($c1 = ($x-abs($px)); $c1 <= ($x+abs($px)); $c1++)
        for($c2 = ($y-abs($px)); $c2 <= ($y+abs($px)); $c2++)
            $bg = imagettftext($image, $size, $angle, $c1, $c2, $strokecolor, $fontfile, $text);
    return imagettftext($image, $size, $angle, $x, $y, $textcolor, $fontfile, $text);
  }

  function drawCentered($image, $font_size, $y, $text, $text_color) {
    putenv("GDFONTPATH=/usr/share/fonts/truetype/dejavu");
    $font = "DejaVuSansMono.ttf";

    $text_box = imagettfbbox($font_size, 0, $font, $text);
    $text_width = $text_box[2]-$text_box[0];
    $text_height = $text_box[7]-$text_box[1];

    $white_color = imagecolorallocate($image, 255, 255, 255);

    imagettfstroketext($image, $font_size, 0, (imagesx($image)/2) - ($text_width/2), $y, $text_color, $white_color, $font, $text, 8);
  }

  $options = ['blue', 'green', 'orange', 'pink', 'red', 'teal', 'yellow'];

  if (
    isset($_GET["name"]) &&
    strlen($_GET["name"]) >= 0 &&
    strlen($_GET["name"]) <= 100
  ) {
    $name = htmlspecialchars($_GET["name"]);

    header("Content-Type: image/jpg");
    srand(crc32($name));
    $image = imagecreatefromjpeg("./../assets/imgs/" . $options[array_rand($options)] . ".jpg");

    $text_color = imagecolorallocate($image, 0, 0, 0);

    // Write the score
    drawCentered($image, 35, 200, $name, $text_color);
    imagejpeg($image);
    imagedestroy($image);
  } else {
    header("Content-Type: image/jpg");
    readfile("./../assets/imgs/" . $options[array_rand($options)] . ".jpg");
  }
?>