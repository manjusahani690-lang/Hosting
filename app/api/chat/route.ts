import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Dynamic Fallback response engine for when the Gemini API key is not configured/empty
const getFallbackChatResponse = (userMessage: string): string => {
  const query = userMessage.toLowerCase();
  
  if (query.includes("razorpay") || query.includes("pay") || query.includes("payment") || query.includes("currency")) {
    return "To buy premium features or credit packs, select the desired plan (Starter, Pro, or Ultimate) from the Billing section of your dashboard. Choose 'Razorpay Secure' as your secure gateway method. It supports Cards, UPI (GPay, PhonePe, Paytm), and Net Banking. Payments are processed in Indian Rupees (INR) with instant credentials validation!";
  }
  
  if (query.includes("domain") || query.includes("search") || query.includes("register")) {
    return "Our Domain Search tool allows you to check for available domain names in real-time. Simply type any search term under the 'Domain Search' tab, preview suggestions (.com, .net, .ai, .io), and click buy. Once secured, domain certificates and SSL/DDoS protections are automatically activated.";
  }

  if (query.includes("credit") || query.includes("token") || query.includes("coin") || query.includes("balance")) {
    return "Credits are consumed when generating layouts using our AI Site Builder tool. Each premium generation takes 50 credits. You can purchase starter, pro, or custom credit packages from the main dashboard instantly with premium secure checkouts.";
  }

  if (query.includes("publish") || query.includes("deploy") || query.includes("live") || query.includes("host")) {
    return "To deploy your website live on global edge CDN nodes, click the 'Publish Site' button next to your preview window. Our platform handles source compilation, safety analysis, DNS binding, and SSL/DDoS integration instantly, giving you a live .com or custom subdomain in less than 15 seconds!";
  }

  if (query.includes("help") || query.includes("support") || query.includes("chatbot") || query.includes("feature")) {
    return "Welcome! I am your AI Support Companion. Here is how I can help you today:\n1. **Razorpay Payments**: Ask how to upgrade or secure transactions.\n2. **Domain Registration**: Learn about SSL, CDN mapping, and custom domain configuration.\n3. **AI Credits**: Understand how generation tokens work.\n4. **Publishing**: Learn how to deploy your generated theme live on high-speed edge nodes.";
  }

  return "I'm your AI Support Assistant for the SaaS Hosting and AI Site Builder Platform. You can ask me how to configure custom domains, purchase credits using our Razorpay integration, deploy a generated website, or query pricing plans. Let me know how I can guide you!";
};

async function generateContentWithRetry(ai: any, params: any, retries = 2, delay = 800) {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const isRateLimitOrUnavailable = 
        err?.status === 503 || 
        err?.status === 429 || 
        err?.message?.includes("503") || 
        err?.message?.includes("429") ||
        err?.message?.includes("UNAVAILABLE") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("RESOURCE_EXHAUSTED");
        
      if (isRateLimitOrUnavailable && attempt <= retries) {
        console.warn(`Gemini API returned retryable error (attempt ${attempt}/${retries + 1}). Retrying in ${delay * attempt}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: "Please provide valid message history." }, { status: 400 });
    }

    const lastUserMessageObj = messages[messages.length - 1];
    const userPrompt = lastUserMessageObj?.content || lastUserMessageObj?.text || "";

    const apiKey = process.env.GEMINI_API_KEY;
    const hasApiKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim().length > 0;

    // If key is absent, use responsive fallback engine
    if (!hasApiKey) {
      const fallbackText = getFallbackChatResponse(userPrompt);
      return NextResponse.json({ 
        text: fallbackText, 
        isFallback: true 
      });
    }

    // Initialize using correct @google/genai standard
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Structure chat message format
    const systemInstruction = `You are a warm, highly professional AI Support Chatbot for a Hostinger-inspired premium AI Site Builder & SaaS Hosting Platform.
Provide direct, exceptionally polished, and highly scannable answers to the customer. 
Use clean markdown lists where appropriate. 
If the user asks about payments, explain that the platform supports seamless instant local Razorpay integration for UPI, Cards, Netbanking in Indian Rupees. 
If they ask about domain purchases, let them know SSL, DDoS Protection, and edge-routing CDN nodes are integrated with lifetime domain secure binds.
Keep responses friendly, helpful, and concise.`;

    // Process chat history
    let responseText = "";
    let isFallback = false;

    try {
      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });
      responseText = response.text || "";
      if (!responseText) {
        throw new Error("Empty response from Gemini model");
      }
    } catch (apiErr) {
      console.error("Gemini API call failed, falling back gracefully to offline response engine:", apiErr);
      responseText = getFallbackChatResponse(userPrompt);
      isFallback = true;
    }
    
    return NextResponse.json({ 
      text: responseText,
      isFallback: isFallback 
    });

  } catch (error: any) {
    console.error("Chatbot API server exception: ", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}
