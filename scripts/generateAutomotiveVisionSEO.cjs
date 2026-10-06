const fs = require('fs');
const path = require('path');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(API_KEY);

const productsFilePath = path.join(__dirname, '../src/data/products.ts');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchImageBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
        }).on('error', reject);
    });
}

async function analyzeAndGenerateSEO() {
    console.log("Starting visual SEO analysis for Automotive posters...");
    
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

    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        
        // Only process automotive posters that don't have seoTitle yet or have legacy titles
        if (p.category === 'Automotive' && (!p.seoTitle || p.title.includes('–'))) {
            const imageNumber = p.label.match(/\d+/)[0];
            const imageUrl = `https://res.cloudinary.com/dkwx4bacj/image/upload/v1/wallify${p.image}`;
            
            console.log(`Analyzing Automotive ${imageNumber}...`);

            const prompt = `
            You are an expert e-commerce SEO copywriter. Look at this car poster.
            Generate a JSON object with the following exact keys for this poster:
            {
                "seoTitle": "A catchy, keyword-rich SEO title (max 60 chars) describing the car and style",
                "metaDescription": "A high-converting description (max 150 chars) describing the car and mood",
                "seoAltText": "A precise, descriptive alt text for visually impaired users and SEO describing the exact car, angle, and background"
            }
            ONLY output valid JSON, nothing else.`;

            try {
                const buffer = await fetchImageBuffer(imageUrl);
                const imagePart = {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: "image/webp"
                    }
                };

                const result = await model.generateContent([prompt, imagePart]);
                const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                const seoData = JSON.parse(text);

                // Update product object
                p.title = `Automotive ${imageNumber}`; // Enforce strict visible title
                p.seoTitle = seoData.seoTitle;
                p.metaDescription = seoData.metaDescription;
                p.seoAltText = seoData.seoAltText;
                p.description = seoData.metaDescription; // Fallback UI description

                console.log(`✅ Updated Automotive ${imageNumber}: ${seoData.seoTitle}`);

                // Wait 4 seconds to avoid hitting the free tier limit (15 requests/min)
                await delay(4200);
            } catch (error) {
                console.error(`❌ Failed on ${p.label}:`, error.message);
                // In case of error, still delay before next attempt
                await delay(4200);
            }
        }
    }

    // Save back to products.ts
    const updatedJsonStr = JSON.stringify(products, null, 4);
    const newContent = content.substring(0, arrayStart) + updatedJsonStr + content.substring(arrayEnd + 1);
    
    fs.writeFileSync(productsFilePath, newContent, 'utf8');
    console.log("🎉 All Automotive products have been successfully updated!");
}

analyzeAndGenerateSEO();
