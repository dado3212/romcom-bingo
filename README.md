# Rom-Com Bingo

## Setup

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