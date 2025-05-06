import React, { useState, useEffect } from "react";
import FilePreview from "./FilePreview";

interface Props {
  files: File[];
}

const FileCycler: React.FC<Props> = ({ files }) => {
  const [index, setIndex] = useState<number>(() =>
    Math.max(files.length - 1, 0)
  );

  useEffect(() => {
    if (files.length === 0) return;
    setIndex(files.length - 1);
  }, [files.length]);

  if (files.length === 0) return null;

  const handleClick = () =>
    setIndex((prev) => (prev - 1 + files.length) % files.length);

  const currentFile = files[index];

  return (
    <button
      type="button"
      className="file-cycler-btn"
      onClick={handleClick}
      data-tip="Click to show the next file"
    >
      <FilePreview file={currentFile} />
    </button>
  );
};

export default FileCycler;
