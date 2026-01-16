export default async function handler(req, res) {
    // Config - Force reload attempt 2
    const token = process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.trim() : '';
    const chatId = process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID.trim() : '';

    // Debugging (logs to Vercel logs)
    console.log('Function invoked [v2.2]'); // Changed log to force update
    console.log('Method:', req.method);
    console.log('Token exists:', !!token);
    console.log('ChatId exists:', !!chatId);

    // CORS / Method check
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, phone, question, website } = req.body;

    // SPAM Check: Hidden field (Honeypot) should be empty
    if (website) {
        console.log('Spam detected (honeypot)');
        return res.status(200).json({ success: true });
    }

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required' });
    }

    if (!token || !chatId) {
        console.error('Missing env vars');
        return res.status(500).json({
            message: 'Server configuration error: Missing Telegram Token or Chat ID',
            debug_token: !!token,
            debug_chatId: !!chatId
        });
    }

    const message = `
📩 *Новая заявка с сайта!*

👤 *Имя:* ${name}
📱 *Телефон:* ${phone}
❓ *Вопрос:* ${question || 'Не указан'}
  `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Telegram API Error:', data);
            throw new Error(data.description || 'Telegram API Error');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram Error:', error);
        return res.status(500).json({ message: 'Failed to send message: ' + error.message });
    }
}
