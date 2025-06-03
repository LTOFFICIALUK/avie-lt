"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Select, Alert, Input } from "antd";
import type { InputRef } from "antd/lib/input";
import { LoadingOutlined, SearchOutlined, DownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    streams: number;
  };
}

interface CategorySelectorProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadingInProgress = useRef(false);

  // Izračunamo trenutno izbrano kategorijo
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return "";
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : "";
  }, [selectedCategory, categories]);

  // Ob odpiranju/zapiranju dropdowna
  const toggleDropdown = () => {
    if (!isOpen && categories.length === 0 && !loading) {
      fetchCategories(1, true);
    }
    setIsOpen(!isOpen);
  };

  // Zapremo dropdown ob kliku izven komponente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Ob prvem renderu naložimo kategorije
  useEffect(() => {
    fetchCategories(1, true);
  }, []);

  // Nalaganje kategorij
  const fetchCategories = async (page: number = 1, resetExisting: boolean = false) => {
    if (loading || loadingInProgress.current) return;
    
    loadingInProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/categories?page=${page}`);
      
      let newCategories: Category[] = [];
      
      if (response.data && response.data.status === 'success') {
        newCategories = response.data.data.categories;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.categories)) {
        newCategories = response.data.data.categories;
      } else {
        console.error('Unexpected category response format:', response);
        setError('Failed to load categories: Invalid response format');
        loadingInProgress.current = false;
        setLoading(false);
        return;
      }

      // Če ni več kategorij, nastavimo hasMore na false
      if (newCategories.length === 0) {
        setHasMore(false);
      } else {
        // Posodobimo trenutno stran
        setCurrentPage(page);
        
        // Združimo obstoječe kategorije z novimi ali zamenjamo, če resetExisting
        if (resetExisting) {
          setCategories(newCategories);
          setTotalLoaded(newCategories.length);
        } else {
          // Dodamo samo kategorije, ki jih še nimamo (preprečimo duplikate)
          const existingIds = new Set(categories.map(c => c.id));
          const uniqueNewCategories = newCategories.filter(c => !existingIds.has(c.id));
          
          // Uporabimo funkcijsko obliko za posodobitev state, da zagotovimo najnovejše stanje
          setCategories(prev => [...prev, ...uniqueNewCategories]);
          setTotalLoaded(prev => prev + uniqueNewCategories.length);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      loadingInProgress.current = false;
      setLoading(false);
    }
  };

  // Iskanje kategorij glede na iskalni niz
  const searchCategories = async (query: string) => {
    if (!query.trim() || loading || loadingInProgress.current) {
      // Če je iskalni niz prazen, naložimo standardne kategorije
      if (!query.trim() && categories.length === 0) {
        fetchCategories(1, true);
      } else if (!query.trim() && !loading) {
        // Če smo pred tem iskali in je iskalni niz zdaj prazen, naložimo standardne kategorije
        fetchCategories(1, true);
        setHasMore(true);
      }
      return;
    }
    
    loadingInProgress.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/categories/search?q=${encodeURIComponent(query)}`);
      
      if (response.data && response.data.status === 'success') {
        const searchResults = response.data.data.categories;
        setCategories(searchResults);
        setHasMore(false); // Pri iskanju ne omogočamo "load more"
        setTotalLoaded(searchResults.length);
      } else {
        console.error('Unexpected search response format:', response);
        setError('Failed to search categories: Invalid response format');
      }
    } catch (error) {
      console.error('Error searching categories:', error);
      setError('Failed to search categories');
    } finally {
      loadingInProgress.current = false;
      setLoading(false);
    }
  };
  
  // Debounce za iskanje, da ne kličemo API-ja pri vsakem vnosu znaka
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (isOpen) {
        searchCategories(searchText);
      }
    }, 500); // 500ms zakasnitev
    
    return () => clearTimeout(delaySearch);
  }, [searchText, isOpen]);

  // Filtriramo kategorije glede na iskalni niz - zdaj uporabljamo le za lokalno filtriranje že naloženih kategorij
  const filteredCategories = useMemo(() => {
    return categories;
  }, [categories]);

  // Funkcija za obravnavo scroll dogodka
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!dropdownRef.current) return;
    
    // Preverimo, ali smo dosegli 80% višine scrollable vsebine
    const target = e.target as HTMLDivElement;
    const isNearBottom = 
      target.scrollTop + target.clientHeight >= target.scrollHeight * 0.8;
    
    if (isNearBottom && !loading && !loadingInProgress.current && hasMore) {
      // Naložimo naslednjo stran
      fetchCategories(currentPage + 1, false);
    }
  };

  // Izberemo kategorijo
  const selectCategory = (categoryId: string) => {
    onCategoryChange(categoryId);
    // Ne zapiramo dropdown-a, da ostane odprt
    // setIsOpen(false);
  };

  // Počistimo izbiro
  const clearSelection = () => {
    onCategoryChange(null);
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  // Kreiramo seznam opcij za prikaz
  const selectOptions = categories.map(category => ({
    value: category.id,
    label: (
      <div className="flex items-center justify-between w-full">
        <span>{category.name}</span>
        {category._count && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {category._count.streams} live
          </span>
        )}
      </div>
    ),
    searchText: category.name.toLowerCase()
  }));

  return (
    <div className="space-y-2.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Stream Category
        </label>
        <button 
          type="button" 
          onClick={() => {
            if (!loading && !loadingInProgress.current) {
              fetchCategories(1, true);
            }
          }} 
          className="text-xs flex items-center gap-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LoadingOutlined style={{ fontSize: '12px', display: loading ? 'inline-block' : 'none' }} spin />
          <span>Refresh</span>
        </button>
      </div>
      
      {/* Izboljšana Select komponenta s prvotnim izgledom */}
      <div className="relative">
        <div 
          className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
            isOpen ? 'border-[var(--color-brand)]' : 'border-[var(--border-color)]'
          } bg-card/50`}
          onClick={toggleDropdown}
          style={{ minHeight: '32px' }}
        >
          <div className="flex items-center flex-1 truncate">
            {selectedCategory ? (
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{selectedCategoryName}</span>
              </div>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>Search or select a category</span>
            )}
          </div>
          {selectedCategory && (
            <CloseCircleOutlined
              style={{ color: 'var(--text-secondary)', marginLeft: '8px', marginRight: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
            />
          )}
          <DownOutlined style={{ color: 'var(--text-secondary)' }} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-1 overflow-hidden rounded-md shadow-lg"
            style={{ 
              backgroundColor: 'var(--background)',
              borderRadius: '7px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              maxHeight: '300px'
            }}
          >
            <div className="p-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <Input
                ref={inputRef}
                placeholder="Search categories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
                suffix={loading ? <LoadingOutlined style={{ color: 'var(--text-secondary)' }} /> : null}
                size="middle"
                style={{ width: '100%' }}
                autoFocus
              />
            </div>
            
            <div 
              className="overflow-auto" 
              style={{ maxHeight: '250px' }}
              onScroll={handleScroll}
              ref={dropdownRef}
            >
              {filteredCategories.length === 0 && !loading ? (
                <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {searchText ? 'No categories found for your search' : 'No categories found'}
                </div>
              ) : (
                <div>
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-2 cursor-pointer hover:bg-opacity-10 hover:bg-white"
                      style={{ 
                        backgroundColor: selectedCategory === category.id ? 'var(--background-selected)' : 'transparent'
                      }}
                      onClick={() => selectCategory(category.id)}
                    >
                      <div className="truncate">{category.name}</div>
                      <div className="flex items-center">
                        {category._count && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '8px' }}>
                            {category._count.streams} live
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {loading && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <LoadingOutlined spin style={{ color: 'var(--color-brand)' }} />
                  <span style={{ marginLeft: 8, color: 'var(--text-secondary)' }}>
                    {searchText ? 'Searching categories...' : 'Loading more categories...'}
                  </span>
                </div>
              )}
              
              {!hasMore && totalLoaded > 0 && !loading && searchText && (
                <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  Showing search results for "{searchText}"
                </div>
              )}
              
              {!hasMore && totalLoaded > 0 && !loading && !searchText && (
                <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  All categories loaded
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Choose a category that best represents your stream content
      </div>
    </div>
  );
};

export default CategorySelector; 