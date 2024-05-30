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
    $tags = json_decode($_POST['tags'] ?? '');
    if (!is_array($tags)) {
        returnBadRequest('Invalid tags.');
        exit;
    }
    if (count($tags) !== 24) {
        returnBadRequest('Insufficient tags, you should have 24. Bug?');
        exit;
    }

    foreach ($tags as $tag) {
        if (!intval($tag)) {
            returnBadRequest('Non-numeric tag.');
            exit;
        }
    }

    // Check if the movie already exists, and if so use that one
    try {
        $PDO = getDatabase();
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
        //     print_r(var_export($tags, true));
        $bingo_insert_stmt = $PDO->prepare(
            "INSERT INTO boards (tags, movie) VALUES (:tags, :movie);"
        );
        $bingo_insert_stmt->bindValue(":tags", json_encode($tags), PDO::PARAM_STR);
        $bingo_insert_stmt->bindValue(":movie", $movie_index, PDO::PARAM_INT);
        $executed = $bingo_insert_stmt->execute();
        if (!$executed) {
            returnBadRequest('Insertion failed.');
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
        returnBadRequest($e->getMessage());
        exit;
    }
?>