"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type MotionValue,
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

function AtlasIllustration({
  id,
  pupilX,
  pupilY,
  eyeRotation,
  waterDrift,
  waterCounterDrift,
  waterSurge,
  waterTouchX,
  waterTouchY,
  waterRippleKey,
  waterRippleX,
  waterRippleY,
}: {
  id: CategoryId;
  pupilX?: MotionValue<number>;
  pupilY?: MotionValue<number>;
  eyeRotation?: MotionValue<number>;
  waterDrift?: MotionValue<number>;
  waterCounterDrift?: MotionValue<number>;
  waterSurge?: MotionValue<number>;
  waterTouchX?: MotionValue<number>;
  waterTouchY?: MotionValue<number>;
  waterRippleKey?: number;
  waterRippleX?: number;
  waterRippleY?: number;
}) {
  if (id === "ancient") {
    return (
      <svg
        className="atlas-svg atlas-svg--eye"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="atlas-eye-iris" cx="42%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#f8e5bd" />
            <stop offset="34%" stopColor="#c99b62" />
            <stop offset="72%" stopColor="#80506f" />
            <stop offset="100%" stopColor="#38243f" />
          </radialGradient>
          <radialGradient id="atlas-eye-pupil-fill" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#3c2548" />
            <stop offset="100%" stopColor="#100d1b" />
          </radialGradient>
          <linearGradient id="atlas-eye-lid" x1="70" y1="130" x2="330" y2="270" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d8b68a" />
            <stop offset=".5" stopColor="#a66e91" />
            <stop offset="1" stopColor="#d8b68a" />
          </linearGradient>
          <clipPath id="atlas-eye-aperture">
            <path d="M48 200C91 139 145 108 200 108C255 108 309 139 352 200C309 261 255 292 200 292C145 292 91 261 48 200Z" />
          </clipPath>
        </defs>
{/* مدارهای نجومی؛ چرخش کنترل‌شده با اسکرول */}
<motion.g
  style={{
    rotate: eyeRotation,
    transformOrigin: "200px 200px",
  }}
>
  <Draw
    d={circlePath(200, 200, 178)}
    className="atlas-ink atlas-ink--faint"
  />

  <Draw
    d={circlePath(200, 200, 158)}
    className="atlas-gold atlas-eye-orbit"
    delay={0.12}
  />

  <Draw
    d={circlePath(200, 200, 145)}
    className="atlas-ink atlas-ink--faint"
    delay={0.2}
  />

  <Draw
    d="M200 12L209 31L200 50L191 31Z"
    className="atlas-gold"
    delay={0.25}
  />

  <Draw
    d="M200 350L209 369L200 388L191 369Z"
    className="atlas-gold"
    delay={0.3}
  />

  <Draw
    d="M12 200L31 191L50 200L31 209Z"
    className="atlas-gold"
    delay={0.35}
  />

  <Draw
    d="M350 200L369 191L388 200L369 209Z"
    className="atlas-gold"
    delay={0.4}
  />

  {Array.from({ length: 48 }, (_, i) => (
    <Draw
      key={`eye-tick-${i}`}
      d={rayPath(
        200,
        200,
        i % 2 === 0 ? 164 : 168,
        i % 4 === 0 ? 181 : 173,
        i * 7.5
      )}
      className="atlas-ink atlas-eye-tick"
      delay={0.25 + i * 0.008}
    />
  ))}
</motion.g>

        {/* فرم چشم و خطوط پلک */}
        <Draw
          d="M48 200C91 139 145 108 200 108C255 108 309 139 352 200C309 261 255 292 200 292C145 292 91 261 48 200Z"
          className="atlas-eye-outline"
          delay={0.25}
        />
        <Draw
          d="M69 196C108 153 153 132 200 132C247 132 292 153 331 196"
          className="atlas-gold atlas-eye-lid-line"
          delay={0.45}
        />
        <Draw
          d="M69 204C108 247 153 268 200 268C247 268 292 247 331 204"
          className="atlas-ink atlas-eye-lid-line atlas-eye-lid-line--soft"
          delay={0.5}
        />
        <Draw d="M48 200L27 181M48 200L27 219M352 200L373 181M352 200L373 219" className="atlas-gold" delay={0.55} />

        {/* عنبیه و مردمک؛ فقط مردمک با اشاره‌ی کاربر جابه‌جا می‌شود */}
        <g clipPath="url(#atlas-eye-aperture)">
          <circle cx="200" cy="200" r="67" fill="url(#atlas-eye-iris)" />
          <circle cx="200" cy="200" r="61" className="atlas-eye-iris-ring" />
          {Array.from({ length: 32 }, (_, i) => (
            <path
              key={`iris-ray-${i}`}
              d="M200 139L200 151"
              className="atlas-eye-iris-ray"
              transform={`rotate(${i * 11.25} 200 200)`}
            />
          ))}
          <circle cx="200" cy="200" r="47" className="atlas-eye-iris-inner" />
<motion.g
  className="atlas-eye-pupil"
  style={{
    x: pupilX,
    y: pupilY,
  }}
>            <circle cx="200" cy="200" r="34" fill="url(#atlas-eye-pupil-fill)" />
            <circle cx="200" cy="200" r="29" className="atlas-eye-pupil-ring" />
            <ellipse cx="188" cy="186" rx="9" ry="5" fill="#fff7e9" opacity=".82" />
            <circle cx="214" cy="215" r="3.2" fill="#f5d8a6" opacity=".8" />
          </motion.g>
        </g>

        {/* نقطه‌های نور و تزئینات پایانی */}
        <circle cx="200" cy="200" r="75" className="atlas-eye-aura" />
        <path d="M200 70L205 80L216 85L205 90L200 101L195 90L184 85L195 80Z" className="atlas-gold-fill" />
        <path d="M200 299L204 307L212 311L204 315L200 323L196 315L188 311L196 307Z" className="atlas-gold-fill" />
      </svg>
    );
  }

if (id === "dream") {
  return (
    <svg
      className="atlas-svg atlas-svg--water"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* عمق اصلی آب */}
        <linearGradient
          id="atlas-water-deep"
          x1="200"
          y1="140"
          x2="200"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#bcefff" />
          <stop offset=".32" stopColor="#5daecb" />
          <stop offset=".7" stopColor="#245b83" />
          <stop offset="1" stopColor="#142b4b" />
        </linearGradient>

        {/* لایه روشن آب */}
        <linearGradient
          id="atlas-water-light"
          x1="50"
          y1="160"
          x2="350"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f0fdff" />
          <stop offset=".3" stopColor="#a9e8f4" />
          <stop offset=".65" stopColor="#62b9d4" />
          <stop offset="1" stopColor="#397ca8" />
        </linearGradient>

        {/* موج جلویی */}
        <linearGradient
          id="atlas-water-front"
          x1="200"
          y1="205"
          x2="200"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a8eafa" stopOpacity=".96" />
          <stop offset=".4" stopColor="#397fa8" stopOpacity=".96" />
          <stop offset="1" stopColor="#173654" />
        </linearGradient>

        {/* انعکاس طلایی */}
        <radialGradient id="atlas-water-reflection">
          <stop stopColor="#ffffff" stopOpacity=".95" />
          <stop offset=".3" stopColor="#c9f7ff" stopOpacity=".42" />
          <stop offset="1" stopColor="#8ee7f5" stopOpacity="0" />
        </radialGradient>

        {/* نور نرم */}
        <radialGradient id="atlas-water-atmosphere">
          <stop stopColor="#8ee8f7" stopOpacity=".34" />
          <stop offset="1" stopColor="#4b9fca" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="atlas-moon-surface" x1="170" y1="45" x2="225" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset=".55" stopColor="#d7f7ff" />
          <stop offset="1" stopColor="#8bd8ee" />
        </linearGradient>

        {/* محدوده آب */}
        <clipPath id="atlas-water-clip">
          <rect x="12" y="115" width="376" height="270" rx="85" />
        </clipPath>

        <filter
          id="atlas-water-blur"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>

      {/* هاله محیطی */}
      <ellipse
        cx="200"
        cy="250"
        rx="175"
        ry="135"
        fill="url(#atlas-water-atmosphere)"
      />

      {/* ماه هلالی؛ امضای آسمانی نیلوا */}
      <circle cx="200" cy="75" r="43" fill="url(#atlas-water-reflection)" opacity=".52" />
      <path
        d="M216 43C210 39 202 37 194 39C173 44 161 65 166 86C171 108 193 121 215 115C224 112 231 106 236 98C229 102 221 103 213 101C194 96 184 77 189 59C193 48 203 41 216 43Z"
        fill="url(#atlas-moon-surface)"
        className="atlas-moon"
        opacity=".96"
        style={{ filter: "drop-shadow(0 0 10px rgba(214,248,255,.55))" }}
      />
      <path d="M148 76H157M243 61L250 56M248 91L257 94" stroke="#d8f8ff" strokeWidth="1.5" strokeLinecap="round" opacity=".72" />
      <path d="M264 42L267 49L274 52L267 55L264 62L261 55L254 52L261 49Z" fill="#e9fbff" opacity=".82" />
      <circle cx="139" cy="105" r="2" fill="#e9fbff" opacity=".8" />

      <motion.g style={{ x: waterTouchX, y: waterTouchY }}>
      <g clipPath="url(#atlas-water-clip)">

        {/* بدنه اصلی آب */}
        <path
          d="M0 185 C55 145 105 205 155 180 C210 152 260 145 310 183 C350 211 377 183 410 166 V420 H0Z"
          fill="url(#atlas-water-deep)"
        />

        {/* لایه پشتی موج */}
<motion.g
  style={{
    x: waterDrift,
    y: waterSurge,
  }}
  animate={{ scaleX: [1, 1.035, 0.985, 1], scaleY: [1, 1.018, 0.992, 1] }}
  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
>
          <path
            d="M-35 202 C25 157 75 158 120 193 C166 229 204 208 244 173 C295 130 348 155 435 193 L435 420 L-35 420Z"
            fill="url(#atlas-water-light)"
            opacity=".64"
          />

          <path
            d="M-30 225 C30 184 82 192 130 216 C183 245 222 225 267 196 C315 165 367 190 430 220 L430 420 L-30 420Z"
            fill="#4f9fbd"
            opacity=".43"
          />
        </motion.g>

        {/* موج میانی؛ حرکت مخالف برای ایجاد عمق */}
        <motion.g
          style={{
            x: waterCounterDrift,
            y: waterSurge,
          }}
          animate={{ scaleX: [1, 0.975, 1.035, 1], scaleY: [1, 0.99, 1.016, 1] }}
          transition={{ duration: 2.65, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
        >
          <path
            d="M-40 245 C20 205 72 211 118 246 C162 279 198 267 240 235 C284 201 342 209 430 256 L430 420 L-40 420Z"
            fill="url(#atlas-water-deep)"
            opacity=".85"
          />

          <path
            d="M-35 262 C25 224 78 231 124 263 C172 296 214 280 255 249 C305 212 362 232 430 267"
            fill="none"
            stroke="#c9f7ff"
            strokeWidth="19"
            strokeLinecap="round"
            opacity=".12"
            filter="url(#atlas-water-blur)"
          />
        </motion.g>

        {/* موج جلویی و پرحجم */}
        <motion.g
          style={{
            x: waterDrift,
            y: waterSurge,
          }}
        >
          <path
            d="M-40 298 C22 257 70 267 118 297 C163 325 200 318 241 287 C287 253 342 265 430 308 L430 420 L-40 420Z"
            fill="url(#atlas-water-front)"
          />

          <path
            d="M-25 307 C42 276 79 283 126 310 C171 336 210 329 252 299 C303 264 358 282 425 316"
            fill="none"
            className="atlas-water-glint atlas-water-glint--wide"
            stroke="#e7fcff"
            strokeWidth="12"
            strokeLinecap="round"
            opacity=".13"
          />
        </motion.g>

        {/* انعکاس نور روی سطح */}
        <motion.g
          style={{
            x: waterDrift,
            y: waterSurge,
          }}
        >
          <ellipse
            cx="175"
            cy="233"
            rx="95"
            ry="30"
            fill="url(#atlas-water-reflection)"
            filter="url(#atlas-water-blur)"
            opacity=".55"
          />

          <ellipse
            cx="280"
            cy="286"
            rx="60"
            ry="17"
            fill="url(#atlas-water-reflection)"
            filter="url(#atlas-water-blur)"
            opacity=".35"
          />
        </motion.g>

        {/* درخشش‌های ظریف روی آب */}
        <motion.g
          style={{
            x: waterDrift,
            y: waterSurge,
          }}
        >
          <path
            d="M95 230 Q128 216 157 229"
            stroke="#fff0df"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".38"
          />

          <path
            d="M245 260 Q275 246 305 259"
            className="atlas-water-glint"
            stroke="#d9f8ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity=".34"
          />

          <path
            d="M145 331 Q173 321 197 331"
            className="atlas-water-glint atlas-water-glint--low"
            stroke="#bcefff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".3"
          />
        </motion.g>

        {/* موج حلقه‌ای که با لمس سطح آب ایجاد می‌شود */}
        {waterRippleKey ? (
          <motion.circle
            key={waterRippleKey}
            cx={waterRippleX ?? 200}
            cy={waterRippleY ?? 250}
            initial={{ r: 3, opacity: 0.72, strokeWidth: 2.4 }}
            animate={{ r: 54, opacity: 0, strokeWidth: 0.7 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
            fill="none"
            stroke="#e7fcff"
          />
        ) : null}
      </g>
      </motion.g>

      {/* قطرات کوچک شناور */}
      <circle cx="86" cy="172" r="2.2" fill="#e8fbff" opacity=".7" />
      <circle cx="317" cy="147" r="1.8" fill="#e8fbff" opacity=".65" />
      <circle cx="337" cy="200" r="2" fill="#a8eafa" opacity=".7" />
      <circle cx="67" cy="276" r="1.5" fill="#e8fbff" opacity=".5" />

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
  const [waterRipple, setWaterRipple] = useState({ key: 0, x: 200, y: 250 });
  const waterTouchXRaw = useMotionValue(0);
  const waterTouchYRaw = useMotionValue(0);
  const waterTouchX = useSpring(waterTouchXRaw, { stiffness: 165, damping: 15, mass: 0.55 });
  const waterTouchY = useSpring(waterTouchYRaw, { stiffness: 165, damping: 15, mass: 0.55 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
// حرکت دایره‌ای مردمک با پیشروی اسکرول
const pupilX = useTransform(
  scrollYProgress,
  (progress) => Math.cos(progress * Math.PI * 2) * 10
);

const pupilY = useTransform(
  scrollYProgress,
  (progress) => Math.sin(progress * Math.PI * 2) * 10
);

const waterDrift = useTransform(scrollYProgress, [0, 0.5, 1], [-42, 42, -42]);
const waterCounterDrift = useTransform(
  scrollYProgress,
  [0, 0.5, 1],
  [42, -42, 42]
);
const waterSurge = useTransform(scrollYProgress, [0, 0.5, 1], [-18, 18, -18]);

// پرواز پروانه‌ی تاروت در امتداد اسکرول؛ مسیر نرم و رفت‌وبرگشتی
const tarotButterflyX = useTransform(scrollYProgress, [0, 0.5, 1], [-34, 46, -22]);
const tarotButterflyY = useTransform(scrollYProgress, [0, 0.25, 0.7, 1], [28, -30, 18, -24]);
const tarotButterflyRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-16, 13, -12]);

// چرخش کامل مدار چشم در طول عبور از سکشن
const eyeRotation = useTransform(
  scrollYProgress,
  [0, 1],
  [-35, 325]
);

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
              onPointerMove={(event) => {
                if (activeId !== "dream") return;
                const rect = event.currentTarget.getBoundingClientRect();
                const nx = (event.clientX - rect.left) / rect.width - 0.5;
                const ny = (event.clientY - rect.top) / rect.height - 0.5;
                waterTouchXRaw.set(nx * 24);
                waterTouchYRaw.set(ny * 16);
              }}
              onPointerLeave={() => {
                waterTouchXRaw.set(0);
                waterTouchYRaw.set(0);
              }}
              onPointerDown={(event) => {
                if (activeId !== "dream") return;
                const svg = event.currentTarget.querySelector(".atlas-svg--water");
                const rect = svg?.getBoundingClientRect();
                if (!rect) return;
                const x = Math.max(18, Math.min(382, ((event.clientX - rect.left) / rect.width) * 400));
                const y = Math.max(185, Math.min(370, ((event.clientY - rect.top) / rect.height) * 400));
                setWaterRipple((previous) => ({ key: previous.key + 1, x, y }));
                waterTouchXRaw.set(waterTouchXRaw.get() + (event.clientX < rect.left + rect.width / 2 ? 7 : -7));
                waterTouchYRaw.set(waterTouchYRaw.get() - 5);
              }}
            >
              <span className="atlas-prism atlas-prism--a" aria-hidden="true" />
              <span className="atlas-prism atlas-prism--b" aria-hidden="true" />

              {/* تزئینات اختصاصی هر دنیا */}
              {active.id === "dream" && (
                <div className="atlas-scene-stars" aria-hidden="true">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              )}
              {active.id === "ancient" && (
                <div className="atlas-scene-constellation" aria-hidden="true">
                  <i /><i /><i /><i /><i />
                </div>
              )}
              {active.id === "tarot" && (
                <>
                  <motion.svg
                    className="atlas-tarot-butterfly"
                    viewBox="0 0 100 90"
                    aria-hidden="true"
                    focusable="false"
                    style={{ x: tarotButterflyX, y: tarotButterflyY, rotate: tarotButterflyRotate }}
                  >
                    <defs>
                      <linearGradient id="atlas-butterfly-wing" x1="12" y1="12" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f9d8ed" />
                        <stop offset=".52" stopColor="#c58bb7" />
                        <stop offset="1" stopColor="#80618f" />
                      </linearGradient>
                    </defs>
                    <motion.path d="M49 43C34 5 5 4 8 31C10 48 28 54 47 49C23 54 16 76 31 81C43 85 49 63 50 48Z" fill="url(#atlas-butterfly-wing)" stroke="#f8e5f1" strokeWidth="1.5" style={{ transformOrigin: "50px 47px" }} animate={{ scaleX: [1, .78, 1] }} transition={{ duration: .34, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.path d="M51 43C66 5 95 4 92 31C90 48 72 54 53 49C77 54 84 76 69 81C57 85 51 63 50 48Z" fill="url(#atlas-butterfly-wing)" stroke="#f8e5f1" strokeWidth="1.5" style={{ transformOrigin: "50px 47px" }} animate={{ scaleX: [1, .78, 1] }} transition={{ duration: .34, repeat: Infinity, ease: "easeInOut", delay: .04 }} />
                    <path d="M50 35C47 26 42 22 37 20M50 35C53 26 58 22 63 20" fill="none" stroke="#f5d9e9" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M50 34V66" stroke="#fff2fa" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="28" cy="30" r="4" fill="#fff0fa" opacity=".75" />
                    <circle cx="72" cy="30" r="4" fill="#fff0fa" opacity=".75" />
                  </motion.svg>
                  <div className="atlas-tarot-petals" aria-hidden="true"><i /><i /><i /><i /><i /></div>
                </>
              )}

              {/* پرتو: با کاهش حرکت در CSS پنهان می‌شود */}
              <motion.span
                key={`sweep-${active.id}`}
                className="atlas-sweep"
                aria-hidden="true"
                initial={{ x: "-120%" }}
                animate={{ x: "320%" }}
                transition={{ duration: 1.5, ease: EASE }}
              />

              <div className="atlas-art">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    className="atlas-art-frame"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
<AtlasIllustration
  id={active.id}
  pupilX={active.id === "ancient" ? pupilX : undefined}
  pupilY={active.id === "ancient" ? pupilY : undefined}
  eyeRotation={active.id === "ancient" ? eyeRotation : undefined}
  waterDrift={active.id === "dream" ? waterDrift : undefined}
  waterCounterDrift={
    active.id === "dream" ? waterCounterDrift : undefined
  }
  waterSurge={active.id === "dream" ? waterSurge : undefined}
  waterTouchX={active.id === "dream" ? waterTouchX : undefined}
  waterTouchY={active.id === "dream" ? waterTouchY : undefined}
  waterRippleKey={active.id === "dream" ? waterRipple.key : 0}
  waterRippleX={waterRipple.x}
  waterRippleY={waterRipple.y}
/>
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="atlas-caption">{active.number} از ۰۳</p>
            </motion.div>

            <div
              className="atlas-panel"
              data-category={active.id}
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

              {active.id === "tarot" && (
                <svg className="atlas-panel-flower" viewBox="0 0 180 150" aria-hidden="true" focusable="false">
                  <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M154 148C137 112 139 76 166 30M143 112C112 100 104 80 105 62M151 88C172 79 176 62 173 50" />
                    <path d="M109 66C91 49 94 33 108 27C120 35 120 51 109 66ZM105 83C84 80 74 66 82 53C98 54 107 67 105 83ZM160 57C151 39 157 24 172 20C181 34 174 49 160 57Z" />
                    <path d="M108 27C112 14 128 13 133 26C136 39 123 48 109 39C96 48 83 39 88 26C93 13 105 15 108 27Z" />
                    <circle cx="108" cy="31" r="5" />
                  </g>
                </svg>
              )}
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