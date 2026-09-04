import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, Sparkles } from "lucide-react";

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from(".hero-tag", {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(
          ".hero-title .line",
          {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=0.2"
        )
        .from(
          ".hero-description",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".hero-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        );

      gsap.to(".moon-orb", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orbit-ring", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".ring-two", {
        rotation: -360,
        duration: 35,
        repeat: -1,
        ease: "none",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-content">
        <div className="hero-tag">
          <Sparkles size={15} />
          ADVANCED LUNAR INTELLIGENCE
        </div>

        <h1 className="hero-title">
          <span className="line">Explore the</span>
          <span className="line highlight">Moon Through</span>
          <span className="line">Intelligent Vision</span>
        </h1>

        <p className="hero-description">
          LunaMatch AI performs intelligent lunar image correspondence analysis
          using advanced feature detection, geometric verification, and
          reliability evaluation.
        </p>

        <div className="hero-actions">
          <a href="#analyze" className="primary-button">
            START ANALYSIS
            <ArrowDown size={18} />
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="orbit-ring" />
        <div className="orbit-ring ring-two" />

        <div className="moon-orb">
          <div className="moon-surface" />
        </div>

        <div className="data-chip chip-one">AI VISION</div>
        <div className="data-chip chip-two">SIFT MATCHING</div>
        <div className="data-chip chip-three">RANSAC</div>
      </div>
    </section>
  );
}

export default Hero;
