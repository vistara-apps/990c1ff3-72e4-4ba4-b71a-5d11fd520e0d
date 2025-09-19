'use client';

import { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  variant?: 'receipt';
  onUpload: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

export function FileUpload({ 
  variant = 'receipt', 
  onUpload, 
  currentUrl,
  className 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate file upload - in a real app, you'd upload to your storage service
      const mockUrl = URL.createObjectURL(file);
      setTimeout(() => {
        onUpload(mockUrl);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    onUpload('');
  };

  if (currentUrl) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
          <Image className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700 flex-1">Receipt uploaded</span>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors duration-200',
        dragActive && 'border-primary bg-primary/5',
        isUploading && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="space-y-2">
        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
        <div>
          <p className="text-sm text-gray-600">
            {isUploading ? 'Uploading...' : 'Drop receipt here or click to upload'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
