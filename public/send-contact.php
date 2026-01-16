<?php
// Retrieve payload
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid JSON']);
    exit;
}

$name = $data['name'] ?? '';
$phone = $data['phone'] ?? '';
$question = $data['question'] ?? '';
$website = $data['website'] ?? '';

// SPAM Check: Hidden field (Honeypot) should be empty
if (!empty($website)) {
    echo json_encode(['success' => true]);
    exit;
}

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['message' => 'Name and phone are required']);
    exit;
}

// Configuration (Hardcoded for PHP hosting specific protection if env not available)
// Ideally, read from a file outside web root. For this file, we use variables.
$token = '8528220656:AAHRglgOEm85s1D0Vdo_3vcr_0t4T46xivU';
$chatId = '935251827';

$message = "📩 *Новая заявка с сайта!*\n\n";
$message .= "👤 *Имя:* " . $name . "\n";
$message .= "📱 *Телефон:* " . $phone . "\n";
$message .= "❓ *Вопрос:*\n" . ($question ?: 'Не указан');

$url = "https://api.telegram.org/bot{$token}/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to send to Telegram', 'telegram_response' => $response]);
}
?>