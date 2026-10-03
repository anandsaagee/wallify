export interface CategorySeoData {
  name: string;
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  snippet: string;
}

export const CATEGORY_SEO: Record<string, CategorySeoData> = {
  All: {
    name: 'All',
    slug: '',
    h1: 'Premium Wall Posters',
    metaTitle: 'WallifyStore – Premium Anime, Film & Car Wall Posters Online India',
    metaDescription:
      'Shop premium HD wall posters in India. High quality 300 GSM fade-resistant matte prints across Anime, Cars, Movies, Sports & Quotes. Fast Kerala delivery & bulk discounts!',
    snippet:
      "Transform your space with India's highest quality HD posters. Printed on thick, glare-free 300 GSM paper with vibrant archival inks.",
  },
  Anime: {
    name: 'Anime',
    slug: 'anime',
    h1: 'Premium Anime Wall Posters',
    metaTitle: 'Buy Anime Posters Online India – Jujutsu Kaisen, One Piece, Naruto | WallifyStore',
    metaDescription:
      'Buy aesthetic anime wall posters online in India. High definition prints of Jujutsu Kaisen, Demon Slayer, Attack on Titan, Berserk, and Solo Leveling on 300 GSM matte paper.',
    snippet:
      'Level up your room aesthetics with crisp anime wall art. Featuring fan-favorite heroes, iconic manga panels, and epic battle sequences.',
  },
  Automotive: {
    name: 'Automotive',
    slug: 'automotive',
    h1: 'Premium Automotive & Supercar Posters',
    metaTitle: 'Car Posters for Room – JDM, Supercars & F1 Wall Art | WallifyStore',
    metaDescription:
      'Buy high quality car posters online in India. Featuring iconic JDM legends (GTR, Supra, RX-7), Porsche, Ferrari, BMW, and Formula 1 track art printed in vivid HD detail.',
    snippet:
      'Fuel your passion with high-octane automotive wall art. From Japanese JDM classics to legendary European supercars and F1 circuits.',
  },
  Mollywood: {
    name: 'Mollywood',
    slug: 'mollywood',
    h1: 'Premium Malayalam Movie Wall Posters',
    metaTitle: 'Malayalam Movie Posters Online – Classic & New Mollywood Wall Art | WallifyStore',
    metaDescription:
      'Celebrate Kerala cinema with premium Malayalam movie posters. Featuring Mohanlal, Mammootty, classic cult hits, and modern Mollywood masterpieces in HD quality.',
    snippet:
      'Tribute to god’s own cinema. Timeless Mohanlal, Mammootty, and modern Mollywood cult classics crafted with nostalgic artistic precision.',
  },
  Hollywood: {
    name: 'Hollywood',
    slug: 'hollywood',
    h1: 'Premium Hollywood & Cinema Posters',
    metaTitle: 'Hollywood Movie Posters Online – Classic Film & Blockbuster Wall Art | WallifyStore',
    metaDescription:
      'Discover vintage and modern Hollywood movie posters. From Godfather, Pulp Fiction, Christopher Nolan, and Fight Club to Marvel and DC superheroes in premium print.',
    snippet:
      'Iconic cinema for true cinephiles. Relive greatest films, cinematic masterpieces, and cult favorites framed for your home theater or room.',
  },
  Football: {
    name: 'Football',
    slug: 'football',
    h1: 'Premium Football & Sports Posters',
    metaTitle: 'Football Posters Online India – Ronaldo, Messi & Club Wall Art | WallifyStore',
    metaDescription:
      'Shop football wall posters online in India. High resolution prints of Cristiano Ronaldo, Lionel Messi, Neymar, Real Madrid, Manchester United, and iconic match moments.',
    snippet:
      'Bring stadium energy directly to your walls. Legendary GOAT moments, iconic celebrations, and football club heritage in vivid color.',
  },
  Quotes: {
    name: 'Quotes',
    slug: 'quotes',
    h1: 'Motivational & Inspirational Quote Posters',
    metaTitle: 'Motivational Quote Posters for Study & Office – Aesthetic Wall Art | WallifyStore',
    metaDescription:
      'Shop minimalist motivational and mindset quote posters online. Modern typography wall prints designed for bedrooms, study tables, gyms, and home offices.',
    snippet:
      'Fuel daily focus and mental resilience. Clean typography quote prints designed to keep you inspired every time you look up.',
  },
  Abstract: {
    name: 'Abstract',
    slug: 'abstract',
    h1: 'Modern Abstract Wall Posters',
    metaTitle: 'Modern Abstract Posters & Aesthetic Wall Prints | WallifyStore',
    metaDescription:
      'Explore aesthetic abstract art posters online in India. Modern geometric shapes, neutral boho tones, and contemporary artwork printed on archival matte paper.',
    snippet:
      'Elevate modern interior decor with curated abstract prints. Rich textures, warm minimalism, and expressive contemporary art forms.',
  },
  Spiritual: {
    name: 'Spiritual',
    slug: 'spiritual',
    h1: 'Spiritual & Peaceful Wall Posters',
    metaTitle: 'Spiritual Wall Posters Online – Calm & Serene Room Decor | WallifyStore',
    metaDescription:
      'Find serene spiritual and devotional wall posters. Calm meditation artwork, deities, and sacred symbols crafted with elegant peaceful aesthetics.',
    snippet:
      'Infuse your sanctuary with serenity, calm mindfulness, and positive spiritual vibrations in timeless artistic renditions.',
  },
  Tamil: {
    name: 'Tamil',
    slug: 'tamil',
    h1: 'Premium Tamil Movie Wall Posters',
    metaTitle: 'Tamil Movie Posters Online – Kollywood Mass & Classic Film Art | WallifyStore',
    metaDescription:
      'Celebrate Kollywood with premium Tamil movie posters. Featuring Rajinikanth, Kamal Haasan, Thalapathy Vijay, Ajith Kumar, and iconic Tamil cinema blockbusters.',
    snippet:
      'Pure Kollywood mass and emotion. Celebrate superstar legacy, high-energy blockbusters, and iconic dialogues captured on premium prints.',
  },
  Music: {
    name: 'Music',
    slug: 'music',
    h1: 'Vintage & Modern Music Band Posters',
    metaTitle: 'Music Band Posters Online India – Rock, Hip Hop & Pop Wall Art | WallifyStore',
    metaDescription:
      'Buy music wall posters online in India. Vintage rock band prints, hip-hop icons, classic album covers, and pop legends on premium fade-resistant matte paper.',
    snippet:
      'Turn your wall into a personal music hall of fame. Vintage album art, rock anthems, and hip-hop legends in rich detail.',
  },
};
