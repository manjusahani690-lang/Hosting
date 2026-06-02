import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Fallback generator for mock-free offline mode or missing API Key
const parseDomainSearch = (searchTerm: string) => {
  const trimmed = searchTerm.trim().toLowerCase();
  
  // Try to find if input already contains a dot and has a potential TLD
  const dotIndex = trimmed.indexOf('.');
  
  let brand = trimmed;
  let inputTld = "";
  
  if (dotIndex > 0 && dotIndex < trimmed.length - 1) {
    const lastDotIdx = trimmed.lastIndexOf('.');
    brand = trimmed.substring(0, lastDotIdx);
    inputTld = trimmed.substring(lastDotIdx);
  }
  
  // Clean brand to only have alphanumeric characters and hyphens
  const cleanBrand = brand.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-");
  
  return {
    brand: cleanBrand || "mywebsite",
    inputTld: inputTld || ""
  };
};

const getMockDomainResults = (searchTerm: string) => {
  const { brand, inputTld } = parseDomainSearch(searchTerm);
  const results = [];
  
  if (inputTld) {
    const isPopular = [".com", ".in", ".co.in", ".net", ".org"].includes(inputTld);
    results.push({
      name: `${brand}${inputTld}`,
      tld: inputTld,
      status: brand.length > 3 ? "available" : "taken",
      price: inputTld === ".ai" ? "$59.99/yr" : inputTld === ".io" ? "$34.99/yr" : "$9.99/yr",
      badges: ["User Requested", isPopular ? "Top Choice" : "Checked Extension"]
    });
  }

  const standardSuggestions = [
    { ext: ".com", price: "$9.99/yr", badges: ["Recommended", "Most Popular"] },
    { ext: ".in", price: "$4.99/yr", badges: ["Local Identity", "Great Value"] },
    { ext: ".net", price: "$12.99/yr", badges: ["Tech", "Business"] },
    { ext: ".ai", price: "$59.99/yr", badges: ["Premium", "Artificial Intelligence"] },
    { ext: ".io", price: "$34.99/yr", badges: ["Developer Hub"] },
    { ext: ".co", price: "$7.99/yr", badges: ["Startup Friendly"] },
    { ext: ".online", price: "$0.99/yr", badges: ["Super Saver"] }
  ];

  standardSuggestions.forEach(s => {
    if (s.ext !== inputTld) {
      results.push({
        name: `${brand}${s.ext}`,
        tld: s.ext,
        status: brand.length <= 4 && s.ext === ".com" ? "taken" : "available",
        price: s.price,
        badges: s.badges
      });
    }
  });

  results.push(
    { name: `${brand}app.com`, tld: ".com", status: "available", price: "$9.99/yr", badges: ["Alternative", "App Brand"] },
    { name: `the${brand}.com`, tld: ".com", status: "available", price: "$9.99/yr", badges: ["Authority", "Classic Prefix"] },
    { name: `${brand}cloud.com`, tld: ".com", status: "available", price: "$9.99/yr", badges: ["SaaS Startup"] }
  );

  return results;
};

