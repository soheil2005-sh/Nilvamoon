"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import {
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const steps = [
  {
    number: "۰۱",
    label: "انتخاب تجربه",
    title: "از کجا شروع کنیم؟",
    description:
      "فال حافظ، فال قهوه یا تاروت؛ تجربه‌ای را انتخاب کن که بیشتر با حال‌وهوای امروزت هماهنگ است.",
    detail: "حافظ · قهوه · تاروت",
    className: "how-card--rose",
  },
  {
    number: "۰۲",
    label: "لحظه انتخاب",
    title: "با حس خودت همراه شو",
    description:
      "نیت کن، انتخابت را انجام بده و بدون عجله وارد دنیای شعرها، نقش‌ها و نمادها شو.",
    detail: "یک انتخاب، یک تجربه تازه",
    className: "how-card--paper",
  },
  {
    number: "۰۳",
    label: "خواندن و کشف",
    title: "معنای تازه‌ای پیدا کن",
    description:
      "با معنی، تفسیر و توضیحات هر تجربه آشنا شو و از زاویه‌ای متفاوت به موضوع نگاه کن.",
    detail: "معنی · تفسیر · تأمل",
    className: "how-card--berry",
  },
];

/* ستاره‌ها: [x, y, اندازه] در یک بوم ۱۲۰۰×۷۰۰ */
const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [140, 120, 2.2], [260, 70, 1.6], [390, 160, 2.6], [520, 95, 1.4], [610, 210, 2],
  [1010, 90, 2.4], [1110, 170, 1.6], [960, 230, 2.8], [880, 140, 1.4],
  [200, 560, 2.2], [330, 620, 1.6], [470, 570, 2.4],
  [1040, 590, 2], [930, 640, 1.6], [1130, 520, 2.6],
];

/* خط‌های اتصال ستاره‌ها (صورت فلکی) */
const CONSTELLATIONS = [
  "140,120 260,70 390,160 520,95 610,210",
  "1010,90 1110,170 960,230 880,140",
  "200,560 330,620 470,570",
  "1130,520 1040,590 930,640",
];

/* چرخ اسطرلابی؛ ticks = تعداد خط‌های درجه‌بندی، stroke = ضخامت خط */
function AstrolabeWheel({
  ticks,
  stroke = 1,
}: {
  ticks: number;
  stroke?: number;
}) {
  const step = 360 / ticks;

  return (
    <svg
      className="how-wheel-svg"
      viewBox="-300 -300 600 600"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      aria-hidden="true"
      focusable="false"
    >
      <circle r="292" />
      <circle r="268" strokeDasharray="1 7" />
      <circle r="212" />
      <circle r="150" strokeOpacity=".6" />
      <circle r="92" strokeOpacity=".4" />

      {Array.from({ length: ticks }, (_, i) => (
        <line
          key={`t${i}`}
          x1="0"
          y1="-292"
          x2="0"
          y2={i % 5 === 0 ? -272 : -282}
          transform={`rotate(${i * step})`}
        />
      ))}

      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={`d${i}`}
          d="M0 -240 L5 -232 L0 -224 L-5 -232 Z"
          fill="currentColor"
          stroke="none"
          transform={`rotate(${i * 30})`}
        />
      ))}

      <path d="M-212 0H212M0 -212V212" strokeOpacity=".3" />
      <circle cx="0" cy="-212" r="5" fill="currentColor" stroke="none" />
      <circle cx="150" cy="0" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="-92" cy="0" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* تیلت کارت با موس (فقط موس) */
function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  card.style.setProperty("--rx", `${((0.5 - y) * 9).toFixed(2)}deg`);
  card.style.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
  card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
}

function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === "mouse") return;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  card.style.setProperty("--mx", `${x.toFixed(1)}%`);
  card.style.setProperty("--my", `${y.toFixed(1)}%`);
}

function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget;

  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
  card.style.setProperty("--mx", "50%");
  card.style.setProperty("--my", "35%");
}

