import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  FileDown,
  FileSpreadsheet,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// CSV 템플릿 다운로드를 위한 샘플 데이터
const CSV_TEMPLATE = `name,nameJp,nameEn,manufacturer,series,character,category,scale,size,material,releaseDate,price,limited,adult,description,specifications,sculptors,paintWork
"아스나 웨딩 드레스 Ver.","アスナ ウェディングドレスVer.","Asuna Wedding Dress Ver.","굿스마일컴퍼니","소드 아트 온라인","아스나","스케일","1/7","약 230mm","PVC, ABS","2023-05-01",158000,false,false,"아름다운 웨딩 드레스를 입은 아스나 피규어입니다.","PVC로 제작된 고퀄리티 피규어입니다.","호시노 카츠미, 타나카 마사토","타카하시 마사키"
"렘 바니걸 Ver.","レム バニーガールVer.","Rem Bunny Girl Ver.","프리잉","Re:제로부터 시작하는 이세계 생활","렘","스케일","1/4","약 250mm","PVC","2023-06-01",240000,true,false,"바니걸 의상을 입은 렘 피규어입니다.","프리잉의 대표적인 바니걸 시리즈입니다.","미야자와 켄지","스즈키 유지"`;

// JSON 템플릿 다운로드를 위한 샘플 데이터
const JSON_TEMPLATE = [
  {
    name: "아스나 웨딩 드레스 Ver.",
    nameJp: "アスナ ウェディングドレスVer.",
    nameEn: "Asuna Wedding Dress Ver.",
    manufacturer: "굿스마일컴퍼니",
    series: "소드 아트 온라인",
    character: "아스나",
    category: "스케일",
    scale: "1/7",
    size: "약 230mm",
    material: "PVC, ABS",
    releaseDate: "2023-05-01",
    price: 158000,
    limited: false,
    adult: false,
    description: "아름다운 웨딩 드레스를 입은 아스나 피규어입니다.",
    specifications: "PVC로 제작된 고퀄리티 피규어입니다.",
    sculptors: ["호시노 카츠미", "타나카 마사토"],
    paintWork: ["타카하시 마사키"],
  },
  {
    name: "렘 바니걸 Ver.",
    nameJp: "レム バニーガールVer.",
    nameEn: "Rem Bunny Girl Ver.",
    manufacturer: "프리잉",
    series: "Re:제로부터 시작하는 이세계 생활",
    character: "렘",
    category: "스케일",
    scale: "1/4",
    size: "약 250mm",
    material: "PVC",
    releaseDate: "2023-06-01",
    price: 240000,
    limited: true,
    adult: false,
    description: "바니걸 의상을 입은 렘 피규어입니다.",
    specifications: "프리잉의 대표적인 바니걸 시리즈입니다.",
    sculptors: ["미야자와 켄지"],
    paintWork: ["스즈키 유지"],
  },
];

// 필수 필드 목록
const REQUIRED_FIELDS = [
  "name",
  "manufacturer",
  "series",
  "character",
  "category",
  "releaseDate",
  "price",
];

// 피규어 데이터 타입
interface FigureData {
  name: string;
  nameJp?: string;
  nameEn?: string;
  manufacturer: string;
  series: string;
  character: string;
  category: string;
  scale?: string;
  size?: string;
  material?: string;
  releaseDate: string;
  price: number;
  limited?: boolean;
  adult?: boolean;
  description?: string;
  specifications?: string;
  sculptors?: string[];
  paintWork?: string[];
  images?: string[];
  thumbnailIndex?: number;
  [key: string]: any;
}

