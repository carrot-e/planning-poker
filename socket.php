<?php
set_time_limit(-1);

use PhpAmqpLib\Connection\AMQPStreamConnection;
use Components\CurrencyLayerClient;
use PhpAmqpLib\Message\AMQPMessage;

require 'vendor/autoload.php';

$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel = $connection->channel();
$channel->queue_declare('user-input-queue', false, false, false, false);
$channel->queue_declare('converted-queue', false, false, false, false);

echo ' [*] Waiting for values. To exit press CTRL+C', "\n";
$callback = function($msg) use ($channel) {
    $data = json_decode($msg->body, true);

//    $currencyApi = new CurrencyLayerClient();
//    $amount = $currencyApi->convert($data['from'], $data['to'], $data['amount']);
    $amount = 'TODO';
    if (!empty($amount)) {
        echo ' [+] converted: ' , $amount, PHP_EOL;
        $channel->basic_publish(
            new AMQPMessage(json_encode(['amount' => $amount, 'clientId' => $data['clientId']])),
            '',
            'converted-queue'
        );
    }
};

$channel->basic_consume('user-input-queue', '', false, true, false, false, $callback);

while(count($channel->callbacks)) {
    $channel->wait();
}

$channel->close();
$connection->close();
