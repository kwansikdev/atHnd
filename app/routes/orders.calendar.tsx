import { Calendar } from "lucide-react";

export default function OrdersCalendar() {
  return (
    <div className="space-y-6 mt-6 animate-in fade-in-50 duration-500">
      <div className="text-center py-16">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
          <Calendar className="h-16 w-16 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
          발매 일정이 없습니다
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto text-lg">
          예약한 피규어가 없어서 발매 일정을 표시할 수 없습니다. 피규어를
          예약하면 발매 일정을 한눈에 확인할 수 있습니다.
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AddOrderDialog onAddOrder={handleAddOrder} />
          <Button
            variant="outline"
            size="lg"
            className="bg-white/50 dark:bg-slate-800/50"
          >
            <Clock className="h-5 w-5 mr-2" />
            이번 달 신작 보기
          </Button>
        </div> */}
      </div>
    </div>
  );
}
