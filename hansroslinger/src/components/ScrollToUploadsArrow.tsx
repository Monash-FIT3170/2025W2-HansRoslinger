"use client";

import { MouseEvent } from "react";

const getScrollParent = (element: HTMLElement | null): HTMLElement => {
  let parent: HTMLElement | null = element?.parentElement ?? null;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === "auto" || overflowY === "scroll") &&
      parent.scrollHeight > parent.clientHeight;
    if (isScrollable) return parent;
    parent = parent.parentElement;
  }
  return (document.scrollingElement as HTMLElement) || document.documentElement;
};

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const smoothScrollTo = (
  container: HTMLElement,
  to: number,
  duration = 1400,
) => {
  return new Promise<void>((resolve) => {
    const start = container.scrollTop;
    const change = to - start;
    const startTime = performance.now();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const actualDuration = prefersReducedMotion ? 0 : duration;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / actualDuration);
      const eased = actualDuration === 0 ? 1 : easeInOutQuad(progress);
      container.scrollTop = start + change * eased;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
};

const smoothScrollIntoView = async (target: HTMLElement) => {
  const container = getScrollParent(target);
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetTop = targetRect.top - containerRect.top + container.scrollTop;
  await smoothScrollTo(container, targetTop, 1400);
};

export default function ScrollToUploadsArrow() {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const wrapper = document.getElementById("uploads");
    const target =
      (wrapper?.querySelector("section") as HTMLElement) ??
      (wrapper as HTMLElement);
    if (target) {
      smoothScrollIntoView(target);
    }
  };

  return (
    <div className="mt-20 animate-bounce" style={{ animationDelay: "1600ms" }}>
      <div
        className="relative inline-block group cursor-pointer"
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FC9770]/40 via-[#FBC841]/40 to-[#FC9770]/40 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <svg
          className="w-12 h-12 mx-auto text-[#FC9770] drop-shadow-xl relative transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