// 검증 결과 타입
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export function ArchiveFigureAddBulk() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("csv");
  const [csvData, setCsvData] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [parsedData, setParsedData] = useState<FigureData[]>([]);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [processedItems, setProcessedItems] = useState(0);
  const [successItems, setSuccessItems] = useState(0);
  const [failedItems, setFailedItems] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (activeTab === "csv") {
        setCsvData(content);
      } else {
        setJsonData(content);
      }
    };

    if (activeTab === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // CSV 데이터 파싱
  const parseCSV = (csv: string): FigureData[] => {
    const lines = csv.split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/^"|"$/g, ""));

    const result: FigureData[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      // CSV 파싱 (따옴표 내 쉼표 처리)
      const values: string[] = [];
      let currentValue = "";
      let inQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.replace(/^"|"$/g, ""));
          currentValue = "";
        } else {
          currentValue += char;
        }
      }

      values.push(currentValue.replace(/^"|"$/g, ""));

      const item: Record<string, any> = {};

      headers.forEach((header, index) => {
        if (index < values.length) {
          let value = values[index].trim();

          // 불리언 값 처리
          if (value.toLowerCase() === "true") value = "true";
          else if (value.toLowerCase() === "false") value = "false";

          // 배열 값 처리 (sculptors, paintWork)
          if (header === "sculptors" || header === "paintWork") {
            item[header] = value ? value.split(",").map((v) => v.trim()) : [];
          }
          // 숫자 값 처리
          else if (header === "price") {
            item[header] = value ? Number.parseInt(value, 10) : 0;
          }
          // 불리언 값 처리
          else if (header === "limited" || header === "adult") {
            item[header] = value === "true";
          }
          // 문자열 값 처리
          else {
            item[header] = value;
          }
        }
      });

      result.push(item as FigureData);
    }

    return result;
  };

  // JSON 데이터 파싱
  const parseJSON = (json: string): FigureData[] => {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
      return [];
    }
  };

  // 데이터 검증
  const validateData = (data: FigureData[]): ValidationResult => {
    const result: ValidationResult = {
      isValid: true,
      errors: {},
    };

    data.forEach((item, index) => {
      const itemErrors: string[] = [];

      // 필수 필드 검증
      REQUIRED_FIELDS.forEach((field) => {
        if (!item[field]) {
          itemErrors.push(`${field} 필드가 누락되었습니다.`);
          result.isValid = false;
        }
      });

      // 가격 검증
      if (isNaN(item.price) || item.price < 0) {
        itemErrors.push("가격은 0 이상의 숫자여야 합니다.");
        result.isValid = false;
      }

      // 날짜 형식 검증
      if (item.releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(item.releaseDate)) {
        itemErrors.push("출시일은 YYYY-MM-DD 형식이어야 합니다.");
        result.isValid = false;
      }

      if (itemErrors.length > 0) {
        result.errors[index] = itemErrors;
      }
    });

    return result;
  };

  // 데이터 미리보기 및 검증
  const handlePreview = () => {
    let data: FigureData[] = [];

    if (activeTab === "csv" && csvData) {
      data = parseCSV(csvData);
    } else if (activeTab === "json" && jsonData) {
      data = parseJSON(jsonData);
    }

    if (data.length === 0) {
      // toast({
      //   title: "데이터 없음",
      //   description:
      //     "파싱할 데이터가 없습니다. 파일을 업로드하거나 데이터를 입력해주세요.",
      //   variant: "destructive",
      // });
      return;
    }

    setParsedData(data);
    const validation = validateData(data);
    setValidationResult(validation);
    setShowPreview(true);
  };

  // 일괄 등록 처리
  const handleBulkUpload = async () => {
    if (!parsedData.length) {
      // toast({
      //   title: "데이터 없음",
      //   description: "등록할 데이터가 없습니다.",
      //   variant: "destructive",
      // });
      return;
    }

    if (validationResult && !validationResult.isValid) {
      // toast({
      //   title: "유효하지 않은 데이터",
      //   description: "데이터에 오류가 있습니다. 수정 후 다시 시도해주세요.",
      //   variant: "destructive",
      // });
      return;
    }

    setIsSubmitting(true);
    setProgress(0);
    setTotalItems(parsedData.length);
    setProcessedItems(0);
    setSuccessItems(0);
    setFailedItems(0);

    for (let i = 0; i < parsedData.length; i++) {
      try {
        // 이미지가 없는 경우 기본 이미지 설정
        if (!parsedData[i].images || parsedData[i].images?.length === 0) {
          parsedData[i].images = ["/placeholder.svg?height=400&width=300"];
        }

        // 썸네일 인덱스가 없는 경우 0으로 설정
        if (parsedData[i].thumbnailIndex === undefined) {
          parsedData[i].thumbnailIndex = 0;
        }

        // 데이터 등록
        // await addDatabaseFigure(parsedData[i]);
        setSuccessItems((prev) => prev + 1);
      } catch (error) {
        console.error(`피규어 #${i + 1} 등록 오류:`, error);
        setFailedItems((prev) => prev + 1);
      } finally {
        setProcessedItems((prev) => prev + 1);
        setProgress(((i + 1) / parsedData.length) * 100);
      }
    }

    // toast({
    //   title: "일괄 등록 완료",
    //   description: `총 ${parsedData.length}개 중 ${successItems}개 성공, ${failedItems}개 실패`,
    //   variant: successItems === parsedData.length ? "default" : "destructive",
    // });

    setIsSubmitting(false);
  };

  // CSV 템플릿 다운로드
  const downloadCSVTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "figure_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON 템플릿 다운로드
  const downloadJSONTemplate = () => {
    const blob = new Blob([JSON.stringify(JSON_TEMPLATE, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "figure_template.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
            피규어 일괄 등록
          </CardTitle>
          <CardDescription>
            CSV 또는 JSON 형식으로 여러 피규어를 한 번에 등록할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="csv"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv">CSV 형식</TabsTrigger>
              <TabsTrigger value="json">JSON 형식</TabsTrigger>
            </TabsList>
            <TabsContent value="csv" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCSVTemplate}
                  className="flex items-center"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  CSV 템플릿 다운로드
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="csv-data">CSV 데이터</Label>
                <Textarea
                  id="csv-data"
                  placeholder="CSV 데이터를 입력하거나 파일을 업로드하세요."
                  className="min-h-[200px] font-mono text-sm"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="json" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadJSONTemplate}
                  className="flex items-center"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  JSON 템플릿 다운로드
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="json-data">JSON 데이터</Label>
                <Textarea
                  id="json-data"
                  placeholder="JSON 데이터를 입력하거나 파일을 업로드하세요."
                  className="min-h-[200px] font-mono text-sm"
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSelectFile}
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                파일 업로드
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={activeTab === "csv" ? ".csv" : ".json"}
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex items-center"
              >
                <Copy className="mr-2 h-4 w-4" />
                데이터 미리보기
              </Button>
            </div>
          </div>

          {showPreview && parsedData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">데이터 미리보기</h3>
                <Badge
                  variant={
                    validationResult?.isValid ? "default" : "destructive"
                  }
                >
                  {validationResult?.isValid ? "유효함" : "오류 있음"}
                </Badge>
              </div>

              {!validationResult?.isValid && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>유효성 검사 오류</AlertTitle>
                  <AlertDescription>
                    데이터에 오류가 있습니다. 아래 표에서 오류 내용을
                    확인하세요.
                  </AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border overflow-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>제조사</TableHead>
                      <TableHead>작품</TableHead>
                      <TableHead>캐릭터</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>출시일</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead className="w-[100px]">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((item, index) => (
                      <TableRow
                        key={index}
                        className={
                          validationResult?.errors[index]
                            ? "bg-red-50 dark:bg-red-950/20"
                            : ""
                        }
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name || "-"}</TableCell>
                        <TableCell>{item.manufacturer || "-"}</TableCell>
                        <TableCell>{item.series || "-"}</TableCell>
                        <TableCell>{item.character || "-"}</TableCell>
                        <TableCell>{item.category || "-"}</TableCell>
                        <TableCell>
                          {item.releaseDate
                            ? format(new Date(item.releaseDate), "yyyy-MM-dd", {
                                locale: ko,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {item.price
                            ? `${item.price.toLocaleString()}원`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {validationResult?.errors[index] ? (
                            <div className="flex items-center">
                              <Badge
                                variant="destructive"
                                className="flex items-center gap-1"
                              >
                                <X className="h-3 w-3" />
                                오류
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-1"
                                  >
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <ul className="list-disc pl-4 text-xs">
                                    {validationResult.errors[index].map(
                                      (error, i) => (
                                        <li key={i}>{error}</li>
                                      )
                                    )}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              유효함
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      진행 중... ({processedItems}/{totalItems})
                    </span>
                    <span className="text-sm">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>성공: {successItems}</span>
                    <span>실패: {failedItems}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/database")}>
            취소
          </Button>
          <Button
            onClick={handleBulkUpload}
            disabled={
              !parsedData.length ||
              (validationResult && !validationResult.isValid) ||
              isSubmitting
            }
            className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                일괄 등록 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                일괄 등록
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
