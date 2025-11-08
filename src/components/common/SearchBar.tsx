import React, { useState } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  showRecentSearches?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search for bikes, scooters, brands...',
  size = 'md',
  showRecentSearches = true,
  className = '',
}) => {
  const { searchQuery, setSearchQuery, handleDirectSearch, recentSearches, clearRecentSearches } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      handleDirectSearch(localQuery);
      setIsFocused(false);
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setLocalQuery(query);
    handleDirectSearch(query);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className={`pl-12 ${sizeClasses[size]} font-open-sans`}
          />
        </div>
        <Button type="submit" size={size === 'lg' ? 'lg' : 'default'} className="font-inter">
          Search
        </Button>
      </form>

      {/* Recent Searches Dropdown */}
      {showRecentSearches && isFocused && recentSearches.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-open-sans text-sm font-medium text-muted-foreground">
                Recent Searches
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-xs h-6 px-2"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-open-sans text-sm text-foreground">
                    {query}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;