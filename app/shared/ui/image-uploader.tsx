/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Star, GripVertical, Link2, ImageIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BucketName } from "supabase/type";

export type ImageItem = {
  id: string;
  url: string;
  file?: File;
  isThumbnail: boolean;
  sortOrder?: number;
};

type ImageUploaderProps = {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
};

function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: ImageItem[] = Array.from(files).map((file, index) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
        isThumbnail: index === 0,
        // sortOrder: index,
      }));

      // First image becomes thumbnail if no images exist
      if (images.length === 0 && newImages.length > 0) {
        newImages[0].isThumbnail = true;
      }

      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    const newImage: ImageItem = {
      id: crypto.randomUUID(),
      url: urlInput.trim(),
      isThumbnail: false,
    };

    onChange([...images, newImage]);
    setUrlInput("");
  };

  const handleRemove = (id: string) => {
    const removedImage = images.find((img) => img.id === id);
    let newImages = images.filter((img) => img.id !== id);

    // If removed image was thumbnail, set first remaining as thumbnail
    if (removedImage?.isThumbnail && newImages.length > 0) {
      newImages = newImages.map((img) => ({
        ...img,
      }));
    }

    onChange(newImages);
  };

  const handleSetThumbnail = (id: string) => {
    onChange(
      images.map((img) => ({
        ...img,
        isThumbnail: img.id === id,
      }))
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    onChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <Link2 className="h-4 w-4" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports JPG, PNG, WebP
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
            >
              Add
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">
              {images.length} image{images.length > 1 ? "s" : ""} - Drag to
              reorder
            </Label>
            <p className="text-xs text-muted-foreground">
              Click star to set thumbnail
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-lg border-2 overflow-hidden aspect-square transition-all ${
                  image.isThumbnail
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                } ${
                  dragOverIndex === index ? "border-primary/50 scale-105" : ""
                } ${draggedIndex === index ? "opacity-50" : ""}`}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`figure_img_${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/broken-image.png";
                  }}
                />

                {/* Thumbnail Badge */}
                {image.isThumbnail && (
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium">
                    Thumbnail
                  </div>
                )}

                {/* Order Number */}
                <div className="absolute bottom-1 left-1 bg-background/80 text-xs px-1.5 py-0.5 rounded font-medium">
                  #{index + 1}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Drag Handle */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-white" />
                  </div>

                  {/* Set as Thumbnail */}
                  {!image.isThumbnail && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetThumbnail(image.id)}
                      title="Set as thumbnail"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Remove */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemove(image.id)}
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const useImageUploader = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<number, string>>(
    {}
  );

  const uploadImage = async (
    file: File,
    bucket: BucketName,
    figureIndex: number,
    imageIndex: number
  ) => {
    const key = `${figureIndex}-${imageIndex}`;
    setUploadProgress((prev) => ({ ...prev, [key]: "uploading" }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      setUploadProgress((prev) => ({ ...prev, [key]: "done" }));

      return url;
    } catch (error) {
      setUploadProgress((prev) => ({ ...prev, [key]: "failed" }));
      throw error;
    }
  };

  return {
    uploadProgress,
    uploadImage,
    ImageUploader,
  };
};

export default ImageUploader;