/*
  هر کارت جدا ساخته می‌شود تا حرکت‌های اسکرولی مستقیم روی همان عنصر
  (فقط با transform) اجرا شوند؛ بدون نقاشی مجدد و بدون لگ.
*/
function HowCard({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const fan = index - 1;

  // چرخش سه‌بعدی: وقتی سکشن وسط صفحه است صاف می‌شود
  const rotateX = useTransform(progress, [0, 0.5, 1], [8, 0, -8]);
  const rotateY = useTransform(progress, [0, 0.5, 1], [7 * fan, 0, -7 * fan]);

  // لغزیدن نوار رنگین‌کمانی CD روی کارت
  const bandX = useTransform(
    progress,
    [0, 1],
    [`${-170 - index * 20}%`, `${210 - index * 20}%`]
  );

  return (
    <motion.li
      className="how-grid-item"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "0px 0px 15% 0px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div className="how-tilt" style={{ rotateX, rotateY }}>
        <div
          className={`how-card ${step.className}`}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
        >
          {/* لبه‌ی رنگین‌کمانی که خودش می‌چرخد */}
          <span className="how-rim" aria-hidden="true">
            <span
              className="how-rim-spin"
              style={{ animationDelay: `${index * -3}s` }}
            />
          </span>

          {/* درخشش پشت CD با اسکرول */}
          <span className="how-holo" aria-hidden="true">
            <motion.span className="how-holo-band" style={{ x: bandX }} />
          </span>

          <div className="how-card-top">
            <span className="how-number" aria-hidden="true">
              {step.number}
            </span>
            <span className="how-symbol" aria-hidden="true">
              ✧
            </span>
          </div>

          <div className="how-card-content">
            <span className="how-label">{step.label}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>

          <div className="how-card-bottom">
            <span>{step.detail}</span>
            <span className="how-card-arrow" aria-hidden="true">
              ↙
            </span>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // اسکرول خام را نرم می‌کند تا کارت‌ها و ستاره‌ها شناور حرکت کنند
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  const starsY = useTransform(smooth, [0, 1], [36, -36]);

  // وقتی سکشن روی صفحه نیست، انیمیشن‌های بی‌پایان متوقف می‌شوند
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // شروع امن: تا وقتی ناظر خبر نداده، انیمیشن‌ها فعال باشند
    section.dataset.inview = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.dataset.inview = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="how-section"
        id="how-it-works"
        aria-labelledby="how-title"
      >
        {/* پس‌زمینه‌ی تزئینی: اسطرلاب + صورت فلکی */}
        <div className="how-backdrop" aria-hidden="true">
          <div className="how-wheel how-wheel--outer">
            <AstrolabeWheel ticks={120} stroke={1.2} />
          </div>

          <div className="how-wheel how-wheel--inner">
            <AstrolabeWheel ticks={72} stroke={1.4} />
          </div>

          <motion.div className="how-stars" style={{ y: starsY }}>
            <svg
              viewBox="0 0 1200 700"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              focusable="false"
            >
              {CONSTELLATIONS.map((points) => (
                <polyline
                  key={points}
                  points={points}
                  className="how-star-line"
                />
              ))}
              {STARS.map(([cx, cy, r]) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  className="how-star"
                />
              ))}
            </svg>
          </motion.div>
        </div>

        <div className="how-inner">
          <header className="how-heading">
            <div className="how-emblem" aria-hidden="true">
              <span className="how-emblem-halo" />

              <div className="how-emblem-ring">
                <AstrolabeWheel ticks={36} stroke={5} />
              </div>

              <svg
                className="how-emblem-moon"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <path
                  d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"
                  fill="currentColor"
                />
              </svg>

              <span className="how-emblem-spark how-emblem-spark--a">✦</span>
              <span className="how-emblem-spark how-emblem-spark--b">✧</span>
              <span className="how-emblem-spark how-emblem-spark--c">✦</span>
            </div>

            <span className="how-eyebrow">
              <span aria-hidden="true">✧</span>
              یک تجربه ساده و صمیمی
              <span aria-hidden="true">✧</span>
            </span>

            <h2 id="how-title">
              فال آنلاین در نیلوا‌مون
              <span>چطور انجام می‌شه؟</span>
            </h2>

            <p>
              برای شروع فقط کافیه تجربه مورد علاقه‌ات رو انتخاب کنی. از فال حافظ
              و تاروت تا فال قهوه؛ همه‌چیز با چند قدم ساده شروع می‌شه.
            </p>
          </header>

          <ol className="how-grid">
            {steps.map((step, index) => (
              <HowCard
                key={step.number}
                step={step}
                index={index}
                progress={smooth}
              />
            ))}
          </ol>

          <div className="how-note">
            <span className="how-note-star" aria-hidden="true">
              ✧
            </span>
            <p>گاهی یک مکث کوتاه، می‌تواند آغاز نگاهی تازه به خودت باشد.</p>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}