export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, phone, question, website } = req.body;

    // SPAM Check: Hidden field (Honeypot) should be empty
    if (website) {
        return res.status(200).json({ success: true }); // Fake success for bots
    }

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ message: 'Server configuration error' });
    }

    const message = `
📩 *Новая заявка с сайта!*

👤 *Имя:* ${name}
📱 *Телефон:* ${phone}
❓ *Вопрос:*
${question || 'Не указан'}
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
            throw new Error(data.description || 'Telegram API Error');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Telegram Error:', error);
        return res.status(500).json({ message: 'Failed to send message' });
    }
}
