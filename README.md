# Rom-Com Bingo

## TODO

**Important**
1. Favicon and header and all that jazz.
3. Fix tag truncation.
11. More visually interesting selection scribbling.
18. Tag selection overlap?

**Unimportant**
8. Different grid sizes?
10. ...with a counter of how many times you won?
12. See previous bingos/save your status (see who won?)
13. Admin screen for deleting/adding new default tags/default tag status?
14. Delete bingos?

## Setup

https://alexbeals.com/projects/bingo/?b=1&r=3

https://alexbeals.com/projects/bingo/?b=1&r=whatever

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
for (let i = 0; i < 24; i++) {
    items[i].click();
}
```

## Thanks

https://github.com/catdad/canvas-confetti