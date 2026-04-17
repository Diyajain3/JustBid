"use client"
import React, { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"

export function GlobeComponent() {
  const canvasRef = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const updateWidth = () => {
      if (canvasRef.current) {
        setWidth(canvasRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(updateWidth);
    observer.observe(canvasRef.current);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!width || !canvasRef.current) return;

    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 15, // Significantly increased brightness
      baseColor: [0.3, 0.3, 0.3], // Lighter base color to show landmasses
      markerColor: [0.29, 0.87, 0.50], // Primary Green
      glowColor: [1, 1, 1], // Pure white glow for better visibility
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [48.8566, 2.3522], size: 0.05 },
        { location: [35.6762, 139.6503], size: 0.1 },
        { location: [-33.8688, 151.2093], size: 0.07 },
        { location: [1.3521, 103.8198], size: 0.09 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => {
      globe.destroy();
    }
  }, [width]);

  return (
    <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center m-auto rounded-full bg-primary/5 shadow-[0_0_50px_rgba(var(--primary),0.05)]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: "100%", aspectRatio: "1" }}
      />
      {/* Glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(74,222,128,0.1)_0%,_transparent_70%)]" />
    </div>
  )
}
