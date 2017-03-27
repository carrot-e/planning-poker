<?php
set_time_limit(-1);

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

require 'vendor/autoload.php';

function prepareVotingStats($data) {
    $result = [];

    foreach ($data['clients'] as $client) {
        $clientId = $client['clientId'];
        foreach ($data['votes'] as $vote) {
            if ($vote['clientId'] === $clientId) {
                $result[$clientId][] = [
                    'task' => $vote['task'],
                    'card' => $vote['card']
                ];
            }
        }
    }

    return $result;
}

$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel = $connection->channel();
$channel->queue_declare('input-queue', false, false, false, false);
$channel->queue_declare('output-queue', false, false, false, false);

echo ' [*] Waiting for values. To exit press CTRL+C', "\n";
$callback = function($msg) use ($channel) {
    $data = prepareVotingStats(json_decode($msg->body, true));

    if (!empty($data)) {
        $channel->basic_publish(
            new AMQPMessage(json_encode($data)),
            '',
            'output-queue'
        );
    }
};

$channel->basic_consume('input-queue', '', false, true, false, false, $callback);

while(count($channel->callbacks)) {
    $channel->wait();
}

$channel->close();
$connection->close();
