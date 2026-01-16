import { GoogleGenAI, Chat } from "@google/genai";
import { TEACHER_PROFILE, SOCIAL_LINKS } from '../constants';

const API_KEY = '';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance && API_KEY) {
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
};

// System instruction to give the AI context about who it is representing
const SYSTEM_INSTRUCTION = `
You are an AI assistant for ${TEACHER_PROFILE.name}, who is a ${TEACHER_PROFILE.title}.
Your goal is to help students and parents who visit this "Link in Bio" page.

Here is context about the teacher:
- Bio: ${TEACHER_PROFILE.bio}
- Location: ${TEACHER_PROFILE.location}

Here are the links available on the page:
${SOCIAL_LINKS.map(link => `- ${link.title} (${link.category}): ${link.description || 'Link available on page'}`).join('\n')}

Guidelines:
1. Be polite, encouraging, and professional.
2. If asked about courses, refer to the "Courses" links.
3. If asked about contact, refer to the social media or contact links.
4. You can answer general questions about the subject matter (${TEACHER_PROFILE.title}) briefly, but encourage them to sign up for lessons for deep dives.
5. Keep answers concise (max 3-4 sentences) as this is a chat widget.
6. If the user asks for the teacher's personal phone number or address, politely decline and refer to the official contact channels provided.
`;

export const createChatSession = (): Chat | null => {
  const ai = getAI();
  if (!ai) return null;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    const responseStream = await chat.sendMessageStream({ message });
    return responseStream;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};