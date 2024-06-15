# <img src="/assets/favicon/android-chrome-192x192.png?raw=true" width="30" alt="Logo"/> Rom-com Bingo

A website that allows you to build randomized bingo boards for a second-screen experience while watching trope-filled Rom Coms.

<p align="center">
  <img height="406" alt="Rom-Com Bingo screenshot" src="https://github.com/dado3212/romcom-bingo/assets/8919256/ad25aeb2-2fbc-47c3-ad6f-14e97fd82351">
</p>

I noticed a while back that a lot of new romcoms (especially those pumped out by streaming services like Netflix and Amazon Prime) have optimized their formulas to the point that you can predict basically the whole plot from just the title and movie poster. To bring a little more spice into them, I started playing bingo for tropes. The ideal way to play is to predict standard plot points from just the title and movie poster, but you can also use some of the pre-filled default classics. Share the bingo link, and each load will be a unique ordering. See who wins first (or in the case of many of these movies, how <i>many</i> times you can win).

You can visit the site and build your own at https://alexbeals.com/projects/bingo or play around with a sample board at https://alexbeals.com/projects/bingo/board/25?r=1.

## Installation

Create a file called `secret.php` in the `php` folder. It should have a function `getDatabase();` like this:

```lang=php
function getDatabase() {
    try {
        $PDO = new PDO("mysql:host=localhost;dbname=bingo;charset=utf8mb4","<username>","<password>");
        $PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $PDO->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    } catch (PDOException $e) {
        echo "PDO MySQL Failed to connect: " . $e->getMessage();
    }

    return $PDO;
}
```

## Testing
Select the first 24 options to have a complete bingo:
```
let items = document.querySelectorAll('.option');
for (let i = 1; i < 25; i++) {
    items[i].click();
}
```

## Potential Todo's
This is functional as is, but if I wanted to revisit this there are a couple of things that I could do.

1. More visually interesting selection scribbling.
2. Better popup styling
3. Different grid sizes?
4. ...with a counter of how many times you won?
5. See previous bingos/save your status (see who won?)
6. Admin screen for deleting/adding new default tags/default tag status?
7. Delete bingos?

## Thanks
Confetti courtesy of https://github.com/catdad/canvas-confetti.
