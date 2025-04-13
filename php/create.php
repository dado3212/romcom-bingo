<?php
    include("secret.php");

    error_reporting(E_ALL);
    ini_set('display_errors', 'On');

    // Function to return a 400 error code with information
    function returnBadRequest($message) {
        // Set the response code to 400
        http_response_code(400);

        // Set the Content-Type header to application/json
        header('Content-Type: application/json');

        // Create an array with the error message
        $errorInfo = array(
            'status' => 400,
            'message' => $message
        );

        // Convert the array to a JSON string and output it
        echo json_encode($errorInfo);
    }

    // Make sure it's post only
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        returnBadRequest('Invalid request method. Please use POST.');
        exit;
    }

    // Check that all of the data is well-formed
    $movie_name = $_POST['movieName'] ?? '';
    if (strlen($movie_name) === 0) {
        returnBadRequest('Must include a movie name.');
        exit;
    }
    if (strlen($movie_name) > 100) {
        returnBadRequest('Movie name is too long.');
        exit;
    }
    $tags = json_decode($_POST['tags'] ?? '');
    if (!is_array($tags)) {
        returnBadRequest('Invalid tags.');
        exit;
    }
    if (count($tags) !== 24) {
        returnBadRequest('Insufficient tags, you should have 24. Bug?');
        exit;
    }

    $num_new_tags = 0;
    foreach ($tags as $tag) {
        if (!intval($tag)) {
            returnBadRequest('Non-numeric tag.');
            exit;
        }
        if ((int)$tag < 0) {
            $num_new_tags += 1;
        }
    }
    $new_tags = json_decode($_POST['newTags'] ?? '');
    if ($num_new_tags > 0) {
        if (!is_array($new_tags)) {
            returnBadRequest('Creating new tags but the new tags weren\'t passed properly.');
            exit;
        }
        if (count($new_tags) !== $num_new_tags) {
            returnBadRequest(
                'Insufficient new tag information, you created ' .
                $num_new_tags . 
                ' but only passed data for ' . 
                count($new_tags) . 
                '.'
            );
            exit;
        }
        foreach ($new_tags as $tag) {
            if (strlen($tag) > 100) {
                returnBadRequest('Tag text is too long.');
                exit;
            }
        }
    }

    // Wrap everything to throw only well-formed exceptions
    try {
        $PDO = getDatabase();

        // Check if the movie already exists, and if so use that one
        $movie_name_stmt = $PDO->prepare(
            "SELECT 
                `index`
            FROM movies
            WHERE
                `name`=:name"
        );
        $movie_name_stmt->bindValue(":name", $movie_name, PDO::PARAM_STR);
        $movie_name_stmt->execute();
        $movie_name_result = $movie_name_stmt->fetch();
        if (!$movie_name_result) {
            $movie_insert_stmt = $PDO->prepare(
                "INSERT INTO movies (name) VALUES (:name);"
            );
            $movie_insert_stmt->bindValue(":name", $movie_name, PDO::PARAM_STR);
            $movie_insert_stmt->execute();

            $movie_index = (int)$PDO->lastInsertId();
        } else {
            $movie_index = (int)$movie_name_result['index'];
        }

        // Create any new tags
        if ($num_new_tags > 0) {
            $new_tag_stmt = $PDO->prepare("INSERT INTO tags(`text`, `movie`) VALUES " . implode(", ", array_fill(0, $num_new_tags, "(?, ?)")));
            for ($i = 0; $i < $num_new_tags; $i++) {
                $new_tag_stmt->bindValue($i*2 + 1, $new_tags[$i], PDO::PARAM_STR);
                $new_tag_stmt->bindValue($i*2 + 2, $movie_index, PDO::PARAM_INT);
            }
            $executed = $new_tag_stmt->execute();
            if (!$executed) {
                returnBadRequest('Tag insertion failed.');
                exit;
            }
            // Unintuitively the 'lastInsertId' is the ID for the first row, when inserting
            // multiple rows. So we can just add to it directly
            $tag_index = (int)$PDO->lastInsertId();
            for ($i = 0; $i < count($tags); $i++) {
                if ($tags[$i] < 0) {
                    $tags[$i] = $tag_index;
                    $tag_index += 1;
                }
            }
        }

        $bingo_insert_stmt = $PDO->prepare(
            "INSERT INTO boards (tags, movie) VALUES (:tags, :movie);"
        );
        $bingo_insert_stmt->bindValue(":tags", json_encode($tags), PDO::PARAM_STR);
        $bingo_insert_stmt->bindValue(":movie", $movie_index, PDO::PARAM_INT);
        $executed = $bingo_insert_stmt->execute();
        if (!$executed) {
            returnBadRequest('Board insertion failed.');
            exit;
        }

        $bingo_index = (int)$PDO->lastInsertId();

        // Set the response code to 200
        http_response_code(200);
        // Set the Content-Type header to application/json
        header('Content-Type: application/json');
        // Create an array with the error message
        $errorInfo = array(
            'status' => 200,
            'index' => $bingo_index,
        );

        // Convert the array to a JSON string and output it
        echo json_encode($errorInfo);
    } catch (Exception $e) {
        returnBadRequest($e->getMessage() . " - " . $e->getTraceAsString());
        exit;
    }
?>