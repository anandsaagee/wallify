const STORAGE_KEY = 'wallify_clicks';

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const trackProductClick = (productId: string) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  data[productId] = (data[productId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTopProducts = (products: any[], limit = 10) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  // First shuffle the entire products array to give every product a fair chance 
  // when clicks are tied (especially when clicks are 0)
  const shuffledCandidates = shuffleArray(products);

  return shuffledCandidates
    .map((p) => ({
      ...p,
      clicks: data[p.id] || 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
};

