import React, { useEffect } from "react";

interface DragDropFileProps {
  handleUpload: (file: File) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const DragDropFile = ({
  handleUpload,
  isDragging,
  setIsDragging,
}: DragDropFileProps) => {
  useEffect(() => {
    // Prevent default behaviours
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Handle file drag over document
    const handleDragEnter = (e: DragEvent) => {
      preventDefaults(e);
      setIsDragging(true);
    };

    // Handle file drag outside of document
    const handleDragLeave = (e: DragEvent) => {
      preventDefaults(e);

      // Reset dragging state if navigating outside window
      if (
        e.relatedTarget === null ||
        (e.relatedTarget as HTMLElement)?.closest(".drag-drop-overlay") === null
      ) {
        setIsDragging(false);
      }
    };

    // Handle file drag over document
    const handleDragOver = (e: DragEvent) => {
      preventDefaults(e);
    };

    // Handler file drop
    const handleDrop = (e: DragEvent) => {
      preventDefaults(e);
      setIsDragging(false);

      // Upload file
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files[0]);
      }
    };

    // Add window event listeners
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [setIsDragging, handleUpload]);

  // Handle clicks to dismiss drop
  const handleOverlayClick = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`drag-drop-overlay ${isDragging ? "visible" : "hidden"}`}
      onClick={handleOverlayClick}
    >
      {isDragging && (
        <div className="drop-content" onClick={(e) => e.stopPropagation()}>
          <div className="drop-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
            </svg>
          </div>
          <p className="drop-message">Drop files here to upload</p>
        </div>
      )}
    </div>
  );
};

export default DragDropFile;
