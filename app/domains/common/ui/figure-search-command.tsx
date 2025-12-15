"use client";

import { useState, useEffect } from "react";

import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "~/components/ui/command";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";

interface FigureSearchCommandProps {
  onSelect: (figure: any) => void;
}

export function FigureSearchCommand({ onSelect }: FigureSearchCommandProps) {
  const { Form } = useFetcherActionState({});
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function loadFigures() {
      try {
        // const allFigures = await getDatabaseFigures()
        // setFigures(allFigures)
      } catch (error) {
        console.error("피규어 로드 중 오류:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFigures();
  }, []);

  return (
    <Form>
      <Command className="rounded-lg border shadow-md max-h-[500px]">
        <CommandInput placeholder="피규어 이름, 제조사, 캐릭터로 검색..." />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Search className="h-8 w-8 mb-2" />
              <p>검색 결과가 없습니다</p>
              <p className="text-sm">다른 키워드로 검색해보세요</p>
            </div>
          </CommandEmpty>
        </CommandList>
      </Command>
    </Form>
  );
}
