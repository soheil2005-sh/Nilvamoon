"use client";

import { useEffect, useRef, useState } from "react";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20M4 12H16M4 17H20" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.5 15.5L20 20" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 2V4M12 20V22M4.93 4.93L6.35 6.35M17.65 17.65L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.35 17.65M17.65 6.35L19.07 4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  );
}
function BrandMoon() {
  return (
    <svg className="brand-symbol" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
const NAV_ITEMS = [
  { label: "خانه", href: "#home" },
  { label: "فال‌ها", href: "#experiences" },
  { label: "آشپزی", href: "#cooking" },
  { label: "تعبیر خواب", href: "#dreams" },
  { label: "روانشناسی", href: "#psychology" },
  { label: "پزشکی و سلامت", href: "#health" },
  { label: "تقویم", href: "#calendar" },
  { label: "ارتباط با ما", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // بستن منو/جستجو با کلید Esc یا کلیک بیرون از هدر
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    function closeAll() {
      setMenuOpen(false);
      setSearchOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) closeAll();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen, searchOpen]);

  function toggleTheme() {
    const nextTheme = !isDark;
    document.documentElement.classList.toggle("dark", nextTheme);
    setIsDark(nextTheme);
  }

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-glass">
        <div className="header-side header-left">
          <button
            className={`header-icon-button ${menuOpen ? "active" : ""}`}
            type="button"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchOpen(false);
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <a href="#home" className="brand" aria-label="NilvaMoon - خانه">
          <BrandMoon />
          <span className="brand-name">NilvaMoon</span>
          <span className="brand-caption">A LITTLE MAGIC WITHIN</span>
        </a>

        <div className="header-side header-right">
          <button
            className={`header-icon-button ${searchOpen ? "active" : ""}`}
            type="button"
            aria-label="جست‌وجو"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMenuOpen(false);
            }}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>

          <button
            className="header-icon-button theme-button"
            type="button"
            aria-label="تغییر تم"
            onClick={toggleTheme}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {menuOpen && (
          <nav className="header-dropdown" aria-label="منوی اصلی">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {searchOpen && (
          <form
            className="header-search-panel"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <SearchIcon />
            <input
              type="search"
              placeholder="دنبال چه چیزی می‌گردی؟"
              aria-label="عبارت جست‌وجو"
              autoFocus
            />
          </form>
        )}
      </div>
    </header>
  );
}