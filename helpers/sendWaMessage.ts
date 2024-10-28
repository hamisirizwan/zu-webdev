import axios from 'axios';

const API_URL = 'https://api.apiwap.com/api/v1/whatsapp/send-message';
const APIWAP_API_KEY = process.env.APIWAP_API_KEY; // Ensure your API key is set in environment variables

type SendMessageResponse = {
    message?: string;
    error?: string;
};

export async function sendMessage(phone: string, message: string): Promise<SendMessageResponse> {
    // Basic validation
    if (!APIWAP_API_KEY) {
        console.error('API key is missing');
        return { error: 'API key is missing' };
    }
    if (!phone || !message) {
        return { error: 'Phone number and message are required' };
    }

    const phoneNumber = `+254${phone.slice(-9)}`

    console.log(phoneNumber)
    try {
        const response = await axios.post(
            API_URL,
            {
                phoneNumber,
                message,
                type: 'text'
            },
            {
                headers: {
                    'Authorization': `Bearer ${APIWAP_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return { message: response.data.message };

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error sending message:', error.response.data);
            return { error: error.response.data.message || 'Failed to send message' };
        }

        console.error('Error occurred:', error);
        return { error: 'An error occurred while sending the message' };
    }
}
