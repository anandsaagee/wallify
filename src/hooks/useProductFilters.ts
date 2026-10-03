import { useState, useMemo, useCallback, useEffect } from 'react';
import { products } from '../data/products';
import { CATEGORIES } from '../data/config';

// Detect category from URL on initial load or popstate
function getInitialCategory(): string {
  if (typeof window === 'undefined') return 'All';
  const path = window.location.pathname.toLowerCase();

  const matchCategory = path.match(/^\/category\/([a-z0-9_-]+)/);
  if (matchCategory) {
    const slug = matchCategory[1];
    const found = CATEGORIES.find((c) => c.toLowerCase() === slug);
    if (found) return found;
  }

  const matchWallPosters = path.match(/^\/([a-z0-9_-]+)-wall-posters/);
  if (matchWallPosters) {
    const slug = matchWallPosters[1];
    const found = CATEGORIES.find((c) => c.toLowerCase() === slug);
    if (found) return found;
  }

  return 'All';
}

// Fisher-Yates Shuffle Algorithm for optimal randomness
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useProductFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string>(getInitialCategory);
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync category on browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setSelectedCategory(getInitialCategory());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    // Randomize the order every time filters change
    return shuffleArray(filtered);
  }, [selectedCategory, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSize('All');
    if (window.location.pathname !== '/') {
      window.history.pushState({ category: 'All' }, '', '/');
    }
  }, []);

  const handleSetSelectedCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      window.history.pushState({ category: 'All' }, '', '/');
    } else {
      window.history.pushState({ category }, '', `/category/${category.toLowerCase()}`);
    }
  }, []);

  return {
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    selectedSize,
    setSelectedSize,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    handleClearFilters
  };
}

