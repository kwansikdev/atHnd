import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Check, HelpCircle } from "lucide-react";
import SectionAddBasic from "./section-add-basic";
import SectionAddDetails from "./section-add-details";
import SectionAddImages from "./section-add-images";
import SectionAddDescription from "./section-add-description";
import SectionAddReview from "./section-add-review";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcherActionContext } from "~/hooks/use-fetcher-action-state";
import { format } from "date-fns";
import { Switch } from "~/components/ui/switch";
import { getHelpContentAction } from "../action";

// 폼 스키마 정의
const figureAddFormSchema = z.object({
  name: z.string().min(1, "피규어 이름을 입력해 주세요."),
  character_id: z.string().min(1, "캐릭터를 선택해 주세요."),
  series_id: z.string().min(1, "작품을 선택해 주세요."),
  manufacturer_id: z.string().min(1, "제조사를 선택해 주세요."),
  category_id: z.string().min(1, "카테고리를 선택해 주세요."),
  price_kr: z.number().min(1, "가격은 0 이상이어야 합니다."),
  price_jp: z.number().optional(),
  price_cn: z.number().optional(),
  release_year: z.number().optional(),
  release_month: z.number().optional(),
  release_text: z.string().optional(),

  name_jp: z.string().optional(),
  name_en: z.string().optional(),
  paint_work: z.array(z.string()).optional(),
  sculptors: z.array(z.string()).optional(),
  scale_id: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  adult: z.boolean().optional(),
  limited: z.boolean().optional(),

  images: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        sort_order: z.number().optional(),
      })
    )
    .min(1, "이미지는 최소 1개 이상 필요합니다."),

  description: z.string().optional(),
  specifications: z.string().optional(),
});

export type FigureAddFormValues = z.infer<typeof figureAddFormSchema>;

// 단계별 폼 정의
type FormStep = "basic" | "details" | "images" | "description" | "review";