const getMockWebsiteResults = (promptStr: string) => {
  const lower = promptStr.toLowerCase();
  let niche = "Business Setup";
  let primaryCol = "indigo-600";
  let bgs = "from-slate-50 to-indigo-50/30";
  
  if (lower.includes("coffee") || lower.includes("cafe") || lower.includes("restaurant") || lower.includes("food")) {
    niche = "Café & Bakery";
    primaryCol = "amber-800";
    bgs = "from-amber-50 to-orange-50/30";
  } else if (lower.includes("portfolio") || lower.includes("photography") || lower.includes("design") || lower.includes("creative")) {
    niche = "Creative Portfolio";
    primaryCol = "purple-600";
    bgs = "from-zinc-50 to-purple-50/30";
  } else if (lower.includes("fitness") || lower.includes("gym") || lower.includes("workout") || lower.includes("sport")) {
    niche = "Fitness & Wellness";
    primaryCol = "emerald-600";
    bgs = "from-slate-50 to-emerald-50/30";
  } else if (lower.includes("tech") || lower.includes("software") || lower.includes("saas") || lower.includes("app")) {
    niche = "Tech Startup";
    primaryCol = "blue-600";
    bgs = "from-slate-50 to-blue-50/30";
  }

  return {
    themeName: niche,
    colors: {
      primary: primaryCol,
      text: "slate-900",
      accent: "violet-500",
      background: bgs,
    },
    fontStyle: "sans",
    hero: {
      title: `Welcome to ${promptStr.charAt(0).toUpperCase() + promptStr.slice(1) || "My Masterpiece Website"}`,
      subtitle: "Launch instantly with our cutting edge hosting platform. Enjoy ultra fast speeds, bulletproof hosting security, and infinite scalability built for elite growth.",
      ctaText: "Explore Services",
    },
    features: [
      { icon: "Zap", title: "Blazing Speed Response", description: "Our server-level caching renders content in micro-seconds, ensuring clients aren't left waiting." },
      { icon: "Shield", title: "Enterprise Grade Defense", description: "Fortified with active cloud firewalls and isolated sandboxes protecting your valuable databases." },
      { icon: "Globe", title: "Universal Edge CDN", description: "Replicated across over 20 global coordinates, making loading absolute instant from anywhere on Earth." }
    ],
    stats: [
      { label: "High Response Rate", value: "99.99%" },
      { label: "Active Connections", value: "14.5k+" },
      { label: "Global Latency Range", value: "<14ms" }
    ],
    sections: [
      { title: "Designed for Maximum Performance", content: "Our customized technical stack handles high dynamic payloads effortlessly. Focus completely on craft while we scale memory and storage seamlessly automatically.", alignment: "left" },
      { title: "Fully Responsive Modern Layout", content: "Adjusts with pixel-perfect resolution on ultra-wide desktop monitors, standard iPads, or mobile phones. Pre-built with strict Tailwind utilities.", alignment: "right" }
    ],
    testimonials: [
      { name: "Sarah Jenkins", role: "Co-Founder, Streamline.io", comment: "The loading speeds are totally unbelievable. Customer signups surged by 22% right after launching." },
      { name: "Marcus Thorne", role: "Creative Director", comment: "Setting this up was exceptionally stress-free. The sleek layouts and robust response times are gold standard." }
    ],
    faq: [
      { question: "Is SSL setup standard?", answer: "Absolutely. Free Let's Encrypt SSL certificates are activated automatically instantly for every domain." },
      { question: "Can I upgrade resources later?", answer: "Yes, you can scale CPU cores and random-access memory dynamically in our simplified hPanel dashboard with zero downtime." }
    ],
    legal: {
      title: "Terms and Conditions",
      lastUpdated: "June 2026",
      companyName: `${promptStr.charAt(0).toUpperCase() + promptStr.slice(1) || "Nebula SaaS"} Corporation`,
      governingLaw: "the Jurisdiction of New Delhi, India",
      clauses: [
        { title: "Acceptance of Website Terms", description: "By rendering, hosting, or accessing this auto-compiled digital space, you unconditionally accept and agree to hold harmless NexHost and all affiliated edge routes." },
        { title: "Fair Development Representation", description: "All content generated on this domain represents prompt-driven wireframes. Real-world transactions or payment gateway behaviors are sandboxed prototypes requiring real merchant key configurations." },
        { title: "Indemnification & Edge SLA", description: "SaaS clusters, SSL renewals, and edge routing mirrors are provided for simulated live previews. NexHost assumes zero liability for user-generated copies, data persistence breaches, or external domain purchases." }
      ]
    }
  };
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
    const { type, prompt, searchTerm, currentDraft } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const hasApiKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim().length > 0;

    if (!hasApiKey) {
      // Return beautiful mock response gracefully
      if (type === "domain") {
        const results = getMockDomainResults(searchTerm || "mysite");
        return NextResponse.json({ results });
      } else {
        const website = getMockWebsiteResults(prompt || "E-commerce store");
        return NextResponse.json({ website });
      }
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    if (type === "domain") {
      const { brand, inputTld } = parseDomainSearch(searchTerm || "mysite");
      const geminiPrompt = `You are a professional domain name generator and branding consultant. 
Generate a list of 8-10 high-quality domain name alternatives.
We parsed the user's search query "${searchTerm || "mysite"}" and extracted:
- Brand/Keyword: "${brand}"
- User Intent TLD: "${inputTld || "(none specified)"}"

Instructions:
1. If the user specified a TLD (e.g., "${inputTld}"), verify and include "${brand}${inputTld}" as the very first result with appropriate status ("available" or "taken") and realistic pricing.
2. Provide other extensions like ${brand}.com, ${brand}.net, ${brand}.ai, ${brand}.in, ${brand}.co, ${brand}.online.
3. Suggest brandable prefixes or suffixes such as "the${brand}.com", "${brand}app.com", "${brand}labs.com", "get${brand}.com", etc.
4. For each suggestion, output:
   - "name": full domain name (e.g. ${brand}.com)
   - "tld": the extension (e.g. .com)
   - "status": availability status, either "available" or "taken". Make most of them "available" (like 70-80%) and some taken to make it look realistic.
   - "price": estimated registration cost like "$9.99/yr", "$4.99/yr", "$59.99/yr", etc.
   - "badges": 1 to 2 short branding keywords (e.g. "Popular", "Premium", "Best Value", "Tech Startup").

Format strictly as a JSON object of this structure:
{
  "results": [
    { "name": "domainName.ext", "tld": ".ext", "status": "available" | "taken", "price": "$X.XX/yr", "badges": ["badge1", "badge2"] }
  ]
}`;

      let text = "";
      try {
        const response = await generateContentWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: geminiPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                results: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      tld: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["available", "taken"] },
                      price: { type: Type.STRING },
                      badges: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["name", "tld", "status", "price", "badges"]
                  }
                }
              },
              required: ["results"]
            }
          }
        });
        text = response.text || "";
      } catch (apiErr) {
        console.error("Gemini domain generation failed, falling back gracefully to mock system:", apiErr);
        return NextResponse.json({ results: getMockDomainResults(searchTerm || "mysite") });
      }

      try {
        const data = JSON.parse(text);
        return NextResponse.json(data);
      } catch (parseErr) {
        console.error("Failed to parse Gemini output: ", text);
        return NextResponse.json({ results: getMockDomainResults(searchTerm || "mysite") });
      }

    } else if (type === "website") {
      const promptText = prompt || "creative web portfolio";
      
      let geminiPrompt = "";
      if (currentDraft) {
        geminiPrompt = `You are an elite web design generator and refactoring expert. 
You are given a current website structure represented in JSON format:
${JSON.stringify(currentDraft)}

Your task is to modify and update this website structure based on the user's specific text instruction: "${promptText}".
Analyze the instruction carefully, and then apply it to the JSON structure. Maintain as much of the existing content/structure as possible, but incorporate the changes elegantly. 
For example, if the user asks to "change the color theme to dark midnight", modify the colors object. If they ask to "add a contact form section", add a new section in sections or add features inside the website template draft. If they ask to translate to Hindi or write bilingual copy, rewrite the text fields.
Format strictly as a JSON object matching this schema:
{
  "themeName": "Detailed Brand/Niche Naming",
  "colors": {
    "primary": "tailwind-primary-color (e.g. violet-600)",
    "text": "slate-900",
    "accent": "tailwind-accent-color (e.g. emerald-400)",
    "background": "tailwind-bg-gradient (e.g. from-indigo-50 to-white)"
  },
  "fontStyle": "sans" | "serif" | "mono",
  "hero": {
    "title": "Inspiring powerful headline",
    "subtitle": "Informative and high-converting marketing subtitle",
    "ctaText": "Primary text button"
  },
  "features": [
    { "icon": "Lucide Icon name, e.g. Zap, Shield, Globe, Terminal, Award, MessageCircle", "title": "Feature title", "description": "Compelling feature paragraph description" }
  ],
  "stats": [
    { "label": "Telemetry meter label", "value": "Display value" }
  ],
  "sections": [
    { "title": "Subheading title section", "content": "Comprehensive paragraph about services, tools context", "alignment": "left" | "right" }
  ],
  "testimonials": [
    { "name": "Reviewer name", "role": "Position Title", "comment": "Authentic testimonial feedback about services." }
  ],
  "faq": [
    { "question": "Relevant question", "answer": "Informative detailed answer" }
  ],
  "legal": {
    "title": "Terms and Conditions of Service",
    "lastUpdated": "Month Year",
    "companyName": "Legal Brand Name",
    "governingLaw": "Jurisdiction",
    "clauses": [
      { "title": "Clause Title (e.g. Intellectual Property)", "description": "Compelling and complete detailed paragraph about terms, rules of engagement, and usage boundaries." }
    ]
  }
}`;
      } else {
        geminiPrompt = `You are an elite web design generator. Create a professional website theme structure matching this design request: "${promptText}".
Formulate cohesive colors (using Tailwind classes, e.g. primary="indigo-600", secondary="slate-800", etc.), modern section titles, persuasive copywriting, features, FAQs, and realistic Terms and Conditions (Terms & Conditions / legal layout) to render a beautiful complete layout like Lovable @ Replit.
Format strictly as a JSON object:
{
  "themeName": "Detailed Brand/Niche Naming",
  "colors": {
    "primary": "tailwind-primary-color (e.g. violet-600)",
    "text": "slate-900",
    "accent": "tailwind-accent-color (e.g. emerald-400)",
    "background": "tailwind-bg-gradient (e.g. from-indigo-50 to-white)"
  },
  "fontStyle": "sans" | "serif" | "mono",
  "hero": {
    "title": "Inspiring powerful headline",
    "subtitle": "Informative and high-converting marketing subtitle",
    "ctaText": "Primary text button"
  },
  "features": [
    { "icon": "Lucide Icon name, e.g. Zap, Shield, Globe, Terminal, Award, MessageCircle", "title": "Feature title", "description": "Compelling feature paragraph description" }
  ],
  "stats": [
    { "label": "e.g. Server Response Time", "value": "e.g. <12ms" }
  ],
  "sections": [
    { "title": "Subheading title section", "content": "Comprehensive paragraph about services, tools context", "alignment": "left" | "right" }
  ],
  "testimonials": [
    { "name": "John Doe", "role": "Position Title", "comment": "Authentic testimonial feedback about services." }
  ],
  "faq": [
    { "question": "Relevant question", "answer": "Informative detailed answer" }
  ],
  "legal": {
    "title": "Terms and Conditions of Service",
    "lastUpdated": "Month Year",
    "companyName": "Legal Brand Name",
    "governingLaw": "e.g. state of Delhi, India",
    "clauses": [
      { "title": "Clause Title (e.g. Intellectual Property)", "description": "Compelling and complete detailed paragraph about terms, rules of engagement, and usage boundaries." }
    ]
  }
}`;
      }

      let text = "";
      try {
        const response = await generateContentWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: geminiPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                themeName: { type: Type.STRING },
                colors: {
                  type: Type.OBJECT,
                  properties: {
                    primary: { type: Type.STRING },
                    text: { type: Type.STRING },
                    accent: { type: Type.STRING },
                    background: { type: Type.STRING }
                  },
                  required: ["primary", "text", "accent", "background"]
                },
                fontStyle: { type: Type.STRING, enum: ["sans", "serif", "mono"] },
                hero: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    ctaText: { type: Type.STRING }
                  },
                  required: ["title", "subtitle", "ctaText"]
                },
                features: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      icon: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["icon", "title", "description"]
                  }
                },
                stats: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      alignment: { type: Type.STRING, enum: ["left", "right"] }
                    },
                    required: ["title", "content", "alignment"]
                  }
                },
                testimonials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      comment: { type: Type.STRING }
                    },
                    required: ["name", "role", "comment"]
                  }
                },
                faq: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING }
                    },
                    required: ["question", "answer"]
                  }
                },
                legal: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    lastUpdated: { type: Type.STRING },
                    companyName: { type: Type.STRING },
                    governingLaw: { type: Type.STRING },
                    clauses: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING }
                        },
                        required: ["title", "description"]
                      }
                    }
                  },
                  required: ["title", "lastUpdated", "companyName", "governingLaw", "clauses"]
                }
              },
              required: ["themeName", "colors", "fontStyle", "hero", "features", "stats", "sections", "testimonials", "faq", "legal"]
            }
          }
        });
        text = response.text || "";
      } catch (apiErr) {
        console.error("Gemini website generation failed, falling back gracefully to mock system:", apiErr);
        return NextResponse.json({ website: getMockWebsiteResults(promptText) });
      }
 
       try {
         const data = JSON.parse(text);
         return NextResponse.json({ website: data });
       } catch (parseErr) {
         console.error("Failed to parse website JSON: ", text);
         return NextResponse.json({ website: getMockWebsiteResults(promptText) });
       }
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });

  } catch (error: any) {
    console.error("Gemini API server exception details: ", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
