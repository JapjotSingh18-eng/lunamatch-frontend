import { useCallback, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import UploadPanel from "./components/UploadPanel.jsx";
import AnalysisLoader from "./components/AnalysisLoader.jsx";
import ResultsDashboard from "./components/ResultsDashboard.jsx";

const API_URL = "https://lunamatchai-2.onrender.com/api/match";

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

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
      setError("Please upload both lunar images before starting the analysis.");
      return;
    }

    setError("");
    setResult(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();

      formData.append("image1", image1);
      formData.append("image2", image2);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text ||
            "The server returned an invalid response. Please check the FastAPI backend."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            data?.error ||
            "Image analysis failed."
        );
      }

      if (!data) {
        throw new Error(
          "No analysis data was returned from the server."
        );
      }

      setResult(data);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);

    } catch (err) {
      console.error("Analysis Error:", err);

      if (
        err.name === "TypeError" ||
        err.message === "Failed to fetch"
      ) {
        setError(
          "Unable to connect to the backend. Make sure FastAPI is running at http://127.0.0.1:8000."
        );
      } else {
        setError(
          err.message ||
            "Unable to complete the image analysis."
        );
      }
    } finally {
      setIsAnalyzing(false);
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
              Upload two lunar surface images and let
              LunaMatch AI analyze feature correspondence,
              geometric reliability, overlap quality, and
              image registration.
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

          {error && (
            <div
              className="error-message"
              role="alert"
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="button"
            className="analyze-button"
            onClick={startAnalysis}
            disabled={!canAnalyze}
          >
            {isAnalyzing
              ? "ANALYZING IMAGES..."
              : !image1 || !image2
              ? "UPLOAD BOTH IMAGES"
              : "START AI ANALYSIS"}
          </button>
        </section>

        {isAnalyzing && <AnalysisLoader />}

        {result && !isAnalyzing && (
          <ResultsDashboard result={result} />
        )}
      </main>
    </div>
  );
}

export default App;