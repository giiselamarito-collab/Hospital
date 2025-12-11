import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentType } from "../types";

// Note: In a production app, the API Key comes from process.env.
// For this environment, we rely on the injected process.env.API_KEY
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export interface AgentResponse {
  text: string;
  detectedAgent: AgentType;
  action?: 'VIEW_PATIENT' | 'VIEW_BILLING' | 'VIEW_SCHEDULE' | 'VIEW_MEDICAL' | 'NONE';
  entityId?: string; // e.g., RM Number
}

// Defines the structured output we want from Gemini to control the UI
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The natural language response to the user."
    },
    detectedAgent: {
      type: Type.STRING,
      enum: [
        AgentType.COORDINATOR,
        AgentType.PATIENT_MANAGEMENT,
        AgentType.APPOINTMENT_SCHEDULING,
        AgentType.MEDICAL_RECORDS,
        AgentType.BILLING
      ],
      description: "The specific hospital agent best suited to handle this request."
    },
    action: {
      type: Type.STRING,
      enum: ['VIEW_PATIENT', 'VIEW_BILLING', 'VIEW_SCHEDULE', 'VIEW_MEDICAL', 'NONE'],
      description: "A UI action to trigger if relevant data should be displayed."
    },
    entityId: {
      type: Type.STRING,
      description: "The Medical Record Number (Nomor Rekam Medis) if identified in context."
    }
  },
  required: ["text", "detectedAgent", "action"]
};

export const sendMessageToGemini = async (
  message: string,
  context: string
): Promise<AgentResponse> => {
  try {
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual/routing accuracy
      },
      systemInstruction: `
        You are the Central Coordinator for an Advanced Hospital Information System (AIS).
        Your role is to understand the user's intent and route them to one of four sub-agents:
        1. PATIENT_MANAGEMENT: Demographics, registration, contact info.
        2. APPOINTMENT_SCHEDULING: Booking doctors, checking schedules.
        3. MEDICAL_RECORDS: Clinical history, diagnosis, allergies (Sensitive Data).
        4. BILLING: Invoices, payments, insurance claims.

        Current Database Context:
        ${context}

        Rules:
        - Analyze the user's prompt.
        - Respond politely as the hospital system.
        - If they ask about a specific patient (e.g., "Budi" or "RM-2024-001"), identify the entityId.
        - Select the appropriate agent.
        - Select a UI action if they want to SEE data.
      `
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ]
    });

    const responseText = result.response.text();
    if (!responseText) {
        throw new Error("Empty response from Gemini");
    }

    return JSON.parse(responseText) as AgentResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I apologize, but I'm having trouble connecting to the central server. Please try again.",
      detectedAgent: AgentType.COORDINATOR,
      action: 'NONE'
    };
  }
};
