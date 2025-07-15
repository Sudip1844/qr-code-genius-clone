
import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { processImage, validateImageFile } from '@/lib/image-utils';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageDataUrl: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageUpload = ({
  onImageUpload,
  onImageRemove,
  currentImage,
  label = "Upload Image",
  maxWidth = 200,
  maxHeight = 200
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const processedImage = await processImage(file, {
        maxWidth,
        maxHeight,
        quality: 0.9,
        format: 'png'
      });
      onImageUpload(processedImage);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload, maxWidth, maxHeight]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label className="block text-slate-700">{label}</Label>
      
      {currentImage ? (
        <div className="relative">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <img 
              src={currentImage} 
              alt="Uploaded" 
              className="max-w-full h-auto max-h-32 mx-auto rounded"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">Processing...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-500">
                <span className="font-medium">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-400">
                PNG, JPG, GIF up to 5MB
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
