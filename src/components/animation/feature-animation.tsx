"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

// Placeholder for feature screenshots - replace with actual screenshots
const featureScreenshots = [
  "/screenshots/feature-multi-currency.png",
  "/screenshots/safe-transaction.png",
  "/screenshots/customer-service.png",
  "/screenshots/quick-transaction.png",
];

const features = [
  {
    duration: 0,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.7222 11.6667V7.22225C24.7222 5.99495 23.7273 5 22.5 5H4.72222C3.49492 5 2.5 5.99492 2.5 7.22222V22.7778C2.5 24.0051 3.49492 25 4.72222 25H22.5C23.7273 25 24.7222 24.005 24.7222 22.7777V17.7778M20.8333 17.7778H25.2778C26.5051 17.7778 27.5 16.7829 27.5 15.5556V13.8889C27.5 12.6616 26.5051 11.6667 25.2778 11.6667H20.8333C19.606 11.6667 18.6111 12.6616 18.6111 13.8889V15.5556C18.6111 16.7829 19.606 17.7778 20.8333 17.7778Z"
          stroke="#4F46E5"
          strokeWidth="2"
        ></path>
      </svg>
    ),
    title: "Multi currency",
    description:
      "Integrating with <a href='https://currencyapi.com/'>https://currencyapi.com/</a> to get daily rates and adjusted rate of the transaction day",
    screenshot: "feature-multi-currency.png",
  },
  {
    duration: 800,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.375 15.8571C16.1009 15.8571 17.5 14.458 17.5 12.7321C17.5 11.0062 16.1009 9.6071 14.375 9.6071C12.6491 9.6071 11.25 11.0062 11.25 12.7321C11.25 14.458 12.6491 15.8571 14.375 15.8571ZM14.375 15.8571V20.8571M3.75 13.2264V15.2343C3.75 17.6868 3.75 18.9131 4.27747 19.9685C4.80493 21.0239 5.78567 21.76 7.74715 23.2322L8.57248 23.8516C11.4626 26.0208 12.9077 27.1054 14.5753 27.1054C16.243 27.1054 17.688 26.0208 20.5782 23.8516L21.4035 23.2322C23.365 21.76 24.3457 21.0239 24.8732 19.9685C25.4006 18.9131 25.4006 17.6868 25.4006 15.2343V13.2264C25.4006 9.95932 25.4006 8.32576 24.546 7.05852C23.6913 5.79128 22.1768 5.17918 19.1477 3.95499L18.3223 3.62144C16.4724 2.87381 15.5475 2.5 14.5753 2.5C13.6032 2.5 12.6782 2.87381 10.8283 3.62144L10.003 3.95499C6.97389 5.17919 5.45934 5.79128 4.60467 7.05852C3.75 8.32576 3.75 9.95932 3.75 13.2264Z"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    ),
    title: "Import Transaction",
    description:
      "Import from any bank supporting standard file export. Custom File Import can be developed for exotic bank account.",
    screenshot: "feature-import.png",
  },
  {
    duration: 500,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0067 10V15.6652C15.0067 16.0358 15.1712 16.3873 15.4556 16.6248L18.75 19.375M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    ),
    title: "Automatic Spend Categorization",
    description:
      "Spend is categorized based on previous transactions and your custom rules.",
    screenshot: "feature-category.png",
  },
  {
    duration: 400,
    icon: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    ),
    title: "Custom Dashboard",
    description:
      "We provide dashboard and analysis on your spend so you can further analyze where the money comes and goes.",
    screenshot: "feature-dashboard.png",
  },
];

const FeatureAnimation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );
  const [flippedFeatures, setFlippedFeatures] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When the container becomes visible, start staggered animation
            const newVisibleFeatures = [...visibleFeatures];

            features.forEach((feature, index) => {
              setTimeout(() => {
                newVisibleFeatures[index] = true;
                setVisibleFeatures([...newVisibleFeatures]);
              }, index * feature.duration);
            });

            // Stop observing once the animation is triggered
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: [0.5, 1],
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleFlip = (index: number) => {
    console.log("toggle feature:", index);
    const newFlippedFeatures = [...flippedFeatures];
    newFlippedFeatures[index] = !newFlippedFeatures[index];
    setFlippedFeatures(newFlippedFeatures);
  };

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8"
    >
      {features.map((feature, index) => (
        <div
          key={feature.title}
          onClick={() => toggleFlip(index)}
          className={`
            group relative w-full bg-gray-100 rounded-2xl p-4 max-md:max-w-md max-md:mx-auto 
            md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 perspective-1000
            ${
              visibleFeatures[index]
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }
          `}
          >
          {/* This container is needed to position the front and back side */}
          {/* https://www.w3schools.com/howto/howto_css_flip_card.asp */}
          <div className={`
            flip-card-inner 
            ${flippedFeatures[index] ? "flip-card" : ""}
          `}>
            {/* Front Side */}
            <div
              className={`
              absolute inset-0 backface-hidden flex flex-col justify-center p-4
              ${flippedFeatures[index] ? "hidden" : "block"}
            `}
            >
              <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3 capitalize ">
                {feature.title}
              </h4>
              <p
                className={`text-sm font-normal text-gray-500 leading-5
                ${
                  visibleFeatures[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }
                transition-all duration-700 ease-out delay-500`}
                dangerouslySetInnerHTML={{__html: feature.description}}
              >
                
              </p>
            </div>

            {/* Back Side (Screenshot) */}
            <div
              className={`
              absolute inset-0 backface-hidden rotate-y-180 
              flex items-center justify-center 
              ${flippedFeatures[index] ? "block" : "hidden"}
            `}
            >
              <Image
                src={`/screenshot/${feature.screenshot}`}
                alt={`${feature.title} screenshot`}
                width={1024}
                height={1024}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg flip-card"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureAnimation;
