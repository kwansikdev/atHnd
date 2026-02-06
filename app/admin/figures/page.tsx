import { Suspense } from "react"
import AdminFiguresClient from "./client"

export default function AdminFiguresPage() {
  return (
    <Suspense fallback={null}>
      <AdminFiguresClient />
    </Suspense>
  )
}
