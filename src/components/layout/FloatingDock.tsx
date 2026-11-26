"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
// href فعلاً فقط برای آینده نگه داشته شده؛ بعداً هر دکمه به صفحهٔ خودش وصل می‌شود
const ITEMS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "خانه",
    href: "#home",
    icon: <path d="m3 10 9-7 9 7M5.5 9v11h5v-7h3v7h5V9" />,
  },
  {
    label: "فال‌ها",
    href: "/fal",
    icon: <path d="M12 3l2.4 5.6L20 9.3l-4.4 3.9L17 19l-5-3-5 3 1.4-5.8L4 9.3l5.6-.7z" />,
  },
  {
    label: "مجله",
    href: "/majale",
    icon: <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11" />,
  },
  {
    label: "درباره ما",
    href: "/darbare-ma",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
  },
  {
    label: "ارتباط با ما",
    href: "/tamas",
    icon: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  },
];

// تنظیمات حرکت: عدد کمتر یعنی حرکت کندتر و نرم‌تر
const STIFFNESS = 130;
const DAMPING = 22;

// هندسهٔ نوار با عرض طراحی ۴۹۰ پیکسل: فرورفتگی منحنی زیر گوی
const RADIUS = 42;

// هندسهٔ نوار: گوشه‌های گرد با شعاع RADIUS و فرورفتگی زیر گوی
function barPath(width: number, position: number) {
  const r = RADIUS;
  const c = Math.max(r + 49, Math.min(width - r - 49, position));
  return `M${r} 39 H${c - 49} C${c - 34} 39 ${c - 38} 76 ${c} 76 C${c + 38} 76 ${c + 34} 39 ${c + 49} 39 H${width - r} Q${width - 1} 39 ${width - 1} ${39 + r} V${124 - r} Q${width - 1} 124 ${width - r} 124 H${r} Q1 124 1 ${124 - r} V${39 + r} Q1 39 ${r} 39 Z`;
}
export default function FloatingDock() {
  const barRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<SVGPathElement>(null);
  const rimRef = useRef<SVGPathElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const selectedRef = useRef(0);
  const centersRef = useRef<number[]>([]);
  const widthRef = useRef(0);
  const xRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const frameRef = useRef(0);
  const prevTimeRef = useRef(0);

  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);

  // رندر یک فریم: شکل نوار، گوی، هاله و بلند شدن آیکن‌ها
  function render() {
    const width = widthRef.current;
    const x = xRef.current;

    const d = barPath(width, x);
    shadowRef.current?.setAttribute("d", d);
    rimRef.current?.setAttribute("d", d);
    if (glassRef.current) glassRef.current.style.clipPath = `path("${d}")`;

    const bead = beadRef.current;
    if (bead) {
      const stretch = Math.min(Math.abs(velocityRef.current) / 9000, 0.05);
      bead.style.transform = `translate3d(${x - bead.offsetWidth / 2}px,0,0) scale(${1 + stretch},${1 - stretch * 0.6})`;
    }
    if (ambientRef.current) ambientRef.current.style.left = `${x}px`;

    centersRef.current.forEach((center, i) => {
      const svg = tabRefs.current[i]?.querySelector("svg");
      if (!svg) return;
      const p = Math.max(0, 1 - Math.abs(center - x) / 58);
      const lift = p * p * (3 - 2 * p);
      svg.style.transform = `translate3d(0,${-46 * lift}px,0) scale(${1 + lift * 0.04})`;
      svg.style.color = lift > 0.65 ? "var(--plum)" : "";
    });
  }

  // فیزیک فنری: گوی با حرکت نرم به مقصد می‌رود
  function tick(time: number) {
    const dt = Math.min((time - prevTimeRef.current) / 1000 || 1 / 60, 1 / 30);
    prevTimeRef.current = time;

    for (let i = 0; i < 4; i++) {
      velocityRef.current +=
        (((targetRef.current - xRef.current) * STIFFNESS - velocityRef.current * DAMPING) * dt) / 4;
      xRef.current += (velocityRef.current * dt) / 4;
    }
    render();

    if (
      Math.abs(targetRef.current - xRef.current) > 0.02 ||
      Math.abs(velocityRef.current) > 0.02
    ) {
      frameRef.current = requestAnimationFrame(tick);
    } else {
      xRef.current = targetRef.current;
      velocityRef.current = 0;
      frameRef.current = 0;
      render();
    }
  }

  function animateTo(index: number) {
    targetRef.current = centersRef.current[index] ?? 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      xRef.current = targetRef.current;
      velocityRef.current = 0;
      render();
      return;
    }
    if (!frameRef.current) {
      prevTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(tick);
    }
  }

  function select(index: number) {
    selectedRef.current = index;
    setSelected(index);
    animateTo(index);
  }

  // اندازه‌گیری با offset (نه getBoundingClientRect) تا تحت تأثیر scale موبایل نباشد
  function measure() {
    const bar = barRef.current;
    const tabs = tabsRef.current;
    if (!bar || !tabs) return;

    widthRef.current = bar.offsetWidth;
    centersRef.current = tabRefs.current.map((tab) => {
      if (!tab) return 0;
      return tabs.offsetLeft + tab.offsetLeft + tab.offsetWidth / 2;
    });
    xRef.current = centersRef.current[selectedRef.current] ?? 0;
    targetRef.current = xRef.current;
    velocityRef.current = 0;
    render();
  }

  useLayoutEffect(() => {
    measure();
    setReady(true);
    const ro = new ResizeObserver(measure);
    if (barRef.current) ro.observe(barRef.current);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, []);

  return (
        <nav
      className={`dock${ready ? " dock-ready" : ""}`}
      aria-label="ناوبری سریع"
    >
      <div className="dock-bar" ref={barRef}>
        <svg className="dock-shadow" aria-hidden="true" preserveAspectRatio="none">
          <path ref={shadowRef} fill="rgba(255,255,255,.6)" />
        </svg>

        <div className="dock-glass" ref={glassRef} />

        <svg className="dock-rim" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dock-rim-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity=".9" />
              <stop offset="1" stopColor="#ffffff" stopOpacity=".15" />
            </linearGradient>
          </defs>
          <path ref={rimRef} fill="none" stroke="url(#dock-rim-grad)" strokeWidth="1.2" />
        </svg>

        <div className="dock-ambient" ref={ambientRef} aria-hidden="true" />

        <span className="dock-bead" ref={beadRef} aria-hidden="true">
          <span className="dock-sheen" />
        </span>

        <div className="dock-tabs" ref={tabsRef}>
          {ITEMS.map((item, i) => (
           <a
  key={item.label}
  ref={(el) => {
    tabRefs.current[i] = el;
  }}
  href={item.href}
  className="dock-tab"
  aria-current={i === selected ? "true" : undefined}
    onClick={(event) => {
    event.preventDefault();
    select(i);
  }}
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {item.icon}
  </svg>
  <span className="dock-label">{item.label}</span>
</a>
          ))}
        </div>
      </div>
    </nav>
  );
}