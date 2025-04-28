import React from "react";

interface FilePreviewProps {
  file: File;
  isUploading: boolean;
  progress?: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  isUploading,
  progress,
}) => {
  return (
    <div className="file-preview">
      <div className="file-info">
        <strong>{file.name}</strong>
      </div>

      {isUploading && (
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${progress ?? 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
