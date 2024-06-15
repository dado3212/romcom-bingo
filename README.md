# Rom-Com Bingo

## TODO

**Important**

**Unimportant**
1. More visually interesting selection scribbling.
2. Better popup styling
3. Different grid sizes?
4. ...with a counter of how many times you won?
5. See previous bingos/save your status (see who won?)
6. Admin screen for deleting/adding new default tags/default tag status?
7. Delete bingos?

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
for (let i = 1; i < 25; i++) {
    items[i].click();
}
```

## Thanks

https://github.com/catdad/canvas-confetti