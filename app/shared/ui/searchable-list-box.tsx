"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Star, Plus, Check, Loader2 } from "lucide-react";
import { cn } from "~/utils";
import { Input } from "~/components/ui/input";
import { debounce } from "es-toolkit";

export type ListBoxOption = {
  value: string;
  label: string;
  id?: string;
  parentId?: string;
};

type SearchableListBoxProps = {
  options: ListBoxOption[];
  value: string;
  onSearch?: (query: string) => Promise<void> | void; // 검색 콜백 수정
  onChange: (value: string) => void;
  onCreateNew?: (name: string) => void;
  placeholder?: string;
  filterByParentId?: string;
  disabled?: boolean;
  recentValues?: string[];
  className?: string;
  debounceMs?: number;
  isHiddenInput?: boolean;
  isLoading?: boolean;
};

export function SearchableListBox({
  options,
  value,
  onSearch,
  onChange,
  onCreateNew,
  placeholder = "Search...",
  filterByParentId,
  disabled = false,
  recentValues = [],
  className,
  debounceMs = 300,
  isHiddenInput = false,
  isLoading = false,
}: SearchableListBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchRef = useRef<ReturnType<typeof debounce>>(null);

  useEffect(() => {
    if (!onSearch) return;

    debouncedSearchRef.current = debounce((query: string) => {
      if (query) {
        onSearch(query);
      }
    }, debounceMs);

    // cleanup: 이전 debounce 함수 취소
    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [onSearch, debounceMs]);

  // 검색어 변경 시 debounced 검색 실행
  useEffect(() => {
    if (searchQuery && debouncedSearchRef.current) {
      debouncedSearchRef.current(searchQuery);
    }
  }, [searchQuery]);

  // parentId 필터링만 클라이언트에서 처리
  const filteredOptions = useMemo(() => {
    if (!filterByParentId) return options;
    return options.filter((opt) => opt.parentId === filterByParentId);
  }, [options, filterByParentId]);

  const recentOptions = useMemo(() => {
    if (!recentValues.length) return [];
    return options.filter((opt) => recentValues.includes(opt.value));
  }, [options, recentValues]);

  const showCreateOption =
    searchQuery &&
    onCreateNew &&
    !filteredOptions.some(
      (opt) => opt.label.toLowerCase() === searchQuery.toLowerCase()
    );

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
    // setSearchQuery("");
  };

  const handleCreate = () => {
    if (disabled || !searchQuery || !onCreateNew) return;
    onCreateNew(searchQuery);
    onChange(searchQuery);
    setSearchQuery("");
  };

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  return (
    <div
      className={cn(
        "rounded-lg border bg-background overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Search Input */}
      <div className={cn("relative border-b", isHiddenInput && "hidden")}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="border-0 pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
        />
      </div>

      {/* Options List */}
      <div className={cn("h-48 overflow-y-auto", isHiddenInput && "h-[230px]")}>
        {disabled ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Select series first...
          </div>
        ) : (
          <>
            {/* Recent Section */}
            {recentOptions.length > 0 && !searchQuery && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-1 bg-muted/30">
                  <Star className="h-3 w-3" />
                  Recent
                </div>
                {recentOptions.map((option) => (
                  <button
                    key={`recent-${option.value}`}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-muted/50 transition-colors",
                      selectedOption?.value === option.value &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
                <div className="border-b" />
              </>
            )}

            {/* All Options */}
            {filteredOptions.length > 0 &&
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-muted/50 transition-colors",
                    selectedOption?.value === option.value &&
                      "bg-primary/10 text-primary"
                  )}
                >
                  <span>{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}

            {isLoading ? (
              <div className="flex items-center gap-4 justify-center p-4 text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : null}

            {!isLoading &&
              filteredOptions.length === 0 &&
              !showCreateOption && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}

            {/* Create New Option */}
            {showCreateOption && (
              <button
                type="button"
                onClick={handleCreate}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-muted/50 transition-colors text-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Create &quot;{searchQuery}&quot;</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
