import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  BrainCircuit,
  Timer,
  Target,
  ShieldCheck,
  AlertTriangle,
  Image,
  CheckCircle2,
  Sparkles,
  Search,
  Layers,
} from "lucide-react";

import StatCard from "./StatCard";
import MetricCard from "./MetricCard";

gsap.registerPlugin(ScrollTrigger);

function ResultsDashboard({ result }) {
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".results-header", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".dashboard-section", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "top 80%",
        },
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  /* =========================
     BACKEND DATA
  ========================= */

  const data = result?.data || {};

  const imageInfo = data.image_information || {};
  const featureMatching = data.feature_matching || {};
  const reliability = data.match_reliability || {};
  const conditions = data.test_conditions || {};
  const evaluation = data.problem_statement_evaluation || {};
  const outputs = data.outputs || {};

  const confidence = Number(reliability.confidence_score ?? 0);
  const score = Number(evaluation.score ?? 0);
  const processingTime = Number(data.processing_time_seconds ?? 0);

  const isReliable = Boolean(reliability.is_reliable);

  /* =========================
     IMAGE URLS
  ========================= */

  const matchedImageUrl = outputs.matched_features_url
    ? outputs.matched_features_url.replace(
        "127.0.0.1",
        window.location.hostname
      )
    : null;

  const alignedImageUrl = outputs.aligned_image_url
    ? outputs.aligned_image_url.replace(
        "127.0.0.1",
        window.location.hostname
      )
    : null;

  /* =========================
     ALIGNMENT ANALYSIS
  ========================= */

  const alignmentReasons = [];

  const goodMatches = Number(
    featureMatching.good_matches ?? 0
  );

  const inlierMatches = Number(
    featureMatching.inlier_matches ?? 0
  );

  const inlierRatio = Number(
    featureMatching.inlier_ratio ?? 0
  );

  const overlapQuality = Number(
    conditions.overlap_quality ?? 0
  );

  const reprojectionError = Number(
    conditions.reprojection_error ?? 0
  );

  const rotationDifference = Number(
    conditions.rotation_difference ?? 0
  );

  const scaleDifference = Number(
    conditions.scale_difference ?? 0
  );

  /*
    Generate detailed reasons
    only when aligned image
    was not generated.
  */

  if (!alignedImageUrl) {
    if (goodMatches < 8) {
      alignmentReasons.push({
        title: "Insufficient Feature Matches",

        message:
          `Only ${goodMatches} reliable feature matches were detected. ` +
          "More matching lunar features are required for stable geometric alignment.",
      });
    }

    if (inlierMatches < 4) {
      alignmentReasons.push({
        title: "Insufficient RANSAC Inliers",

        message:
          `Only ${inlierMatches} geometrically verified matches were found. ` +
          "The transformation requires enough reliable inlier points.",
      });
    }

    if (inlierRatio < 40) {
      alignmentReasons.push({
        title: "Low Geometric Consistency",

        message:
          `The inlier ratio is ${inlierRatio.toFixed(1)}%. ` +
          "A large number of detected feature matches could not be geometrically verified.",
      });
    }

    if (
      overlapQuality > 0 &&
      overlapQuality < 40
    ) {
      alignmentReasons.push({
        title: "Low Image Overlap",

        message:
          `The overlap quality is ${overlapQuality.toFixed(1)}%. ` +
          "The two images may not contain enough common lunar surface area.",
      });
    }

    if (reprojectionError > 5) {
      alignmentReasons.push({
        title: "High Reprojection Error",

        message:
          `The reprojection error is ${reprojectionError.toFixed(2)}. ` +
          "This indicates that the estimated geometric transformation is inaccurate.",
      });
    }

    if (
      Math.abs(rotationDifference) > 45
    ) {
      alignmentReasons.push({
        title: "Large Rotation Difference",

        message:
          `The images differ by approximately ${rotationDifference.toFixed(1)}°. ` +
          "Large rotational differences can reduce feature correspondence reliability.",
      });
    }

    if (
      Math.abs(scaleDifference) > 50
    ) {
      alignmentReasons.push({
        title: "Large Scale Difference",

        message:
          `The image scale differs by approximately ${scaleDifference.toFixed(1)}%. ` +
          "The images may have been captured at significantly different zoom levels.",
      });
    }

    /*
      If no frontend metric crosses
      the thresholds, show backend reason.
    */

    if (alignmentReasons.length === 0) {
      alignmentReasons.push({
        title: "Backend Reliability Threshold Not Met",

        message:
          "The backend determined that the estimated geometric transformation did not meet the required reliability threshold for safe image alignment.",
      });
    }
  }

  return (
    <section
      id="results"
      className="results-dashboard"
      ref={dashboardRef}
    >
      {/* =========================
          RESULTS HEADER
      ========================= */}

      <div className="results-header">
        <div>
          <span className="section-tag">
            ANALYSIS COMPLETE
          </span>

          <h2>
            Lunar Correspondence
            <span> Intelligence Report</span>
          </h2>

          <p>
            Analysis ID:
            <strong>
              {" "}
              {data.analysis_id || "N/A"}
            </strong>
          </p>
        </div>

        <div
          className={`status-pill ${
            isReliable
              ? "success"
              : "warning"
          }`}
        >
          {isReliable ? (
            <CheckCircle2 size={17} />
          ) : (
            <AlertTriangle size={17} />
          )}

          {reliability.confidence_level ||
            "UNKNOWN"}{" "}
          CONFIDENCE
        </div>
      </div>

      {/* =========================
          TOP STATISTICS
      ========================= */}

      <div className="dashboard-section">
        <div className="stats-grid">
          <StatCard
            title="Confidence Score"
            value={confidence}
            suffix="%"
            subtitle={
              reliability.confidence_level ||
              "Unknown"
            }
            delay={0}
            icon={
              <BrainCircuit size={24} />
            }
          />

          <StatCard
            title="Evaluation Score"
            value={score}
            suffix="/100"
            subtitle={
              evaluation.performance_level ||
              "Unknown"
            }
            delay={0.1}
            icon={<Target size={24} />}
          />

          <StatCard
            title="Processing Time"
            value={processingTime}
            suffix="s"
            subtitle="AI Processing"
            delay={0.2}
            icon={<Timer size={24} />}
          />
        </div>
      </div>

      {/* =========================
          FEATURE VISUALIZATION
      ========================= */}

      <div className="dashboard-section visualization-section">
        <div className="panel-header">
          <div>
            <span className="section-tag">
              FEATURE VISUALIZATION
            </span>

            <h3>
              Matched Lunar Features
            </h3>
          </div>

          <Search size={24} />
        </div>

        {matchedImageUrl ? (
          <div className="matched-image-container">
            <img
              src={matchedImageUrl}
              alt="Matched Lunar Features"
              className="matched-image"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        ) : (
          <div className="no-result">
            <Image size={40} />

            <p>
              Feature visualization was not generated.
            </p>
          </div>
        )}
      </div>

      {/* =========================
          GEOMETRIC ALIGNMENT
      ========================= */}

      <div className="dashboard-section visualization-section">
        <div className="panel-header">
          <div>
            <span className="section-tag">
              GEOMETRIC REGISTRATION
            </span>

            <h3>
              Aligned Lunar Image
            </h3>
          </div>

          <Layers size={24} />
        </div>

        {alignedImageUrl ? (
          <div className="matched-image-container">
            <img
              src={alignedImageUrl}
              alt="Aligned Lunar Image"
              className="matched-image"
            />
          </div>
        ) : (
          <div className="alignment-failure-panel">

            {/* FAILURE HEADER */}

            <div className="alignment-warning-header">
              <div className="alignment-warning-icon">
                <AlertTriangle size={30} />
              </div>

              <div>
                <span className="section-tag error-tag">
                  ALIGNMENT BLOCKED
                </span>

                <h4>
                  Geometric Alignment Was Not Generated
                </h4>

                <p>
                  LunaMatch AI detected one or more
                  reliability issues and prevented a
                  potentially inaccurate geometric
                  transformation.
                </p>
              </div>
            </div>

            {/* EXACT REASONS */}

            <div className="alignment-reasons">
              {alignmentReasons.map(
                (reason, index) => (
                  <div
                    className="alignment-reason"
                    key={`${reason.title}-${index}`}
                  >
                    <div className="reason-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <div className="reason-content">
                      <h5>
                        {reason.title}
                      </h5>

                      <p>
                        {reason.message}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* ALIGNMENT METRICS */}

            <div className="alignment-summary">
              <div className="summary-item">
                <span>
                  Good Matches
                </span>

                <strong>
                  {goodMatches}
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Inlier Matches
                </span>

                <strong>
                  {inlierMatches}
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Inlier Ratio
                </span>

                <strong>
                  {inlierRatio.toFixed(1)}%
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Overlap Quality
                </span>

                <strong>
                  {overlapQuality.toFixed(1)}%
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Reprojection Error
                </span>

                <strong>
                  {reprojectionError.toFixed(2)}
                </strong>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* =========================
          FEATURE MATCHING
      ========================= */}

      <div className="dashboard-section two-column">

        <div className="glass-panel">
          <div className="panel-header">
            <div>
              <span className="section-tag">
                CORRESPONDENCE DATA
              </span>

              <h3>
                Feature Matching
              </h3>
            </div>

            <Target size={24} />
          </div>

          <div className="feature-stats">

            <div>
              <span>
                Raw Matches
              </span>

              <strong>
                {featureMatching.raw_matches ??
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Good Matches
              </span>

              <strong>
                {featureMatching.good_matches ??
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Inlier Matches
              </span>

              <strong>
                {featureMatching.inlier_matches ??
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Outlier Matches
              </span>

              <strong>
                {featureMatching.outlier_matches ??
                  "N/A"}
              </strong>
            </div>

            <div className="full-stat">
              <span>
                Inlier Ratio
              </span>

              <strong>
                {featureMatching.inlier_ratio ??
                  0}%
              </strong>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      featureMatching.inlier_ratio ??
                      0
                    }%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* =========================
            MATCH RELIABILITY
        ========================= */}

        <div
          className={`glass-panel reliability-panel ${
            isReliable
              ? "reliable"
              : "unreliable"
          }`}
        >
          <div className="panel-header">
            <div>
              <span className="section-tag">
                AI RELIABILITY
              </span>

              <h3>
                Match Reliability
              </h3>
            </div>

            <ShieldCheck size={24} />
          </div>

          <div className="reliability-score">
            {confidence.toFixed(1)}

            <span>%</span>
          </div>

          <div className="reliability-level">
            {reliability.confidence_level ||
              "UNKNOWN"}
          </div>

          <div className="reliability-bar">
            <div
              style={{
                width: `${Math.min(
                  Math.max(confidence, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <div className="warning-list">
            {reliability.reliability_warnings
              ?.length > 0 ? (
              reliability.reliability_warnings.map(
                (warning, index) => (
                  <div key={index}>
                    <AlertTriangle size={16} />

                    <span>
                      {warning}
                    </span>
                  </div>
                )
              )
            ) : (
              <div>
                <CheckCircle2 size={16} />

                <span>
                  No reliability warnings detected.
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* =========================
          TEST CONDITIONS
      ========================= */}

      <div className="dashboard-section">
        <div className="glass-panel">
          <div className="panel-header">
            <div>
              <span className="section-tag">
                TEST CONDITIONS
              </span>

              <h3>
                Image Analysis Metrics
              </h3>
            </div>

            <Sparkles size={24} />
          </div>

          <div className="metrics-grid">

            <MetricCard
              title="Brightness Difference"
              value={
                conditions.brightness_difference
              }
              suffix="%"
            />

            <MetricCard
              title="Contrast Difference"
              value={
                conditions.contrast_difference
              }
              suffix="%"
            />

            <MetricCard
              title="Scale Factor"
              value={
                conditions.scale_factor
              }
            />

            <MetricCard
              title="Scale Difference"
              value={
                conditions.scale_difference
              }
              suffix="%"
            />

            <MetricCard
              title="Rotation Difference"
              value={
                conditions.rotation_difference
              }
              suffix="°"
            />

            <MetricCard
              title="Overlap Quality"
              value={
                conditions.overlap_quality
              }
              suffix="%"
            />

            <MetricCard
              title="Reprojection Error"
              value={
                conditions.reprojection_error
              }
            />

          </div>
        </div>
      </div>

      {/* =========================
          IMAGE PROPERTIES
      ========================= */}

      <div className="dashboard-section two-column">

        {/* IMAGE 01 */}

        <div className="glass-panel">
          <div className="panel-header">
            <div>
              <span className="section-tag">
                IMAGE 01
              </span>

              <h3>
                Source Properties
              </h3>
            </div>
          </div>

          <div className="image-properties">

            <div>
              <span>
                Resolution
              </span>

              <strong>
                {imageInfo.image1?.width ??
                  "N/A"}
                {" × "}
                {imageInfo.image1?.height ??
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Brightness
              </span>

              <strong>
                {imageInfo.image1?.brightness !==
                undefined
                  ? Number(
                      imageInfo.image1.brightness
                    ).toFixed(2)
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Contrast
              </span>

              <strong>
                {imageInfo.image1?.contrast !==
                undefined
                  ? Number(
                      imageInfo.image1.contrast
                    ).toFixed(2)
                  : "N/A"}
              </strong>
            </div>

          </div>
        </div>

        {/* IMAGE 02 */}

        <div className="glass-panel">
          <div className="panel-header">
            <div>
              <span className="section-tag">
                IMAGE 02
              </span>

              <h3>
                Source Properties
              </h3>
            </div>
          </div>

          <div className="image-properties">

            <div>
              <span>
                Resolution
              </span>

              <strong>
                {imageInfo.image2?.width ??
                  "N/A"}
                {" × "}
                {imageInfo.image2?.height ??
                  "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Brightness
              </span>

              <strong>
                {imageInfo.image2?.brightness !==
                undefined
                  ? Number(
                      imageInfo.image2.brightness
                    ).toFixed(2)
                  : "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Contrast
              </span>

              <strong>
                {imageInfo.image2?.contrast !==
                undefined
                  ? Number(
                      imageInfo.image2.contrast
                    ).toFixed(2)
                  : "N/A"}
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* =========================
          AI RECOMMENDATIONS
      ========================= */}

      <div className="dashboard-section">

        <div className="recommendations-panel">

          <div className="recommendations-header">
            <Sparkles size={25} />

            <div>
              <span className="section-tag">
                AI RECOMMENDATIONS
              </span>

              <h3>
                Improve Analysis Quality
              </h3>
            </div>
          </div>

          <div className="recommendations-list">

            {data.recommendations?.length >
            0 ? (
              data.recommendations.map(
                (recommendation, index) => (
                  <div
                    className="recommendation"
                    key={index}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <p>
                      {recommendation}
                    </p>
                  </div>
                )
              )
            ) : (
              <p>
                No recommendations available.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="analysis-footer">

        <span>
          Analysis ID:

          <strong>
            {" "}
            {data.analysis_id || "N/A"}
          </strong>
        </span>

        <span>
          Request ID:

          <strong>
            {" "}
            {result?.request_id ||
              data.request_id ||
              "N/A"}
          </strong>
        </span>

      </div>

    </section>
  );
}

export default ResultsDashboard;