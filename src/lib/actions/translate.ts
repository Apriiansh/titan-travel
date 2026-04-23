"use server";

/**
 * Translates text from English to a target language using the Google Translate unofficial API.
 * @param text The source text in English
 * @param target The target language code (e.g., 'id', 'ms')
 * @returns The translated text
 */
export async function translateText(text: string, target: "id" | "ms") {
  if (!text || text.trim() === "") return "";
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Google Translate 'single' API returns a nested array where data[0] contains the translated segments
    // data[0][0][0] is the translated text for the first segment
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0] as string;
    }
    
    return text;
  } catch (error) {
    console.error(`[Translate] Error translating to ${target}:`, error);
    return text; // Fallback to original text on error
  }
}

/**
 * Translates a text for both Indonesian and Malay languages.
 */
export async function translateToAll(text: string) {
  const [id, ms] = await Promise.all([
    translateText(text, "id"),
    translateText(text, "ms"),
  ]);
  
  return { id, ms };
}
