const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Extract the array part
const arrayStart = content.indexOf('[');
const arrayEnd = content.lastIndexOf(']');

if (arrayStart !== -1 && arrayEnd !== -1) {
    let jsonStr = content.substring(arrayStart, arrayEnd + 1);
    
    // Some keys might not be quoted in older JS, but here it's valid JSON-like array
    // To safely parse, we might need eval or Function if it's JS, but looking at the preview it looks like valid JSON.
    // Let's use Function to evaluate it safely.
    let products;
    try {
        products = new Function('return ' + jsonStr)();
    } catch (e) {
        console.error("Failed to parse products array", e);
        process.exit(1);
    }

    products = products.map(product => {
        // Format title: abstract-001 -> Abstract 001
        let baseName = product.title.replace(/-/g, ' ');
        baseName = baseName.replace(/\b\w/g, l => l.toUpperCase());
        
        // Add specific descriptive keywords to title
        product.title = `${baseName} Minimalist ${product.category} Poster – Premium Matte Finish`;

        // Weave 2-3 keywords into description naturally based on category
        let categoryLower = product.category.toLowerCase();
        let keyword1, keyword2;
        
        if (categoryLower.includes('anime')) {
            keyword1 = 'HD anime print';
            keyword2 = 'aesthetic room decor';
        } else if (categoryLower.includes('movie') || categoryLower.includes('film')) {
            keyword1 = 'cult classic film art';
            keyword2 = 'vintage cinema decor';
        } else if (categoryLower.includes('car')) {
            keyword1 = 'JDM supercar wall art';
            keyword2 = 'garage enthusiast decor';
        } else {
            keyword1 = `premium ${categoryLower} wall poster`;
            keyword2 = 'HD aesthetic wall art';
        }

        product.description = `Level up your space with this ${keyword1}. Printed on high-quality, fade-resistant paper, this ${keyword2} provides a stunning premium matte finish perfect for any room.`;
        
        return product;
    });

    // Convert back to string
    const newJsonStr = JSON.stringify(products, null, 4);
    const newContent = content.substring(0, arrayStart) + newJsonStr + content.substring(arrayEnd + 1);
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Successfully updated products.ts for SEO!");
} else {
    console.error("Could not find the products array in the file.");
}
