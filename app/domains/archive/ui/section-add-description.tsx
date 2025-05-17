"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export default function SectionAddDescription({
  goToPrevStep,
  goToNextStep,
}: {
  goToPrevStep: () => void;
  goToNextStep: () => void;
}) {
  const form = useFormContext();

  return (
    <motion.div
      key="description"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            설명 입력
          </CardTitle>
          <CardDescription>
            피규어에 대한 설명과 사양을 입력해주세요. 이 단계의 모든 항목은 선택
            사항입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Info className="mr-2 h-4 w-4 text-primary" />
                    설명
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="피규어에 대한 설명을 입력하세요."
                      className="min-h-[120px] resize-y transition-all focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    피규어의 특징, 배경 스토리 등을 자세히 설명해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Info className="mr-2 h-4 w-4 text-primary" />
                    사양
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="피규어의 상세 사양을 입력하세요."
                      className="min-h-[120px] resize-y transition-all focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    피규어의 크기, 재질, 구성품 등 기술적인 사양을 입력해주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPrevStep}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            이전 단계
          </Button>
          <Button type="button" onClick={goToNextStep} className="group">
            다음 단계
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
