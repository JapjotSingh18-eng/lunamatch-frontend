import { useCallback, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import UploadPanel from "./components/UploadPanel.jsx";
import AnalysisLoader from "./components/AnalysisLoader.jsx";
import ResultsDashboard from "./components/ResultsDashboard.jsx";

// Use Vercel environment variable.
// Falls back to your deployed Render backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://lunamatchai-2.onrender.com/api/match";

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("");

  const handleImage1Change = useCallback((file) => {
    setImage1(file);
    setError("");
    setResult(null);
  }, []);

  const handleImage2Change = useCallback((file) => {
    setImage2(file);
    setError("");
    setResult(null);
  }, []);

  const startAnalysis = async () => {
    if (isAnalyzing) return;

    if (!image1 || !image2) {
      setError(
        "Please upload both lunar images before starting the analysis."
      );
      return;
    }

    setError("");
    setResult(null);
    setBackendStatus("Connecting to LunaMatch AI backend...");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();

      formData.append("image1", image1);
      formData.append("image2", image2);

      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 120000);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      setBackendStatus("Processing lunar image correspondence...");

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text ||
            `Invalid response received from the backend. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            data?.error ||
            `Image analysis failed with status ${response.status}.`
        );
      }

      if (!data) {
        throw new Error(
          "No analysis data was returned from the LunaMatch AI backend."
        );
      }

      setBackendStatus("Analysis completed successfully.");

      setResult(data);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
    } catch (err) {
      console.error("LunaMatch Analysis Error:", err);

      if (err.name === "AbortError") {
        setError(
          "The analysis request took too long. The Render server may be waking up or processing the images. Please try again."
        );
      } else if (
        err.name === "TypeError" ||
        err.message === "Failed to fetch"
      ) {
        setError(
          "Unable to connect to the LunaMatch AI backend. The Render server may be waking up or the backend may have a CORS configuration issue. Please wait 30–60 seconds and try again."
        );
      } else {
        setError(
          err.message ||
            "Unable to complete the lunar image analysis."
        );
      }
    } finally {
      setIsAnalyzing(false);

      setTimeout(() => {
        setBackendStatus("");
      }, 3000);
    }
  };

  const canAnalyze =
    Boolean(image1 && image2) && !isAnalyzing;

  return (
    <div className="app">
      <div className="stars" />
      <div className="stars stars-2" />
      <div className="stars stars-3" />

      <Navbar />

      <main>
        <Hero />

        <section
          id="analyze"
          className="upload-section"
        >
          <div className="section-heading">
            <span className="section-tag">
              LUNAR INPUT
            </span>

            <h2>
              Analyze Image Correspondence
            </h2>

            <p>
              Upload two lunar surface images and let LunaMatch
              AI analyze feature correspondence, geometric
              reliability, overlap quality, test conditions,
              and image registration.
            </p>
          </div>

          <div className="upload-grid">
            <UploadPanel
              label="IMAGE 01"
              number="01"
              image={image1}
              setImage={handleImage1Change}
            />

            <div
              className="connection-orb"
              aria-hidden="true"
            >
              <span>⇄</span>
            </div>

            <UploadPanel
              label="IMAGE 02"
              number="02"
              image={image2}
              setImage={handleImage2Change}
            />
          </div>

          <div
            className="upload-status"
            aria-live="polite"
          >
            <div className="upload-status-item">
              <span
                className={`status-dot ${
                  image1 ? "active" : ""
                }`}
              />

              <span>
                {image1
                  ? `IMAGE 01 READY: ${image1.name}`
                  : "WAITING FOR IMAGE 01"}
              </span>
            </div>

            <div className="upload-status-item">
              <span
                className={`status-dot ${
                  image2 ? "active" : ""
                }`}
              />

              <span>
                {image2
                  ? `IMAGE 02 READY: ${image2.name}`
                  : "WAITING FOR IMAGE 02"}
              </span>
            </div>
          </div>

          {backendStatus && (
            <div
              className="backend-status"
              aria-live="polite"
            >
              <span className="backend-status-dot" />

              {backendStatus}
            </div>
          )}

          {error && (
            <div
              className="error-message"
              role="alert"
            >
              <span>⚠</span>

              <div>
                <strong>Connection or Analysis Error</strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            className="analyze-button"
            onClick={startAnalysis}
            disabled={!canAnalyze}
          >
            {isAnalyzing ? (
              <>
                <span className="button-loader" />
                ANALYZING IMAGES...
              </>
            ) : !image1 || !image2 ? (
              "UPLOAD BOTH IMAGES"
            ) : (
              <>
                START AI ANALYSIS
                <span className="button-arrow">→</span>
              </>
            )}
          </button>

          {!image1 || !image2 ? (
            <p className="analysis-hint">
              Upload both lunar images to unlock AI analysis.
            </p>
          ) : (
            <p className="analysis-hint ready">
              ✓ Both images are ready for analysis.
            </p>
          )}
        </section>

        {isAnalyzing && (
          <section
            className="analysis-section"
            aria-live="polite"
          >
            <AnalysisLoader />
          </section>
        )}

        {result && !isAnalyzing && (
          <section
            id="results"
            className="results-section"
          >
            <ResultsDashboard result={result} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;