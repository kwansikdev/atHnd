"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Search, Film, Users, Factory, Tag, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type MasterDataItem = {
  id: string
  value: string
  label: string
  parentId?: string
}

type MasterDataType = "series" | "character" | "manufacturer" | "category" | "scale"

const initialData: Record<MasterDataType, MasterDataItem[]> = {
  series: [
    { id: "1", value: "fate-series", label: "Fate Series" },
    { id: "2", value: "vocaloid", label: "Vocaloid" },
    { id: "3", value: "re-zero", label: "Re:Zero" },
    { id: "4", value: "spy-x-family", label: "Spy x Family" },
    { id: "5", value: "genshin-impact", label: "Genshin Impact" },
    { id: "6", value: "blue-archive", label: "Blue Archive" },
  ],
  character: [
    { id: "1", value: "saber", label: "Saber (Artoria)", parentId: "1" },
    { id: "2", value: "rin-tohsaka", label: "Rin Tohsaka", parentId: "1" },
    { id: "3", value: "hatsune-miku", label: "Hatsune Miku", parentId: "2" },
    { id: "4", value: "rem", label: "Rem", parentId: "3" },
    { id: "5", value: "emilia", label: "Emilia", parentId: "3" },
    { id: "6", value: "yor-forger", label: "Yor Forger", parentId: "4" },
    { id: "7", value: "anya-forger", label: "Anya Forger", parentId: "4" },
    { id: "8", value: "raiden-shogun", label: "Raiden Shogun", parentId: "5" },
    { id: "9", value: "arona", label: "Arona", parentId: "6" },
  ],
  manufacturer: [
    { id: "1", value: "good-smile", label: "Good Smile Company" },
    { id: "2", value: "alter", label: "Alter" },
    { id: "3", value: "max-factory", label: "Max Factory" },
    { id: "4", value: "kotobukiya", label: "Kotobukiya" },
    { id: "5", value: "freeing", label: "FREEing" },
    { id: "6", value: "myethos", label: "Myethos" },
  ],
  category: [
    { id: "1", value: "scale", label: "Scale Figure" },
    { id: "2", value: "nendoroid", label: "Nendoroid" },
    { id: "3", value: "figma", label: "Figma" },
    { id: "4", value: "pop-up-parade", label: "Pop Up Parade" },
    { id: "5", value: "prize", label: "Prize Figure" },
  ],
  scale: [
    { id: "1", value: "1/4", label: "1/4" },
    { id: "2", value: "1/6", label: "1/6" },
    { id: "3", value: "1/7", label: "1/7" },
    { id: "4", value: "1/8", label: "1/8" },
    { id: "5", value: "1/12", label: "1/12" },
    { id: "6", value: "non-scale", label: "Non-scale" },
  ],
}

const categoryConfig: {
  type: MasterDataType
  label: string
  pluralLabel: string
  icon: React.ReactNode
  hasParent?: boolean
}[] = [
  { type: "series", label: "Series", pluralLabel: "Series", icon: <Film className="size-4" /> },
  {
    type: "character",
    label: "Character",
    pluralLabel: "Characters",
    icon: <Users className="size-4" />,
    hasParent: true,
  },
  { type: "manufacturer", label: "Manufacturer", pluralLabel: "Manufacturers", icon: <Factory className="size-4" /> },
  { type: "category", label: "Category", pluralLabel: "Categories", icon: <Tag className="size-4" /> },
  { type: "scale", label: "Scale", pluralLabel: "Scales", icon: <Ruler className="size-4" /> },
]

export default function AdminMasterDataPage() {
  const [data, setData] = useState(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<MasterDataType>("series")
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ value: "", label: "", parentId: "" })

  const currentConfig = categoryConfig.find((c) => c.type === selectedCategory)!
  const filteredData = data[selectedCategory].filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getParentLabel = (parentId: string | undefined) => {
    if (!parentId) return null
    const parent = data.series.find((s) => s.id === parentId)
    return parent?.label
  }

  const handleLabelChange = (label: string) => {
    const value = label
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
    setFormData({ ...formData, label, value })
  }

  const handleAdd = () => {
    if (!formData.label || !formData.value) return
    const newEntry: MasterDataItem = {
      id: crypto.randomUUID(),
      value: formData.value,
      label: formData.label,
      parentId: formData.parentId || undefined,
    }
    setData((prev) => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], newEntry],
    }))
    setFormData({ value: "", label: "", parentId: "" })
    setIsAddDialogOpen(false)
  }

  const handleEdit = (item: MasterDataItem) => {
    setEditingItem(item)
    setFormData({ value: item.value, label: item.label, parentId: item.parentId || "" })
  }

  const handleSaveEdit = () => {
    if (!editingItem) return
    setData((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              value: formData.value,
              label: formData.label,
              parentId: formData.parentId || undefined,
            }
          : item,
      ),
    }))
    setEditingItem(null)
    setFormData({ value: "", label: "", parentId: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setData((prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter((item) => item.id !== id),
      }))
    }
  }

  const handleCategoryChange = (type: MasterDataType) => {
    setSelectedCategory(type)
    setSearchQuery("")
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 border-r min-h-screen bg-muted/20 p-4">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Link>
            </Button>
            <h2 className="text-lg font-bold px-3">Filter</h2>
          </div>

          <nav className="space-y-1">
            {categoryConfig.map((cat) => (
              <button
                key={cat.type}
                onClick={() => handleCategoryChange(cat.type)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat.type
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {cat.icon}
                <span>{cat.pluralLabel}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{currentConfig.pluralLabel}</h1>
                <Badge variant="secondary" className="text-sm">
                  {filteredData.length}
                </Badge>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${currentConfig.pluralLabel.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredData.length === 0 ? (
                <div className="col-span-2 p-12 text-center text-muted-foreground border rounded-lg">
                  {searchQuery
                    ? `No ${currentConfig.pluralLabel.toLowerCase()} found matching "${searchQuery}"`
                    : `No ${currentConfig.pluralLabel.toLowerCase()} added yet`}
                </div>
              ) : (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{item.label}</h3>
                        {currentConfig.hasParent && item.parentId && (
                          <Badge variant="outline" className="text-xs">
                            {getParentLabel(item.parentId)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">{item.value}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(item)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {currentConfig.label}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Label</label>
              <Input
                placeholder={`e.g. ${currentConfig.type === "series" ? "Fate/stay night" : currentConfig.type === "character" ? "Saber" : "Good Smile Company"}`}
                value={formData.label}
                onChange={(e) => handleLabelChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Value (auto-generated)</label>
              <Input
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
            {currentConfig.hasParent && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Series</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <option value="">Select series...</option>
                  {data.series.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!formData.label || !formData.value}>
              Add {currentConfig.label}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {currentConfig.label}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Label</label>
              <Input value={formData.label} onChange={(e) => handleLabelChange(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Value</label>
              <Input
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
            {currentConfig.hasParent && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Series</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <option value="">Select series...</option>
                  {data.series.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!formData.label || !formData.value}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
