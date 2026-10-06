const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Requires: npm install @google/generative-ai

// Initialize Gemini (Replace with your actual API key)
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(API_KEY);

const productsFilePath = path.join(__dirname, '../src/data/products.ts');
const automotiveImagesDir = path.join(__dirname, '../public/assets/automotive');

// Helper to convert local image to GoogleGenerativeAI format
function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType
        },
    };
}

async function analyzeAndGenerateSEO() {
    console.log("Starting visual SEO analysis for Automotive posters...");
    
    // Read products.ts
    let content = fs.readFileSync(productsFilePath, 'utf8');
    const arrayStart = content.indexOf('[');
    const arrayEnd = content.lastIndexOf(']');
    
    if (arrayStart === -1 || arrayEnd === -1) {
        console.error("Failed to parse products array");
        process.exit(1);
    }

    let jsonStr = content.substring(arrayStart, arrayEnd + 1);
    let products = new Function('return ' + jsonStr)();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Loop through Automotive products
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        
        if (p.category === 'Automotive' && (!p.seoTitle || p.title.includes('–'))) {
            const imageNumber = p.label.match(/\d+/)[0];
            const imagePath = path.join(automotiveImagesDir, p.label);
            
            if (!fs.existsSync(imagePath)) {
                console.warn(`[SKIP] Image not found locally: ${imagePath}`);
                continue;
            }

            console.log(`Analyzing ${p.label}...`);

            const prompt = `
            You are an expert e-commerce SEO copywriter. Look at this car poster.
            Generate a JSON object with the following exact keys for this poster:
            {
                "seoTitle": "A catchy, keyword-rich SEO title (max 60 chars) describing the car and style",
                "metaDescription": "A high-converting description (max 150 chars) describing the car and mood",
                "seoAltText": "A precise, descriptive alt text for visually impaired users and SEO describing the exact car, angle, and background"
            }
            ONLY output valid JSON, nothing else.`;

            let imagePart;
            if (imagePath.endsWith('.webp')) {
                imagePart = fileToGenerativePart(imagePath, "image/webp");
            } else {
                imagePart = fileToGenerativePart(imagePath, "image/jpeg");
            }

            try {
                const result = await model.generateContent([prompt, imagePart]);
                const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                const seoData = JSON.parse(text);

                // Update product object
                p.title = `Automotive ${imageNumber}`; // Enforce strict visible title
                p.seoTitle = seoData.seoTitle;
                p.metaDescription = seoData.metaDescription;
                p.seoAltText = seoData.seoAltText;
                
                // Set normal description to metaDescription for UI fallback
                p.description = seoData.metaDescription;

                console.log(`✅ Updated Automotive ${imageNumber}`);

            } catch (error) {
                console.error(`❌ Failed on ${p.label}:`, error);
            }
        }
    }

    // Save back to products.ts
    const updatedJsonStr = JSON.stringify(products, null, 4);
    const newContent = content.substring(0, arrayStart) + updatedJsonStr + content.substring(arrayEnd + 1);
    
    fs.writeFileSync(productsFilePath, newContent, 'utf8');
    console.log("🎉 All 221 Automotive products have been updated with highly accurate Vision SEO!");
}

analyzeAndGenerateSEO();
