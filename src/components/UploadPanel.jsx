import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Upload, Image as ImageIcon, X } from "lucide-react";

function UploadPanel({ label, number, image, setImage }) {
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPG, JPEG, PNG, or WEBP images.");
      return;
    }

    setImage(file);

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          scale: 0.96,
        },
        {
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const removeImage = (event) => {
    event.stopPropagation();

    setImage(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`upload-card ${
        isDragging ? "dragging" : ""
      }`}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label={`Upload ${label}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="file-input-hidden"
      />

      <div className="upload-number">
        {number}
      </div>

      {!preview ? (
        <div className="upload-empty">
          <div className="upload-icon">
            <Upload size={30} />
          </div>

          <h3>{label}</h3>

          <p>
            Click or drop lunar image here
          </p>

          <span>
            JPG · PNG · WEBP
          </span>
        </div>
      ) : (
        <div className="image-preview">
          <img
            src={preview}
            alt={`${label} preview`}
          />

          <div className="preview-overlay">
            <ImageIcon size={18} />

            <span>
              {image?.name || "Selected image"}
            </span>
          </div>

          <button
            type="button"
            className="remove-image"
            onClick={removeImage}
            aria-label={`Remove ${label}`}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadPanel;