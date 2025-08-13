import { useState, useEffect } from "react";

export default function Insurance() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // revoke object URL when file changes/unmounts
  useEffect(() => {
    // Cleanup runs when previewUrl changes or component unmounts
    return function cleanup() {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onSelect(e) {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // basic guardrails
    const isImage = /^image\//.test(file.type);
    const maxMB = 5;
    if (!isImage) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Image is too large (>${maxMB}MB).`);
      return;
    }

    // update state
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function onReset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  return (
    <section className="grid-2">
      {/* Left: Upload & Preview */}
      <div className="panel">
        <h2>Upload Vehicle</h2>
        <p>
          Select a photo of the vehicle. A preview will appear before analysis.
        </p>

        <div className="upload-controls">
          <label htmlFor="car-image" className="btn">
            Choose image
          </label>
          <input
            id="car-image"
            type="file"
            accept="image/*"
            onChange={onSelect}
          />
          {file && (
            <button className="btn btn-reset" onClick={onReset}>
              Reset
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        {previewUrl && (
          <div className="preview-wrap">
            <img
              className="preview-img"
              src={previewUrl}
              alt="Selected vehicle preview"
            />
            <p className="preview-meta">
              <small>
                {file?.name} — {(file.size / 1024).toFixed(0)} KB
              </small>
            </p>
          </div>
        )}
      </div>

      {/* Right: placeholder for coverage/result */}
      <div className="panel">
        <h2>Coverage & Result</h2>
        <p>
          Coverage tabs, classification, and premium placeholder will appear
          here.
        </p>
      </div>
    </section>
  );
}
