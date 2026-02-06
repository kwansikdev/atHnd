"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Calendar, Loader2, Trash2, Copy, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { ImageUploader, type ImageItem } from "@/components/image-uploader"
import { SearchableListBox, type ListBoxOption } from "@/components/searchable-list-box"
import { registerFigure, type RegisterFigureInput } from "../actions"

const CATEGORIES = [
  { value: "scale", label: "Scale Figure" },
  { value: "nendoroid", label: "Nendoroid" },
  { value: "figma", label: "Figma" },
  { value: "pop-up-parade", label: "Pop Up Parade" },
  { value: "prize", label: "Prize Figure" },
  { value: "other", label: "Other" },
]

const SCALES = [
  { value: "1_4", label: "1/4" },
  { value: "1_6", label: "1/6" },
  { value: "1_7", label: "1/7" },
  { value: "1_8", label: "1/8" },
  { value: "1_12", label: "1/12" },
  { value: "non-scale", label: "Non-scale" },
]

const MANUFACTURER_OPTIONS: ListBoxOption[] = [
  { value: "good-smile", label: "Good Smile Company" },
  { value: "alter", label: "Alter" },
  { value: "max-factory", label: "Max Factory" },
  { value: "kotobukiya", label: "Kotobukiya" },
  { value: "bandai-spirits", label: "Bandai Spirits" },
  { value: "freeing", label: "FREEing" },
  { value: "phat", label: "Phat Company" },
  { value: "kadokawa", label: "KADOKAWA" },
  { value: "aniplex", label: "Aniplex" },
  { value: "union-creative", label: "Union Creative" },
  { value: "myethos", label: "Myethos" },
  { value: "other", label: "Other" },
]

type FigureFormData = RegisterFigureInput & {
  id: string
  images: ImageItem[]
  character: string
}

const createEmptyFormData = (): FigureFormData => ({
  id: crypto.randomUUID(),
  name: "",
  series: "",
  character: "",
  manufacturer: "",
  category: "scale",
  scale: "1_7",
  price: null,
  releaseDate: "",
  announcementDate: null,
  isRerelease: false,
  originalReleaseDate: null,
  images: [], // Fixed: initialize as empty array
  sourceUrl: null,
})

