"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", name: "Overview" },
  { id: "uploads", name: "Your Library" },
  { id: "gestures", name: "Gesture Guide" },
];

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed top-28 left-8 z-50 animate-slide-down">
      <div className="relative backdrop-blur-md bg-white/80 border border-[#5C9BB8]/20 shadow-xl overflow-hidden group">
        {/* Gradient accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5C9BB8] via-[#FC9770] to-[#FBC841]"></div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C9BB8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative pl-5 pr-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              {/* Pulsing dot */}
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#5C9BB8] to-[#FC9770] rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-gradient-to-r from-[#5C9BB8] to-[#FC9770] rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5C9BB8]">
              Navigation
            </span>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left transition-all duration-300 group/item ${
                  activeSection === section.id
                    ? "text-[#5C9BB8] font-bold"
                    : "text-[#4a4a4a]/60 hover:text-[#4a4a4a] font-medium"
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Section indicator */}
                  <div
                    className={`transition-all duration-300 ${
                      activeSection === section.id
                        ? "w-8 h-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#FC9770]"
                        : "w-4 h-0.5 bg-[#4a4a4a]/30 group-hover/item:w-6 group-hover/item:bg-[#4a4a4a]/50"
                    }`}
                  ></div>
                  <span className="text-sm whitespace-nowrap">
                    {section.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
