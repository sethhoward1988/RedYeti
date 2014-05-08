<?php
  function fetchData($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    $result = curl_exec($ch);
    curl_close($ch); 
    return $result;
  }
  $result = fetchData("https://api.instagram.com/v1/users/330152032/media/recent/?access_token=330152032.fb03fd8.a0a306a2ed5549d5813027312c1edc11");
  $result = json_decode($result);
  foreach ($result->data as $post) {
    echo $result;
  }
?>  