const STATUS_STAGE = ["deposit", "balance", "ordered", "delivered"] as const;

const STATUS_DATE_STAGE = [
  "deposit_paid_at",
  "balance_paid_at",
  "paid_at",
  "delivered_at",
] as const;

// const STATUS_TIMELINE: Record<string, string> = {
//   deposit: "예약금 납부",
//   balance: "잔금 납부",
//   ordered: "결제",
//   delivered: "배송 완료",
// };
const STATUS_TIMELINE: string[] = [
  "예약금 납부",
  "잔금 납부",
  "결제",
  "배송 완료",
];

export { STATUS_STAGE, STATUS_DATE_STAGE, STATUS_TIMELINE };
