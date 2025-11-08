import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from '@/utils';

export const useSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vahanbazar-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('vahanbazar-recent-searches', JSON.stringify(updated));
  };

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      saveRecentSearch(query);
    }
  }, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleDirectSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      saveRecentSearch(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('vahanbazar-recent-searches');
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleDirectSearch,
    recentSearches,
    clearRecentSearches
  };
};