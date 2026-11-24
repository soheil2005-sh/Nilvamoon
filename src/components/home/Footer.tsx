"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState("۲۰۲۶");

  useEffect(() => {
setYear(new Date().getFullYear().toLocaleString("fa-IR", { useGrouping: false }));
  }, []);

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <a href="#home" className="footer-brand">
          NilvaMoon <span>☾</span>
        </a>

        <p>کمی جادو، کمی معنا، و فرصتی برای مکث.</p>

        <nav className="footer-links" aria-label="پیوندهای پایانی">
          <a href="#home">خانه</a>
          <a href="#experiences">فال‌ها</a>
          <a href="#journal">مجله</a>
          <a href="#about">درباره ما</a>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {year} NilvaMoon</span>
        <span>ساخته‌شده برای لحظه‌های کشف</span>
      </div>
    </footer>
  );
}