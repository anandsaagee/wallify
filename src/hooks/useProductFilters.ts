import { useState, useMemo, useCallback } from 'react';
import { products } from '../data/products';

export function useProductFilters() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSize('All');
  }, []);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedSize,
    setSelectedSize,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    handleClearFilters
  };
}
