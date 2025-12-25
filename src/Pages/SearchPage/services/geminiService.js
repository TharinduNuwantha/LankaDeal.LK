// myapp/src/services/geminiService.js
import { collectionGroup, getDocs, query, limit } from "firebase/firestore";
import db from "../FireBase/firebase";

export const generateAIResponse = async (userMessage, selectedProducts, additionalContext = null) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API key not found");
      return "I'm having trouble connecting to my AI service. Please try again later.";
    }

    // Build the prompt with product context
    let prompt = buildPrompt(userMessage, selectedProducts, additionalContext);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error("Invalid API response format");
    }

    return aiResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again.";
  }
};

const buildPrompt = (userMessage, selectedProducts, additionalContext) => {
  let prompt = `You are a helpful shopping assistant for an e-commerce website. Answer the user's question based on the product information provided.

User Question: ${userMessage}

`;

  // Add selected products to prompt
  if (selectedProducts && selectedProducts.length > 0) {
    prompt += `Selected Products by User (${selectedProducts.length} items):\n\n`;
    selectedProducts.forEach((product, idx) => {
      prompt += formatProductForPrompt(product, idx + 1);
    });
    prompt += "\n";
  }

  // Add additional search results if provided
  if (additionalContext && additionalContext.length > 0) {
    prompt += `Additional Relevant Products from Database (for context):\n\n`;
    additionalContext.forEach((product, idx) => {
      prompt += formatProductForPrompt(product, idx + 1);
    });
    prompt += "\n";
  }

  prompt += `Instructions:
- Provide helpful, accurate information based on the products shown above
- When mentioning a product, include its title
- For price comparisons, be specific with amounts
- If asked about products not in the list, politely mention you can only provide info about the products shown
- Keep responses concise and friendly
- Use emojis sparingly for a friendly tone
- Do not make up information not present in the product data

Please answer the user's question now:`;

  return prompt;
};

const formatProductForPrompt = (product, index) => {
  return `${index}. Product: ${product.title}
   - ID: ${product.id}
   - Price: Rs. ${product.price}
   - Original Price: ${product.originalPrice || 'N/A'}
   - Discount: ${product.discount || 'None'}
   - Description: ${product.description}
   - Category: ${product.categoryPath?.split('/')[1]?.replace(/_/g, ' ') || 'N/A'}
   - Stock Status: ${product.inStock ? 'In Stock' : 'Out of Stock'}
   - Stock Count: ${product.stockCount || 'N/A'}
   - Delivery: ${product.fastDelivery ? 'Fast Delivery (2-3 days)' : 'Standard Delivery (5-7 days)'}
   - Rating: ${product.rating || 'Not rated'}
   - Reviews: ${product.reviewCount || '0'}

`;
};

// Search for related products from database
export const searchRelatedProducts = async (userMessage, maxResults = 10) => {
  try {
    // Extract keywords from user message
    const keywords = extractKeywords(userMessage);
    
    if (keywords.length === 0) {
      return [];
    }

    const q = query(
      collectionGroup(db, "products"),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter products based on keywords
    products = products.filter(product => {
      const searchText = `${product.title} ${product.description} ${product.categoryPath}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    });

    return products.slice(0, maxResults);

  } catch (error) {
    console.error("Error searching related products:", error);
    return [];
  }
};

// Extract keywords from user message
const extractKeywords = (message) => {
  const stopWords = ['what', 'is', 'the', 'are', 'can', 'you', 'tell', 'me', 'about', 'show', 'find', 'search', 'please', 'i', 'want', 'need'];
  
  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  return [...new Set(words)];
};