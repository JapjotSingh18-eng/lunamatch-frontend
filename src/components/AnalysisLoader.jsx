// AnalysisLoader.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

const steps = [
  "Initializing AI vision system",
  "Applying CLAHE preprocessing",
  "Detecting SIFT keypoints",
  "Matching lunar features",
  "Running RANSAC verification",
  "Evaluating geometric reliability",
  "Generating analysis results",
];

function AnalysisLoader() {
  const loaderRef = useRef(null);

  const [activeStep, setActiveStep] =
    useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".analysis-loader", {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.to(".scanner-line", {
        top: "100%",
        duration: 2,
        repeat: -1,
        ease: "none",
      });
    }, loaderRef);

    const interval = setInterval(() => {
      setActiveStep((previous) =>
        previous < steps.length - 1
          ? previous + 1
          : previous
      );
    }, 550);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="analysis-loader"
      ref={loaderRef}
      aria-live="polite"
    >
      <div className="scanner">
        <div className="scanner-grid" />

        <div className="scanner-line" />

        <div className="scanner-core">
          AI
        </div>
      </div>

      <div className="analysis-info">
        <span className="section-tag">
          PROCESSING
        </span>

        <h2>
          LunaMatch AI is analyzing
          your lunar images
        </h2>

        <div className="analysis-steps">
          {steps.map((step, index) => (
            <div
              className={`analysis-step ${
                index <= activeStep
                  ? "active"
                  : ""
              }`}
              key={step}
            >
              {index < activeStep ? (
                <CheckCircle2 size={18} />
              ) : index === activeStep ? (
                <LoaderCircle
                  size={18}
                  className="spin"
                />
              ) : (
                <span className="step-dot" />
              )}

              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnalysisLoader;