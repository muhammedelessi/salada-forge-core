import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export function ImageUpload({ onUpload, existingImages = [], maxImages = 5 }: ImageUploadProps) {
  const { t } = useLanguageStore();
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      const url = await uploadImage(file);
      if (url) {
        uploadedUrls.push(url);
        toast.success(t('admin.imageUploaded'));
      } else {
        toast.error(t('admin.uploadError'));
      }
    }

    const newImages = [...images, ...uploadedUrls];
    setImages(newImages);
    onUpload(newImages);
    setUploading(false);
  }, [images, maxImages, onUpload, t]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-2">{t('admin.uploadImages')}</label>
      
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">{t('admin.uploading')}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground">{t('admin.dragDrop')}</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP • Max 5MB • Up to {maxImages} images
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((url, index) => (
            <div key={url} className="relative group aspect-square bg-muted">
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                loading="lazy"
                decoding="async"
                width={200}
                height={200}
                className="w-full h-full object-cover max-w-full"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-2xs bg-primary text-primary-foreground px-1.5 py-0.5 uppercase tracking-wider">
                  Main
                </span>
              )}
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < maxImages && (
            <label className="aspect-square border-2 border-dashed border-border hover:border-primary flex items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                disabled={uploading}
              />
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
