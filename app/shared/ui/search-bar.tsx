"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

export function SearchBar() {
  // const router = useRouter()
  // const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // const query = searchParams.get("q")
    // if (query) {
    //   setSearchTerm(query)
    // }
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (searchTerm.trim()) {
      // router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      // router.push("/")
    }
  }

  function clearSearch() {
    setSearchTerm("");
    // router.push("/")
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="피규어 이름 또는 제조사 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-8"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">검색어 지우기</span>
          </Button>
        )}
      </div>
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">검색</span>
      </Button>
    </form>
  );
}
