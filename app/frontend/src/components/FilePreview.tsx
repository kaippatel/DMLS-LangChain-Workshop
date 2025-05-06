import React from "react";

interface FilePreviewProps {
  file: File;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  return (
    <div className="file-preview">
      <div className="file-info">
        <strong>{file.name}</strong>
      </div>
    </div>
  );
};

export default FilePreview;