export default function AdminAddFigurePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{ name: string; success: boolean; error?: string }[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentFigureName, setCurrentFigureName] = useState("")

  const [forms, setForms] = useState<FigureFormData[]>([createEmptyFormData()])

  const [recentSeries, setRecentSeries] = useState<string[]>([])
  const [recentCharacters, setRecentCharacters] = useState<string[]>([])
  const [recentManufacturers, setRecentManufacturers] = useState<string[]>([])

  const [seriesOptions, setSeriesOptions] = useState<ListBoxOption[]>([
    { value: "vocaloid", label: "Vocaloid" },
    { value: "fate", label: "Fate Series" },
    { value: "re-zero", label: "Re:Zero" },
    { value: "spy-family", label: "Spy x Family" },
    { value: "demon-slayer", label: "Demon Slayer" },
    { value: "bocchi", label: "Bocchi the Rock!" },
    { value: "frieren", label: "Frieren: Beyond Journey's End" },
    { value: "blue-archive", label: "Blue Archive" },
    { value: "genshin", label: "Genshin Impact" },
    { value: "hololive", label: "Hololive" },
  ])

  const [characterOptions, setCharacterOptions] = useState<ListBoxOption[]>([
    // Vocaloid
    { value: "miku", label: "Hatsune Miku", parentId: "vocaloid" },
    { value: "rin", label: "Kagamine Rin", parentId: "vocaloid" },
    { value: "len", label: "Kagamine Len", parentId: "vocaloid" },
    { value: "luka", label: "Megurine Luka", parentId: "vocaloid" },
    // Fate
    { value: "saber", label: "Saber (Artoria)", parentId: "fate" },
    { value: "rin-tohsaka", label: "Rin Tohsaka", parentId: "fate" },
    { value: "mash", label: "Mash Kyrielight", parentId: "fate" },
    // Re:Zero
    { value: "rem", label: "Rem", parentId: "re-zero" },
    { value: "ram", label: "Ram", parentId: "re-zero" },
    { value: "emilia", label: "Emilia", parentId: "re-zero" },
    // Spy x Family
    { value: "yor", label: "Yor Forger", parentId: "spy-family" },
    { value: "anya", label: "Anya Forger", parentId: "spy-family" },
    // Demon Slayer
    { value: "nezuko", label: "Nezuko Kamado", parentId: "demon-slayer" },
    { value: "shinobu", label: "Shinobu Kocho", parentId: "demon-slayer" },
    // Bocchi
    { value: "bocchi", label: "Hitori Gotoh", parentId: "bocchi" },
    { value: "nijika", label: "Nijika Ijichi", parentId: "bocchi" },
    // Frieren
    { value: "frieren", label: "Frieren", parentId: "frieren" },
    { value: "fern", label: "Fern", parentId: "frieren" },
    // Blue Archive
    { value: "arona", label: "Arona", parentId: "blue-archive" },
    { value: "shiroko", label: "Shiroko", parentId: "blue-archive" },
    // Genshin
    { value: "raiden", label: "Raiden Shogun", parentId: "genshin" },
    { value: "ganyu", label: "Ganyu", parentId: "genshin" },
    // Hololive
    { value: "pekora", label: "Usada Pekora", parentId: "hololive" },
    { value: "marine", label: "Houshou Marine", parentId: "hololive" },
  ])

  const [manufacturerOptions, setManufacturerOptions] = useState<ListBoxOption[]>(MANUFACTURER_OPTIONS)

  const addToRecent = (list: string[], value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!value) return
    const option = [...seriesOptions, ...characterOptions, ...manufacturerOptions].find(
      (opt) => opt.label.toLowerCase() === value.toLowerCase(),
    )
    if (option) {
      setter((prev) => {
        const filtered = prev.filter((v) => v !== option.value)
        return [option.value, ...filtered].slice(0, 5)
      })
    }
  }

  const handleCreateSeries = (name: string) => {
    const newValue = name.toLowerCase().replace(/\s+/g, "-")
    const existingOption = seriesOptions.find((opt) => opt.label.toLowerCase() === name.toLowerCase())
    if (!existingOption) {
      const newOption: ListBoxOption = { value: newValue, label: name }
      setSeriesOptions((prev) => [...prev, newOption])
    }
  }

  const handleCreateCharacter = (name: string, seriesId?: string) => {
    const newValue = name.toLowerCase().replace(/\s+/g, "-")
    const existingOption = characterOptions.find((opt) => opt.label.toLowerCase() === name.toLowerCase())
    if (!existingOption) {
      const newOption: ListBoxOption = { value: newValue, label: name, parentId: seriesId }
      setCharacterOptions((prev) => [...prev, newOption])
    }
  }

  const handleCreateManufacturer = (name: string) => {
    const newValue = name.toLowerCase().replace(/\s+/g, "-")
    const existingOption = manufacturerOptions.find((opt) => opt.label.toLowerCase() === name.toLowerCase())
    if (!existingOption) {
      const newOption: ListBoxOption = { value: newValue, label: name }
      setManufacturerOptions((prev) => [...prev, newOption])
    }
  }

  const getSeriesValueFromLabel = (label: string) => {
    const option = seriesOptions.find((opt) => opt.label.toLowerCase() === label.toLowerCase())
    return option?.value
  }

  const handleChange = (id: string, field: keyof FigureFormData, value: string | number | boolean | null) => {
    setForms((prev) =>
      prev.map((form) => {
        if (form.id === id) {
          if (field === "series") {
            addToRecent(recentSeries, value as string, setRecentSeries)
            return { ...form, [field]: value, character: "" }
          }
          if (field === "character") {
            addToRecent(recentCharacters, value as string, setRecentCharacters)
          }
          if (field === "manufacturer") {
            addToRecent(recentManufacturers, value as string, setRecentManufacturers)
          }
          return { ...form, [field]: value }
        }
        return form
      }),
    )
  }

  const handleImagesChange = (id: string, images: ImageItem[]) => {
    setForms((prev) =>
      prev.map((form) => {
        if (form.id === id) {
          const thumbnail = images.find((img) => img.isThumbnail)
          return {
            ...form,
            images,
            imageUrl: thumbnail?.url || images[0]?.url || "",
          }
        }
        return form
      }),
    )
  }

  const addForm = () => {
    setForms((prev) => [...prev, createEmptyFormData()])
  }

  const removeForm = (id: string) => {
    if (forms.length > 1) {
      setForms((prev) => prev.filter((form) => form.id !== id))
    }
  }

  const duplicateForm = (id: string) => {
    const formToDuplicate = forms.find((form) => form.id === id)
    if (formToDuplicate) {
      const newForm = {
        ...formToDuplicate,
        id: crypto.randomUUID(),
        name: `${formToDuplicate.name} (Copy)`,
        images: formToDuplicate.images.map((img) => ({
          ...img,
          id: crypto.randomUUID(),
        })),
      }
      setForms((prev) => {
        const index = prev.findIndex((form) => form.id === id)
        const newForms = [...prev]
        newForms.splice(index + 1, 0, newForm)
        return newForms
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setResults([])
    setCurrentProgress(0)
    setCurrentFigureName("")

    const submitResults: { name: string; success: boolean; error?: string }[] = []

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i]
      setCurrentFigureName(form.name || `Figure #${i + 1}`)
      setCurrentProgress(Math.round((i / forms.length) * 100))

      const input: RegisterFigureInput = {
        name: form.name,
        series: form.series,
        character: form.character,
        manufacturer: form.manufacturer,
        category: form.category,
        scale: form.scale || null,
        price: form.price,
        releaseDate: form.releaseDate,
        announcementDate: form.announcementDate || null,
        isRerelease: form.isRerelease,
        originalReleaseDate: form.isRerelease ? form.originalReleaseDate || null : null,
        imageUrl: form.imageUrl || null,
        sourceUrl: form.sourceUrl || null,
      }

      const result = await registerFigure(input)
      submitResults.push({
        name: form.name,
        success: result.success,
        error: result.error,
      })
      setResults([...submitResults])
    }

    setCurrentProgress(100)
    setCurrentFigureName("")

    const allSuccess = submitResults.every((r) => r.success)
    if (allSuccess) {
      setForms([createEmptyFormData()])
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-xl border bg-card p-6 shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold">Registering Figures...</h3>
              <p className="text-sm text-muted-foreground">
                {currentFigureName ? `Processing "${currentFigureName}"` : "Preparing..."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {results.length} / {forms.length}
                </span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            {results.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      result.success ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {result.success ? (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Add Figures to Database</h1>
            <p className="text-xs text-muted-foreground">Admin Panel - {forms.length} figure(s)</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addForm}>
            <Plus className="h-4 w-4 mr-1" />
            Add Another
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl px-4 py-8">
        {results.length > 0 && (
          <div className="mb-6 space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`rounded-lg border p-3 text-sm ${
                  result.success
                    ? "bg-green-500/10 border-green-500/20 text-green-600"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                }`}
              >
                {result.success
                  ? `"${result.name}" registered successfully!`
                  : `"${result.name}" failed: ${result.error}`}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {forms.map((formData, formIndex) => (
            <div key={formData.id} className="relative rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-lg font-semibold">Figure #{formIndex + 1}</h2>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateForm(formData.id)}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {forms.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeForm(formData.id)}
                      className="text-destructive hover:text-destructive"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor={`name-${formData.id}`}>Figure Name *</Label>
                  <Input
                    id={`name-${formData.id}`}
                    value={formData.name}
                    onChange={(e) => handleChange(formData.id, "name", e.target.value)}
                    placeholder="Hatsune Miku: Birthday 2024 Ver."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Series *</Label>
                    <SearchableListBox
                      options={seriesOptions}
                      value={formData.series}
                      onChange={(value) => {
                        handleChange(formData.id, "series", value)
                        handleCreateSeries(value)
                      }}
                      onCreateNew={handleCreateSeries}
                      placeholder="Search series..."
                      recentValues={recentSeries}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Character *</Label>
                    <SearchableListBox
                      options={characterOptions}
                      value={formData.character}
                      onChange={(value) => {
                        handleChange(formData.id, "character", value)
                        handleCreateCharacter(value, getSeriesValueFromLabel(formData.series))
                      }}
                      onCreateNew={(name) => handleCreateCharacter(name, getSeriesValueFromLabel(formData.series))}
                      placeholder="Search character..."
                      filterByParentId={getSeriesValueFromLabel(formData.series)}
                      disabled={!formData.series}
                      recentValues={recentCharacters}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Manufacturer *</Label>
                  <SearchableListBox
                    options={manufacturerOptions}
                    value={formData.manufacturer}
                    onChange={(value) => {
                      handleChange(formData.id, "manufacturer", value)
                      handleCreateManufacturer(value)
                    }}
                    onCreateNew={handleCreateManufacturer}
                    placeholder="Search manufacturer..."
                    recentValues={recentManufacturers}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`category-${formData.id}`}>Category *</Label>
                    <select
                      id={`category-${formData.id}`}
                      value={formData.category}
                      onChange={(e) => handleChange(formData.id, "category", e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`scale-${formData.id}`}>Scale</Label>
                    <select
                      id={`scale-${formData.id}`}
                      value={formData.scale || ""}
                      onChange={(e) => handleChange(formData.id, "scale", e.target.value || null)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {SCALES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`price-${formData.id}`}>Price (JPY) *</Label>
                    <Input
                      id={`price-${formData.id}`}
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => handleChange(formData.id, "price", Number(e.target.value))}
                      placeholder="18000"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Release Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`releaseDate-${formData.id}`}>Release Date *</Label>
                    <div className="relative">
                      <Input
                        id={`releaseDate-${formData.id}`}
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => handleChange(formData.id, "releaseDate", e.target.value)}
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`announcementDate-${formData.id}`}>Announcement Date</Label>
                    <div className="relative">
                      <Input
                        id={`announcementDate-${formData.id}`}
                        type="date"
                        value={formData.announcementDate || ""}
                        onChange={(e) => handleChange(formData.id, "announcementDate", e.target.value || null)}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Switch
                    id={`isRerelease-${formData.id}`}
                    checked={formData.isRerelease}
                    onCheckedChange={(checked) => handleChange(formData.id, "isRerelease", checked)}
                  />
                  <Label htmlFor={`isRerelease-${formData.id}`} className="cursor-pointer">
                    This is a re-release
                  </Label>
                </div>

                {formData.isRerelease && (
                  <div className="space-y-2">
                    <Label htmlFor={`originalReleaseDate-${formData.id}`}>Original Release Date</Label>
                    <div className="relative">
                      <Input
                        id={`originalReleaseDate-${formData.id}`}
                        type="date"
                        value={formData.originalReleaseDate || ""}
                        onChange={(e) => handleChange(formData.id, "originalReleaseDate", e.target.value || null)}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Images</h3>
                <ImageUploader
                  images={formData.images}
                  onChange={(images) => handleImagesChange(formData.id, images)}
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Additional Info</h3>
                <div className="space-y-2">
                  <Label htmlFor={`sourceUrl-${formData.id}`}>Source URL</Label>
                  <Input
                    id={`sourceUrl-${formData.id}`}
                    type="url"
                    value={formData.sourceUrl || ""}
                    onChange={(e) => handleChange(formData.id, "sourceUrl", e.target.value || null)}
                    placeholder="https://goodsmile.info/..."
                  />
                </div>
              </section>
            </div>
          ))}

          <div className="sticky bottom-4 flex justify-end gap-3 bg-background/80 backdrop-blur p-4 rounded-lg border">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Register {forms.length} Figure{forms.length > 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
