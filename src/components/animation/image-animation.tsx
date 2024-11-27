"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ImageAnimation = () => {
  const ref = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [angle, setAngle] = useState("-30deg");
  const [translateY, setTranslateY] = useState("0px");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log("IntersectionObserver", entries)
        entries.forEach((entry) => {
          if (entry.target === ref.current) {
            const intersectionRatio = entry.intersectionRatio;
            console.log(intersectionRatio)

            // If not intersecting at all, reset to initial angle
            if (intersectionRatio === 0) {
              setAngle("-30deg");
              return;
            }
            
            // Calculate smooth transition from -30 to 0 degrees
            // Map intersection ratio from 0.33 to 1 into a range of -30 to 0
            if (intersectionRatio >= 0.33 && intersectionRatio <= 1) {
              // Linear interpolation from -30 to 0
              const normalizedRatio = (intersectionRatio - 0.33) / (1 - 0.33);
              const newAngle = -30 + (normalizedRatio * 30);
              console.log(`${newAngle.toFixed(1)}deg`)
              setAngle(`${newAngle.toFixed(1)}deg`);
            }
          }
        });
      },
      {
        threshold: [0, 0.33, 0.5, 1],
      }
    );

    const imageElement = ref.current;
    const containerElement = containerRef.current;

    if (!imageElement || !containerElement) return;

    const handleScroll = () => {
      // Get the bounding rectangle of the image
      const rect = imageElement.getBoundingClientRect();
      
      // Get viewport height
      const viewportHeight = window.innerHeight;

      // Check if the image is actually in the viewport
      const isInViewport = 
        rect.top < viewportHeight && 
        rect.bottom > 0;

      // If not in viewport, don't change angle
      if (!isInViewport) {
        return;
      }

      // Calculate how much of the image is in the viewport
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      
      // Calculate the percentage of the image visible
      const visiblePercentage = visibleHeight / rect.height;

      // Specifically handle scrolling from bottom to top
      // Only rotate when scrolling from bottom, not when disappearing at the top
      if (visiblePercentage >= 0.33 && visiblePercentage <= 1 && rect.top > 0) {
        // Linear interpolation from -30 to 0 degrees
        const normalizedRatio = (visiblePercentage - 0.33) / (1 - 0.33);
        const newAngle = -30 + (normalizedRatio * 30);
        setAngle(`${newAngle.toFixed(1)}deg`);

        // Translate Y Logic - create a faster scroll effect
        // The multiplier controls the intensity and speed of the effect
        const translateAmount = -125 * normalizedRatio;
        setTranslateY(`${translateAmount.toFixed(1)}px`);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Initial call to set correct angle on load
    //handleScroll();

    /*
    if (ref.current) {
      observer.observe(ref.current);
    }
    */

    return () => {
        //observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="block w-full mx-auto mt-6 md:mt-24">
      <Image
        ref={ref}
        className="dark:invert max-w-xs m-auto md:max-w-4xl border-gradient"
        style={{ 
          transform: `perspective(800px) rotateX(${angle}) translateY(${translateY})`,
        }} 
        src="/screenshot/main.png"
        alt="PFM Screenshot"
        width={1200}
        height={693}
        priority
      />
    </div>
  );
};

export default ImageAnimation;
