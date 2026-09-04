// StatCard.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

function StatCard({
  title,
  value,
  suffix = "",
  subtitle,
  icon,
  delay = 0,
}) {
  const [displayValue, setDisplayValue] =
    useState(0);

  const cardRef = useRef(null);

  useEffect(() => {
    const numericValue =
      Number(value) || 0;

    const counter = {
      value: 0,
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "power3.out",
        }
      );

      gsap.to(counter, {
        value: numericValue,
        duration: 1.5,
        delay: delay + 0.2,
        ease: "power2.out",

        onUpdate: () => {
          setDisplayValue(
            counter.value
          );
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [value, delay]);

  const formattedValue =
    Number.isInteger(Number(value))
      ? Math.round(displayValue)
      : displayValue.toFixed(2);

  return (
    <div
      className="stat-card"
      ref={cardRef}
    >
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">
        <span className="stat-title">
          {title}
        </span>

        <h3>
          {formattedValue}
          <small>{suffix}</small>
        </h3>

        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;