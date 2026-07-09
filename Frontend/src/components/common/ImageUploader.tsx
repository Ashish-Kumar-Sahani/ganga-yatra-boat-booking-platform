import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  previewUrl?: string | null;
  maxSizeMb?: number;
  className?: string;
}

export default function ImageUploader({
  onFileSelect,
  previewUrl = null,
  maxSizeMb = 5,
  className = "",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSelectFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds limit of ${maxSizeMb}MB.`);
      return;
    }
    onFileSelect(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(null);
    setLocalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10"
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
        }`}
      >
        {localPreview ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl group border dark:border-slate-800">
            <img src={localPreview} alt="Preview" className="h-full w-full object-cover" />
            <button
              onClick={handleClear}
              className="absolute top-1 right-1 rounded-full bg-slate-900/60 p-1 text-white hover:bg-slate-900 hover:scale-105 transition"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 text-slate-400 dark:text-slate-500 mb-3 shadow-sm">
              <Upload size={20} />
            </div>
            <p className="text-xs font-black text-slate-700 dark:text-slate-205">
              Drag & drop or click to upload
            </p>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">
              Supports JPG, PNG or WEBP up to {maxSizeMb}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
