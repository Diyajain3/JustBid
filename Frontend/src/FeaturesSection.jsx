import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const colors = [
  "bg-red-500", "bg-blue-500", "bg-yellow-500", 
  "bg-purple-500", "bg-orange-500", "bg-emerald-500", "bg-rose-500"
];

const MuseumSection = () => {
  const scrollRef = useRef(null);
  const triggerRef = useRef(null);
  const revealTextRef = useRef(null);

  useGSAP(() => {
    const mainTrack = gsap.to(scrollRef.current, {
      x: "-350vw", 
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=5000",
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      }
    });

    const boxes = gsap.utils.toArray(".museum-box");
    
    boxes.forEach((box) => {
      const randomRotation = gsap.utils.random(-35, 35);
      const randomY = gsap.utils.random(-50, 50);
      const randomXOffset = gsap.utils.random(-100, 100); 

      gsap.to(box, {
        rotation: randomRotation,
        y: randomY,
        x: randomXOffset,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: box, 
          containerAnimation: mainTrack,
          start: "left right", 
          end: "right left",  
          scrub: 1,        
        },
      });
    });

    // 3. TEXT FADE-IN LOGIC (Synced with horizontal animation)
    gsap.fromTo(
      revealTextRef.current,
      { 
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: scrollRef.current,
          containerAnimation: mainTrack,
          start: "60% center",
          end: "90% center",
          scrub: true,
        }
      }
    );

  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} className="relative h-screen w-full overflow-hidden bg-[#10144a]">
      {/* REVEAL TEXT (Behind the cards) */}
      <div ref={revealTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-0">
        <h2 className="text-[12vw] font-black text-[#e0e1ea] leading-none text-center uppercase italic">
          JustBid <br />
        </h2>
        <div className="mt-10 px-6 py-3 border border-[#d4e9e2] rounded-xl text-white uppercase text-lg font-bold tracking-widest cursor-pointer hover:bg-white hover:text-[#0e1741] transition-all">
          View All Cards
        </div>
      </div>

      {/* THE FLOATING TRACK (Cards) */}
      <div 
        ref={scrollRef} 
        className="relative z-10 flex h-full items-center pointer-events-none"
        style={{ width: "450vw", paddingLeft: "100vw" }} 
      >
        {colors.map((color, index) => (
          <div
            key={index}
            className={`museum-box ${color} w-80 h-112 mx-10 shrink-0 rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-10 border-white flex items-end p-6`}
            style={{
              zIndex: 10 + index 
            }}
          >
            <div className="w-full">
              <div className="h-3 w-20 bg-white/20 rounded mb-2" />
              <div className="h-6 w-full bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MuseumSection;