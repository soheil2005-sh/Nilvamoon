"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
} from "motion/react";

type CategoryId = "ancient" | "dream" | "tarot";

type AtlasEntry = {
  name: string;
  meaning: string;
};

type AtlasCategory = {
  id: CategoryId;
  number: string;
  tab: string;
  era: string;
  heading: string;
  summary: string;
  entries: readonly AtlasEntry[];
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ENTRY_MARKS = ["الف", "ب", "ج"] as const;

const CATEGORIES: readonly AtlasCategory[] = [
  {
    id: "ancient",
    number: "۰۱",
    tab: "نمادهای کهن",
    era: "از اسطوره‌ها تا ادبیات",
    heading: "زبان مشترک نمادهای کهن",
    summary:
      "نمادهایی که در فرهنگ‌ها و اسطوره‌های گوناگون، معانی مشترک و تکرارشونده پیدا کرده‌اند؛ از نگاه‌های محافظ تا چرخه‌های طبیعت.",
    entries: [
      {
        name: "چشم",
        meaning:
          "نگاهی که از دیرباز نماد آگاهی، محافظت و توجه به جزئیات بوده است.",
      },
      {
        name: "ماه",
        meaning:
          "نماد چرخه، تغییر و دگرگونی؛ همان ریتمی که زندگی در آن جریان دارد.",
      },
      {
        name: "مار",
        meaning:
          "نماد پوست‌اندازی و بازآفرینی، که در اسطوره‌های بسیاری از فرهنگ‌ها تکرار شده است.",
      },
    ],
  },
  {
    id: "dream",
    number: "۰۲",
    tab: "نمادهای خواب",
    era: "از خواب شبانه تا تأمل روزانه",
    heading: "زبان ناخودآگاه در خواب",
    summary:
      "نمادهایی که در خواب ظاهر می‌شوند و می‌توانند برای تأمل روی احساس‌ها و تجربه‌های شخصی به کار بیایند.",
    entries: [
      {
        name: "آب",
        meaning:
          "اغلب به احساس‌ها و لایه‌های ناخودآگاه اشاره دارد؛ آرام یا مواج بودنش خودش می‌تواند پیامی باشد.",
      },
      {
        name: "پله",
        meaning:
          "نماد مسیر، گذار و رشد تدریجی؛ بالا یا پایین رفتن از آن، حس جهت را نشان می‌دهد.",
      },
      {
        name: "آینه",
        meaning:
          "تصویری از خودت که شاید تازه‌تر از همیشه دیده شود؛ نشانه‌ای برای خودشناسی و مواجهه.",
      },
    ],
  },
  {
    id: "tarot",
    number: "۰۳",
    tab: "نمادهای تاروت",
    era: "از ورق‌های سنتی تا کارت‌های امروز",
    heading: "نقش‌ها و معانی ورق‌ها",
    summary:
      "نقش‌هایی که در ورق‌های تاروت معانی گوناگونی دارند و بیشتر ابزار مکث و پرسیدن سؤال‌های بهتر هستند.",
    entries: [
      {
        name: "ماه",
        meaning: "ابهام، شهود و چیزهایی که هنوز آشکار نشده‌اند.",
      },
      {
        name: "خورشید",
        meaning: "روشنی، شادی ساده و اعتماد به جریان زندگی.",
      },
      {
        name: "ستاره",
        meaning:
          "امید، آرامش و نوری که بعد از دوره‌ای سخت دوباره پیدا می‌شود.",
      },
    ],
  },
];

/* ---------- هندسه‌ی کمکی برای SVG ---------- */

function circlePath(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
}

function rayPath(
  cx: number,
  cy: number,
  from: number,
  to: number,
  degrees: number
) {
  const angle = (degrees * Math.PI) / 180;
  const x1 = cx + from * Math.sin(angle);
  const y1 = cy - from * Math.cos(angle);
  const x2 = cx + to * Math.sin(angle);
  const y2 = cy - to * Math.cos(angle);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/* ---------- اجزای کشیدنی (Living Symbols) ----------
   نکته: هیچ شرطی بر اساس کاهش حرکت در رندر نیست؛
   کاهش حرکت در CSS با «.atlas-svg path» اعمال می‌شود. */

function Draw({
  d,
  className,
  delay = 0,
}: {
  d: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.path
      d={d}
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.8, delay, ease: EASE }}
    />
  );
}

function FillDot({
  cx,
  cy,
  r,
  delay = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  delay?: number;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      className="atlas-gold-fill"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay, ease: EASE }}
    />
  );
}

