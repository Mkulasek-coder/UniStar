import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CourseRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCourseRecommendations = async (profile: UserProfile): Promise<CourseRecommendation[]> => {
  const prompt = `
    Act as an expert University Admissions and Career Guidance Counselor.
    
    A high school student has provided the following details:
    - Name: ${profile.name}
    - Location: ${profile.city}, ${profile.country}
    - Residency Status: ${profile.residency} (This affects fee structures)
    - Interest Areas for Higher Studies: ${profile.interests}

    Please recommend 5 specific university undergraduate (Bachelor's) programs that perfectly match their interests.
    
    Guidelines:
    1. Look for universities that are either highly reputable globally or well-regarded in or near their country/region.
    2. Provide the Fee structure relevant to their Residency Status (${profile.residency}). IMPORTANT: Specify the currency.
    3. Provide accurate Eligibility Criteria (e.g., minimum GPA, specific high school subjects required).
    4. Provide upcoming intake/schedule information (e.g., Fall 2025, Spring 2026).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and knowledgeable university guidance counselor for high school students.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              courseName: { type: Type.STRING, description: "The specific degree or program name (e.g., B.Sc. in Computer Science)" },
              university: { type: Type.STRING, description: "Name of the University" },
              location: { type: Type.STRING, description: "City and Country of the University" },
              eligibility: { type: Type.STRING, description: "Requirements to apply (grades, subjects, exams like SAT/IELTS)" },
              schedule: { type: Type.STRING, description: "Upcoming intake months or application deadlines" },
              fees: { type: Type.STRING, description: "Tuition fees per year (specify currency)" },
              matchReason: { type: Type.STRING, description: "Why this university/course fits the student's specific interests" }
            },
            required: ["courseName", "university", "location", "eligibility", "schedule", "fees", "matchReason"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CourseRecommendation[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};