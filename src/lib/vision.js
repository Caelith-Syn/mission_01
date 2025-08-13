//Imports the various Azure Custom Vision settings from environment variables
const PREDICTION_URL = import.meta.env.VITE_CV_PREDICTION_URL;
const PROJECT_ID = import.meta.env.VITE_CV_PROJECT_ID;
const PUBLISHED_NAME = import.meta.env.VITE_CV_PUBLISHED_NAME;
const PREDICTION_KEY = import.meta.env.VITE_CV_PREDICTION_KEY;

// This function grabs the prediction URL from the environment variables.
function getPredictionUrl() {
  // Check if we actually have a URL and it's not just empty spaces
  if (PREDICTION_URL && PREDICTION_URL.trim() !== "") {
    return PREDICTION_URL.trim(); // Remove any extra whitespace
  }
  // This prevents confusing errors later when we try to make the API call
  throw new Error(
    "Missing VITE_CV_PREDICTION_URL. Set it to your Custom Vision prediction endpoint."
  );
}
// This is a function that the other parts of our app will call to classify car images
export async function classifyImage(file) {
  if (!file) throw new Error("No file provided for classification.");

  // This gets our API endpoint and authentication key
  const endpoint = getPredictionUrl();
  const key = PREDICTION_KEY?.trim();
  if (!key) throw new Error("Missing VITE_CV_PREDICTION_KEY.");

  const bytes = await file.arrayBuffer();

  // This sends the image to Azure Custom Vision for classification
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Prediction-Key": key,
    },
    body: bytes,
  });

  // This will check to see if the request was successful or not
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Prediction request failed (${res.status}): ${text || "no response body"}`
    );
  }

  // This converts Azure's response from JSON text to a JavaScript object
  const json = await res.json();

  // From here Azure then returns an array of predictions which is sorted by the highest probability first
  const top = Array.isArray(json?.predictions) ? json.predictions[0] : null;
  if (!top) throw new Error("No predictions returned from service.");

  // Return a cleaned up result with just what we need
  return {
    label: top.tagName, // The car type (e.g., "SUV", "Sedan", "Hatchback")
    score: typeof top.probability === "number" ? top.probability : NaN, // Confidence level (0-1)
    raw: json, // Keep the full response in case we need it later for debugging
  };
}
