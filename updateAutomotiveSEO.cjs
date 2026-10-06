const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'products.ts');
let content = fs.readFileSync(filePath, 'utf8');

const arrayStart = content.indexOf('[');
const arrayEnd = content.lastIndexOf(']');

if (arrayStart !== -1 && arrayEnd !== -1) {
    let jsonStr = content.substring(arrayStart, arrayEnd + 1);
    
    let products;
    try {
        products = new Function('return ' + jsonStr)();
    } catch (e) {
        console.error("Failed to parse products array", e);
        process.exit(1);
    }

    const titleSuffixes = [
        ' – JDM & Supercar Wall Poster',
        ' – Vintage Classic Car Room Decor',
        ' – Premium Drift Racing Wall Art',
        ' – Aesthetic Garage Car Poster',
        ' – Modern Supercar Minimalist Print',
        ' – Retro JDM Car Wall Poster',
        ' – Luxury Sports Car Poster Art',
        ' – Street Racing Aesthetic Decor'
    ];

    const descriptions = [
        'Elevate your room or garage with this premium JDM and supercar wall poster. Printed on heavy, fade-resistant paper with a stunning matte finish, this aesthetic car art is perfect for gearheads and automotive enthusiasts.',
        'Bring the thrill of the track to your walls with this high-definition racing and drift car poster. Featuring rich, vibrant colors and a premium matte finish, it is the ultimate decor for any car lover.',
        'Add a touch of automotive excellence to your space with this classic and vintage car wall poster. Crafted on gallery-quality paper, this minimalist automotive print is an ideal gift for any passionate car collector.',
        'Transform your bedroom or garage with this modern luxury supercar poster. Designed with sharp HD details and a fade-resistant premium matte finish, this aesthetic wall art captures the pure essence of speed and design.'
    ];

    let updatedCount = 0;

    products = products.map((product, index) => {
        if (product.category === 'Automotive') {
            const match = product.title.match(/^(Automotive\s+\d+)/i);
            const prefix = match ? match[1] : ('Automotive ' + String(index + 1).padStart(3, '0'));
            
            const suffix = titleSuffixes[index % titleSuffixes.length];
            product.title = prefix + suffix;
            
            const desc = descriptions[index % descriptions.length];
            product.description = desc;
            updatedCount++;
        }
        return product;
    });

    const newJsonStr = JSON.stringify(products, null, 4);
    const newContent = content.substring(0, arrayStart) + newJsonStr + content.substring(arrayEnd + 1);
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully updated ' + updatedCount + ' Automotive products for SEO!');
} else {
    console.error("Could not find the products array in the file.");
}