export function ArchiveFigureForm() {
  const { isSuccess } = useFetcherActionContext();

  const form = useForm<FigureAddFormValues>({
    resolver: zodResolver(figureAddFormSchema),
    defaultValues: {
      name: "",
      character_id: "",
      series_id: "",
      manufacturer_id: "",
      category_id: "",
      price_kr: 0,
      price_jp: undefined,
      price_cn: undefined,
      release_year: undefined,
      release_month: undefined,
      release_text: "",

      name_jp: "",
      name_en: "",
      paint_work: [],
      sculptors: [],
      scale_id: "",
      size: "",
      material: "",
      adult: false,
      limited: false,

      images: [],

      description: "",
      specifications: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  const [formProgress, setFormProgress] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpTopic, setHelpTopic] = useState("");

  const [, setFormData] = useState<Partial<FigureAddFormValues>>({});

  // 단계별 진행 상태 표시
  const getStepProgress = (
    step: FormStep
  ): "complete" | "current" | "upcoming" => {
    const steps: FormStep[] = [
      "basic",
      "details",
      "images",
      "description",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  // 도움말 표시
  const showHelp = (topic: string) => {
    setHelpTopic(topic);
    setShowHelpDialog(true);
  };

  // 다음 단계로 이동
  const goToNextStep = () => {
    const steps: FormStep[] = [
      "basic",
      "details",
      "images",
      "description",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    const steps: FormStep[] = [
      "basic",
      "details",
      "images",
      "description",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // 폼 진행 상태 계산
  useEffect(() => {
    const calculateProgress = () => {
      const values = form.getValues();
      const requiredFields = [
        "name",
        "manufacturer_id",
        "series_id",
        "character_id",
        "category_id",
        "release_year",
        "release_month",
        "price_kr",
        "images",
      ];
      const optionalFields = [
        "name_jp",
        "name_en",
        "sculptors",
        "paintWork",
        "scale_id",
        "size",
        "material",
        "adult",
        "limited",
        "description",
        "specifications",
      ];

      let filledRequired = 0;
      requiredFields.forEach((field) => {
        if (values[field as keyof FigureAddFormValues]) filledRequired++;
      });

      let filledOptional = 0;
      optionalFields.forEach((field) => {
        if (values[field as keyof FigureAddFormValues]) filledOptional++;
      });

      const requiredProgress = (filledRequired / requiredFields.length) * 70;
      const optionalProgress = (filledOptional / optionalFields.length) * 30;
      // const imageProgress = images.filter((img) => img.url).length > 0 ? 10 : 0;

      setFormProgress(
        Math.min(100, Math.round(requiredProgress + optionalProgress))
      );

      // 폼 데이터 저장
      setFormData(values);
    };

    calculateProgress();

    // 폼 값이 변경될 때마다 진행 상태 다시 계산
    const subscription = form.watch(() => {
      calculateProgress();
    });

    return () => subscription.unsubscribe();
  }, [form]); // form.watch() 제거하고 form 객체만 의존성으로 추가

  // 자동 저장 기능
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveTimer = setTimeout(() => {
      const values = form.getValues();
      // 로컬 스토리지에 저장
      localStorage.setItem(
        "figureDraftData",
        JSON.stringify({
          formData: values,
          // images,
          // thumbnailIndex,
          timestamp: new Date().toISOString(),
        })
      );
      setLastSaved(new Date());
    }, 30000); // 30초마다 자동 저장

    return () => clearTimeout(autoSaveTimer);
  }, [autoSaveEnabled, form]); // form.watch() 제거

  // // 로컬 스토리지에서 임시 저장 데이터 불러오기
  // useEffect(() => {
  //   if (figure) return; // 기존 피규어 수정 시에는 불러오지 않음

  //   const savedData = localStorage.getItem("figureDraftData");
  //   if (savedData) {
  //     try {
  //       const {
  //         formData,
  //         images: savedImages,
  //         thumbnailIndex: savedThumbnailIndex,
  //         timestamp,
  //       } = JSON.parse(savedData);

  //       // 24시간 이내의 데이터만 불러옴
  //       const savedTime = new Date(timestamp);
  //       const now = new Date();
  //       const hoursDiff =
  //         (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

  //       if (hoursDiff <= 24) {
  //         // 임시 저장 데이터 복원 여부 확인
  //         const confirmRestore = window.confirm(
  //           `${format(
  //             savedTime,
  //             "yyyy년 MM월 dd일 HH:mm"
  //           )}에 임시 저장된 데이터가 있습니다. 불러오시겠습니까?`
  //         );

  //         if (confirmRestore) {
  //           // 폼 데이터 복원
  //           Object.keys(formData).forEach((key) => {
  //             form.setValue(key as keyof FigureFormValues, formData[key]);
  //           });

  //           // 이미지 데이터 복원
  //           if (savedImages && savedImages.length > 0) {
  //             setImages(savedImages.map((url: string) => ({ url })));
  //             setThumbnailIndex(savedThumbnailIndex || 0);
  //           }

  //           setLastSaved(savedTime);
  //           toast({
  //             title: "임시 저장 데이터 복원 완료",
  //             description: `${format(
  //               savedTime,
  //               "yyyy년 MM월 dd일 HH:mm"
  //             )}에 저장된 데이터를 불러왔습니다.`,
  //           });
  //         } else {
  //           // 임시 저장 데이터 삭제
  //           localStorage.removeItem("figureDraftData");
  //         }
  //       } else {
  //         // 오래된 데이터 삭제
  //         localStorage.removeItem("figureDraftData");
  //       }
  //     } catch (error) {
  //       console.error("임시 저장 데이터 불러오기 오류:", error);
  //       localStorage.removeItem("figureDraftData");
  //     }
  //   }
  // }, []);

  return (
    <Form {...form}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 space-y-8"
      >
        {/* 진행 상태 표시 */}
        <div className="relative space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
              <span>폼 작성 진행도</span>
              <Badge
                variant={formProgress === 100 ? "default" : "outline"}
                className={`ml-2 transition-all duration-300 ${
                  formProgress === 100 ? "bg-green-500" : ""
                }`}
              >
                {formProgress}%
              </Badge>
            </h2>
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoSaveEnabled}
                onCheckedChange={(checked) => {
                  setAutoSaveEnabled(checked);
                }}
                id="auto-save"
              />
              <label htmlFor="auto-save" className="text-sm cursor-pointer">
                자동 저장
              </label>
            </div>
          </div>
          <Progress value={formProgress} className="h-2" />
          {lastSaved && (
            <p className="absolute -bottom-6 right-0 text-xs text-muted-foreground text-right">
              마지막 저장: {format(lastSaved, "yyyy년 MM월 dd일 HH:mm")}
            </p>
          )}
        </div>

        {/* 단계별 진행 상태 */}
        <div className="flex justify-between items-center pt-4">
          {["basic", "details", "images", "description", "review"].map(
            (step, index) => (
              <div key={step} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step as FormStep)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    getStepProgress(step as FormStep) === "complete"
                      ? "bg-primary text-primary-foreground"
                      : getStepProgress(step as FormStep) === "current"
                      ? "bg-primary/20 border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getStepProgress(step as FormStep) === "complete" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </button>
                <span
                  className={`text-xs mt-2 font-medium ${
                    getStepProgress(step as FormStep) === "current"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step === "basic" && "기본 정보"}
                  {step === "details" && "상세 정보"}
                  {step === "images" && "이미지"}
                  {step === "description" && "설명"}
                  {step === "review" && "검토"}
                </span>
              </div>
            )
          )}
        </div>

        {/* 단계 사이 연결선 */}
        <div className="relative h-0.5 bg-muted mb-8">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
            style={{
              width: `${
                currentStep === "basic"
                  ? 0
                  : currentStep === "details"
                  ? 25
                  : currentStep === "images"
                  ? 50
                  : currentStep === "description"
                  ? 75
                  : 100
              }%`,
            }}
          />
        </div>

        {/* 현재 단계 설명 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {currentStep === "basic" && "기본 정보 입력"}
            {currentStep === "details" && "상세 정보 입력"}
            {currentStep === "images" && "이미지 업로드"}
            {currentStep === "description" && "설명 입력"}
            {currentStep === "review" && "최종 검토"}
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => showHelp(currentStep)}
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>도움말 보기</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* 도움말 다이얼로그 */}
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentStep === "basic" && "기본 정보 입력 도움말"}
                {currentStep === "details" && "상세 정보 입력 도움말"}
                {currentStep === "images" && "이미지 업로드 도움말"}
                {currentStep === "description" && "설명 입력 도움말"}
                {currentStep === "review" && "최종 검토 도움말"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">{getHelpContentAction(helpTopic)}</div>
            <DialogFooter>
              <Button onClick={() => setShowHelpDialog(false)}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* 기본 정보 단계 */}
        {currentStep === "basic" && (
          <SectionAddBasic goToNextStep={goToNextStep} />
        )}

        {currentStep === "details" && (
          <SectionAddDetails
            goToPrevStep={goToPrevStep}
            goToNextStep={goToNextStep}
          />
        )}

        {currentStep === "images" && (
          <SectionAddImages
            goToPrevStep={goToPrevStep}
            goToNextStep={goToNextStep}
          />
        )}

        {currentStep === "description" && (
          <SectionAddDescription
            goToPrevStep={goToPrevStep}
            goToNextStep={goToNextStep}
          />
        )}

        {currentStep === "review" && (
          <SectionAddReview
            goToPrevStep={goToPrevStep}
            goToStartStep={() => setCurrentStep("basic")}
          />
        )}
      </AnimatePresence>
    </Form>
  );
}
