const STORAGE_KEY = 'wallify_clicks';

export const trackProductClick = (productId: string) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  data[productId] = (data[productId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTopProducts = (products: any[], limit = 10) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  return [...products]
    .map((p) => ({
      ...p,
      clicks: data[p.id] || 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
};