function AtlasIllustration({ id }: { id: CategoryId }) {
  if (id === "ancient") {
    return (
      <svg
        className="atlas-svg"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <Draw d={circlePath(200, 200, 176)} className="atlas-ink atlas-ink--faint" />
        {Array.from({ length: 12 }, (_, i) => (
          <Draw
            key={i}
            d={rayPath(200, 200, 150, 166, i * 30)}
            className="atlas-ink"
            delay={0.4 + i * 0.03}
          />
        ))}
        <Draw
          d="M52 200C120 96 280 96 348 200C280 304 120 304 52 200Z"
          className="atlas-ink"
          delay={0.1}
        />
        <Draw d={circlePath(200, 200, 58)} className="atlas-gold" delay={0.5} />
        <Draw
          d={circlePath(200, 200, 36)}
          className="atlas-ink atlas-ink--faint"
          delay={0.7}
        />
        <FillDot cx={200} cy={200} r={13} delay={0.9} />
        <Draw d="M200 316L210 330L200 344L190 330Z" className="atlas-gold" delay={1.1} />
      </svg>
    );
  }

  if (id === "dream") {
    return (
      <svg
        className="atlas-svg"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <Draw
          d="M250 80A58 58 0 1 0 330 150A46 46 0 0 1 250 80Z"
          className="atlas-gold"
          delay={0.1}
        />
        <Draw
          d="M60 230C110 200 150 260 200 230S290 200 340 230"
          className="atlas-ink"
          delay={0.4}
        />
        <Draw
          d="M80 270C130 240 170 300 220 270S300 240 330 270"
          className="atlas-ink atlas-ink--faint"
          delay={0.6}
        />
        <Draw
          d="M100 310C140 285 180 335 230 310S300 285 320 310"
          className="atlas-ink atlas-ink--faint"
          delay={0.8}
        />
        <FillDot cx={120} cy={140} r={2} delay={1} />
        <FillDot cx={160} cy={112} r={1.6} delay={1.1} />
        <FillDot cx={300} cy={210} r={2.2} delay={1.2} />
      </svg>
    );
  }

  return (
    <svg
      className="atlas-svg"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Draw d="M110 330V206A90 90 0 0 1 290 206V330" className="atlas-ink" delay={0.1} />
      <Draw d="M134 330V206A66 66 0 0 1 266 206V330" className="atlas-gold" delay={0.3} />
      <Draw d={circlePath(200, 206, 34)} className="atlas-gold" delay={0.5} />
      <FillDot cx={200} cy={206} r={16} delay={0.8} />
      {Array.from({ length: 8 }, (_, i) => (
        <Draw
          key={i}
          d={rayPath(200, 206, 44, 62, i * 45)}
          className="atlas-gold"
          delay={0.7 + i * 0.04}
        />
      ))}
      <Draw d="M72 330H328" className="atlas-ink" delay={0.2} />
      <Draw
        d="M200 84L204 92L212 96L204 100L200 108L196 100L188 96L196 92Z"
        className="atlas-gold"
        delay={1.2}
      />
    </svg>
  );
}

/* ---------- کامپوننت اصلی ---------- */

export default function SymbolsAtlas() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<CategoryId, HTMLButtonElement | null>>>(
    {}
  );
  const [activeId, setActiveId] = useState<CategoryId>("ancient");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  const active =
    CATEGORIES.find((category) => category.id === activeId) ?? CATEGORIES[0];

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    // در چیدمان راست‌به‌چپ: فلش چپ به تب بعدی و فلش راست به تب قبلی.
    let nextIndex: number | null = null;
    if (event.key === "ArrowLeft") nextIndex = index + 1;
    else if (event.key === "ArrowRight") nextIndex = index - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = CATEGORIES.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();

    const total = CATEGORIES.length;
    const target = CATEGORIES[(nextIndex + total) % total];
    setActiveId(target.id);
    tabRefs.current[target.id]?.focus();
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="atlas-section"
        id="symbols-atlas"
        aria-labelledby="atlas-title"
      >
        <div className="atlas-inner">
          <motion.header
            className="atlas-heading"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="atlas-eyebrow">
              <span aria-hidden="true">✧</span>
              اطلس نشانه‌ها
              <span aria-hidden="true">✧</span>
            </span>
            <h2 id="atlas-title">هر نشانه، روایتی برای کشف دارد.</h2>
            <p>
              از نمادهای کهن تا نقش‌های خواب و کارت‌های تاروت؛ به دنیایی از
              معنا، تاریخ و روایت قدم بگذار.
            </p>
          </motion.header>

          <div className="atlas-tabs" role="tablist" aria-label="دسته‌بندی نمادها">
            {CATEGORIES.map((category, index) => {
              const selected = category.id === active.id;
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    tabRefs.current[category.id] = el;
                  }}
                  id={`atlas-tab-${category.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="atlas-panel"
                  tabIndex={selected ? 0 : -1}
                  className="atlas-tab"
                  onClick={() => setActiveId(category.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  <span className="atlas-tab-number" aria-hidden="true">
                    {category.number}
                  </span>
                  <span>{category.tab}</span>
                </button>
              );
            })}
          </div>

          <div className="atlas-stage">
            <motion.div
              className="atlas-vitrine"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <span className="atlas-prism atlas-prism--a" aria-hidden="true" />
              <span className="atlas-prism atlas-prism--b" aria-hidden="true" />

              {/* پرتو: با کاهش حرکت در CSS پنهان می‌شود */}
              <motion.span
                key={`sweep-${active.id}`}
                className="atlas-sweep"
                aria-hidden="true"
                initial={{ x: "-120%" }}
                animate={{ x: "320%" }}
                transition={{ duration: 1.5, ease: EASE }}
              />

              <motion.div className="atlas-art" style={{ y: artY }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    className="atlas-art-frame"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <AtlasIllustration id={active.id} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <p className="atlas-caption">{active.number} از ۰۳</p>
            </motion.div>

            <div
              className="atlas-panel"
              role="tabpanel"
              id="atlas-panel"
              aria-labelledby={`atlas-tab-${active.id}`}
              tabIndex={0}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  className="atlas-panel-body"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="atlas-panel-era">{active.era}</p>
                  <h3>{active.heading}</h3>
                  <p className="atlas-panel-summary">{active.summary}</p>

                  <ul className="atlas-entries">
                    {active.entries.map((entry, i) => (
                      <li key={entry.name} className="atlas-entry">
                        <span className="atlas-entry-mark" aria-hidden="true">
                          {ENTRY_MARKS[i]}
                        </span>
                        <div>
                          <h4>{entry.name}</h4>
                          <p>{entry.meaning}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="atlas-panel-footer">
                <span className="atlas-soon">به‌زودی در بایگانی نمادها</span>
                <span>تفسیرها برای تأمل‌اند، نه پیش‌بینی قطعی.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}