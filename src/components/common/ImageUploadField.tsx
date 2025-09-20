"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const acceptedFileTypes = ["image/jpeg", "image/jpg", "image/webp"];

interface ImageUploadFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  hintText?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  hintText = "JPEG, JPG, or WEBP files are supported.",
}: ImageUploadFieldProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(value || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const newUrls = await Promise.all(
      filesArray.map(async (file) => {
        if (!acceptedFileTypes.includes(file.type)) {
          alert("Only JPEG, JPG, or WEBP files can be uploaded.");
          return null;
        }

        const localUrl = URL.createObjectURL(file);

        const formData = new FormData();
        formData.append("file", file);

        let data = null;
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            data = await res.json();
          }
        } catch (err) {
          console.error("Failed to upload image:", err);
          data = null;
        }

        return data && data.url ? data.url : localUrl;
      })
    );

    const filteredUrls = newUrls.filter((url) => url !== null) as string[];
    const allUrls = [...previewUrls, ...filteredUrls];
    setPreviewUrls(allUrls);
    onChange(allUrls);
  };

  const handleRemoveClick = (idx: number) => {
    const newUrls = previewUrls.filter((_, i) => i !== idx);
    setPreviewUrls(newUrls);
    onChange(newUrls);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors">
        <label
          htmlFor="photoUpload"
          className="flex flex-col items-center cursor-pointer"
        >
          <input
            type="file"
            id="photoUpload"
            data-testid="photoUpload" // 
            accept={acceptedFileTypes.join(",")}
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            multiple
          />
          <button
            type="button"
            className="mb-4 px-4 py-2 bg-slate-200 text-sky-950 rounded shadow hover:bg-slate-300 font-semibold"
            onClick={() => inputRef.current?.click()}
          >
            {previewUrls.length === 0 ? "Upload Photo(s)" : "Add More Photos"}
          </button>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          {hintText} You can upload multiple photos.
        </p>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            {previewUrls.map((url, idx) => (
              <div key={url} className="relative">
                <Image
                  width={100}
                  height={100}
                  src={url}
                  alt={`Selected Photo Preview ${idx + 1}`}
                  className="object-contain w-full h-32 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveClick(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                  tabIndex={-1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
