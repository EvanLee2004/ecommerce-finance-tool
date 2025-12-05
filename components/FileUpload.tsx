import React, { useCallback, useState } from 'react';
    import { Upload, CheckCircle, File as FileIcon } from 'lucide-react';
    
    interface FileUploadProps {
      label: string;
      accept?: string;
      onFileSelect: (file: File) => void;
    }
    
    export const FileUpload: React.FC<FileUploadProps> = ({ label, accept = ".csv,.xlsx", onFileSelect }) => {
      const [fileName, setFileName] = useState<string | null>(null);
      const [isDragging, setIsDragging] = useState(false);
    
      const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      }, []);
    
      const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
      }, []);
    
  const validateFile = (file: File): boolean => {
    // 检查文件大小 (限制 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`文件 "${file.name}" 太大了！请上传小于 50MB 的文件。`);
      return false;
    }

    // 检查文件格式
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(fileExt)) {
      alert(`不支持的文件格式！请上传 CSV 或 Excel 文件。`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);      return (
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all cursor-pointer
              ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400'}
              ${fileName ? 'bg-green-50 border-green-400' : ''}
            `}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept={accept}
              onChange={handleInputChange}
            />
            
            {fileName ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle className="w-8 h-8 mb-2" />
                <span className="text-sm font-semibold truncate max-w-xs">{fileName}</span>
                <span className="text-xs mt-1">文件已就绪</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">点击或拖拽上传文件</span>
                <span className="text-xs mt-1 text-slate-400">{accept}</span>
              </div>
            )}
          </div>
        </div>
      );
    };