import { useState, useEffect } from "react";
import { classifyImage } from "../lib/vision";

// coverage types and copy shown in the UI
const COVERAGE_COPY = {
  comprehensive:
    "Full cover for accidental damage, theft, fire, and third-party liability.",
  fireTheft: "Covers fire and theft, plus third-party liability.",
  thirdParty: "Covers damage you cause to others’ vehicles/property.",
};

// basic mapping from detected type → base monthly premium (placeholder logic only)
function estimatePremium(label) {
  if (!label) return null;
  const key = String(label).toLowerCase();

  // crude buckets to demonstrate flow; adjust as you like
  const table = {
    sedan: 110,
    hatchback: 95,
    coupe: 120,
    suv: 140,
    wagon: 115,
    truck: 160,
    ute: 150,
    van: 135,
  };

  // default if we don't recognize the tag name
  const base = table[key] ?? 125;

  // confidence modifier: ±10% range based on certainty
  // e.g., 0.9 → +9%; 0.5 → +5%
  return base;
}

function formatNZD(amount) {
  return amount == null
    ? "-"
    : new Intl.NumberFormat("en-NZ", {
        style: "currency",
        currency: "NZD",
        maximumFractionDigits: 0,
      }).format(amount);
}

export default function Insurance() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // classification-related state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [coverageType, setCoverageType] = useState("comprehensive");

  // revoke object URL when file changes/unmounts
  useEffect(() => {
    return function cleanup() {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onSelect(event) {
    const file = event.target.files?.[0];
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
      const result = await classifyImage(file);
      setResult(result); // { label, score, raw }
    } catch (error) {
      const msg = error?.message || "Classification failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // derive premium once we have a label
  const premium = estimatePremium(result?.label);

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

        {/* Coverage tabs */}
        <div className="tabs">
          <button
            className={`tab ${
              coverageType === "comprehensive" ? "active" : ""
            }`}
            onClick={() => setCoverageType("comprehensive")}
            type="button"
          >
            Comprehensive
          </button>
          <button
            className={`tab ${coverageType === "fireTheft" ? "active" : ""}`}
            onClick={() => setCoverageType("fireTheft")}
            type="button"
          >
            Fire & Theft
          </button>
          <button
            className={`tab ${coverageType === "thirdParty" ? "active" : ""}`}
            onClick={() => setCoverageType("thirdParty")}
            type="button"
          >
            Third Party
          </button>
        </div>

        <p className="coverage-copy">{COVERAGE_COPY[coverageType]}</p>

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
            <p className="result-line">
              <span className="result-label">Estimated Premium:</span>{" "}
              <strong>{formatNZD(premium)}</strong>
              <small className="muted"> (placeholder)</small>
            </p>
          </div>
        ) : (
          <p className="result-placeholder">
            Classify a vehicle to estimate a placeholder premium.
          </p>
        )}
      </div>
    </section>
  );
}
