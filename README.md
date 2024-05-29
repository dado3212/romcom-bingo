# Rom-Com Bingo

## TODO

**Important**
1. Favicon and header and all that jazz.
2. Make sure it renders properly and is interactible on mobile.
3. Fix tag truncation.
4. Allow you to create new bingos, and have a proper share screen.
5. Visual cleanup so it looks professional.
6. Allow you to insert your own tags.
7. Saving of the movie name/naming bingos?
9. Fun animations when you get bingo?
11. More visually interesting selection scribbling.
15. Bind the click events to touchstart to remove selection lag on iOS.
17. Right padding and center bingo board.
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
