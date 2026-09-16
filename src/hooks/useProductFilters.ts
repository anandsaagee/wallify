import { useState, useMemo, useCallback } from 'react';
import { products } from '../data/products';

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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
  }, []);

  const handleSetSelectedCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      window.history.pushState(null, '', '/premium-wall-posters');
    } else {
      window.history.pushState(null, '', `/${category.toLowerCase()}-wall-posters`);
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

