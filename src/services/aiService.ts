import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export async function askPixoAI(prompt: string, context?: string) {
  try {
    const isImageRequest = prompt.toLowerCase().includes('generate') || 
                          prompt.toLowerCase().includes('draw') || 
                          prompt.toLowerCase().includes('image') ||
                          prompt.toLowerCase().includes('تصميم') ||
                          prompt.toLowerCase().includes('صورة');

    if (isImageRequest) {
      // First, use Gemini to expand the user prompt into a high-quality architectural prompt in English
      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `Task: Convert the following architectural design request into a highly detailed, professional English prompt for a high-end image generator (like Midjourney/Flux). 
        
        Focus on:
        - Architectural style (Modern, Minimalist, Parametric, etc.)
        - Materials (Brushed concrete, double-glazed glass, charred wood, etc.)
        - Lighting and Time of Day (Cineamtic lighting, golden hour, misty morning, etc.)
        - Quality tags: 8k, photorealistic, architectural photography, sharp focus.
        
        Request: "${prompt}"
        
        Output MUST ONLY be the expanded English prompt. NO introductory text, NO quotes.` }] }],
      });

      const expandedPrompt = promptResponse.text?.trim() || prompt;
      const encodedPrompt = encodeURIComponent(expandedPrompt);
      // Using Flux model on pollinations for much higher quality
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&enhance=true&model=flux&seed=${Math.floor(Math.random() * 1000000)}`;
      
      return {
        type: 'image',
        content: `لقد قمت بتحويل فكرتك إلى تصميم معماري عالي الجودة. إليك التصور الهندسي المقترح:`,
        imageUrl: imageUrl
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are Pixo AI, a professional architectural assistant for Pixo Arch Studio. 
        You are an expert in architectural visualization, 3D rendering, interior design, and structural engineering. 
        Your tone is professional, sophisticated, and helpful. 
        You help clients with:
        - Estimating project complexity and common timeframes.
        - Advice on architectural styles (Minimalist, Contemporary, Brutalist, etc.).
        - Suggesting materials and lighting for better spatial visualization.
        - Explaining the benefits of high-end 3D rendering for real estate and design.
        
        Always refer to the user as "Visionary" or "Architect". 
        If the prompt is in Arabic, respond in Arabic. Otherwise, respond in English.
        Keep responses concise but expert.
        
        Current Context: ${context || 'General Studio Inquiry'}`,
      },
    });

    return {
      type: 'text',
      content: response.text
    };
  } catch (error) {
    console.error("Pixo AI Error:", error);
    return {
      type: 'text',
      content: "I apologize, but I am currently processing a complex design architectural problem. Please try asking again in a moment."
    };
  }
}
