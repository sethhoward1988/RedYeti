<?php
    
    $headers = "From: " . $_POST['email'] . "\r\n";
    $headers .= "Reply-To: ". $_POST['email'] . "\r\n";
    
    mail("smiles.seth@gmail.com", "Message From " . $_POST['name'] . " (RedYetiToRock.com)", $_POST['message'], $headers);

