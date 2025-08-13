import { useState, useEffect } from "react";
import { classifyImage } from "../lib/vision";

export default function Insurance() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // classification-related state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // revoke object URL when file changes/unmounts
  useEffect(() => {
    return function cleanup() {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onSelect(e) {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null); // clear previous result when a new file is chosen

    if (!file) return;

    // basic guardrails
    const isImage = /^image\//.test(file.type);
    const maxMB = 5;
    if (!isImage) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Image too large (>${maxMB}MB).`);
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
    setResult(null);
    setLoading(false);
  }

  async function onClassify() {
    // guard: require a file
    if (!file) {
      setError("Please choose an image before classifying.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // call Azure Custom Vision
      const r = await classifyImage(file);
      setResult(r); // { label, score, raw }
    } catch (err) {
      // user-friendly error
      const msg = err?.message || "Classification failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
            <>
              <button
                className="btn btn-action"
                onClick={onClassify}
                disabled={loading}
              >
                {loading ? "Analyzing…" : "Classify"}
              </button>
              <button className="btn btn-reset" onClick={onReset}>
                Reset
              </button>
            </>
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

      {/* Right: Coverage & Result */}
      <div className="panel">
        <h2>Coverage & Result</h2>

        {/* Result block appears only when we have a classification */}
        {result ? (
          <div className="result-card">
            <p className="result-line">
              <span className="result-label">Type:</span>{" "}
              <strong>{result.label}</strong>
            </p>
            <p className="result-line">
              <span className="result-label">Confidence:</span>{" "}
              <strong>{(result.score * 100).toFixed(1)}%</strong>
            </p>
          </div>
        ) : (
          <p className="result-placeholder">
            Coverage tabs, classification, and premium placeholder will appear
            here.
          </p>
        )}
      </div>
    </section>
  );
}
