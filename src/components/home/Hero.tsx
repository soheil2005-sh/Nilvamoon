type CardVariant = "moon" | "sun" | "star";

function TarotArtwork({ variant }: { variant: CardVariant }) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="tarot-artwork"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="9"
        y="9"
        width="222"
        height="342"
        rx="12"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="17"
        y="17"
        width="206"
        height="326"
        rx="8"
        stroke="currentColor"
        strokeOpacity=".55"
      />

      <path
        d="M120 28V45M120 315V332M28 180H43M197 180H212"
        stroke="currentColor"
        strokeOpacity=".7"
      />
      <path
        d="M120 52L126 63L138 65L129 74L131 86L120 80L109 86L111 74L102 65L114 63Z"
        fill="#D9B66F"
      />

      {variant === "moon" && (
        <>
          <circle cx="120" cy="166" r="69" stroke="#D9B66F" strokeWidth="1.2" />
          <circle
            cx="120"
            cy="166"
            r="57"
            stroke="currentColor"
            strokeOpacity=".55"
          />
          <path
            d="M139 113C103 120 93 166 116 193C132 211 154 211 169 199C154 235 106 241 79 211C49 178 69 121 111 106C121 102 132 105 139 113Z"
            fill="#D9B66F"
          />
          <path
            d="M64 264L120 226L176 264M78 275H162"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="70" cy="105" r="3" fill="#D9B66F" />
          <circle cx="180" cy="128" r="2.5" fill="#D9B66F" />
          <circle cx="76" cy="220" r="2" fill="#D9B66F" />
          <circle cx="171" cy="231" r="3" fill="#D9B66F" />
        </>
      )}

      {variant === "sun" && (
        <>
          <circle cx="120" cy="165" r="48" stroke="#D9B66F" strokeWidth="1.5" />
          <circle
            cx="120"
            cy="165"
            r="35"
            fill="#D9B66F"
            fillOpacity=".2"
            stroke="#D9B66F"
          />
          <circle cx="120" cy="165" r="20" fill="#D9B66F" fillOpacity=".65" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d="M120 103V88"
              stroke="#D9B66F"
              strokeWidth="1.5"
              transform={`rotate(${i * 30} 120 165)`}
            />
          ))}
          <path
            d="M70 245L120 216L170 245M84 258H156M96 271H144"
            stroke="currentColor"
          />
          <path
            d="M93 125L120 109L147 125M93 205L120 221L147 205"
            stroke="currentColor"
            strokeOpacity=".65"
          />
        </>
      )}

      {variant === "star" && (
        <>
          <circle cx="120" cy="166" r="67" stroke="#D9B66F" />
          <circle
            cx="120"
            cy="166"
            r="49"
            stroke="currentColor"
            strokeOpacity=".6"
          />
          <path
            d="M120 108L133 151L178 166L133 180L120 224L106 180L62 166L106 151Z"
            stroke="#D9B66F"
            strokeWidth="1.4"
            fill="#D9B66F"
            fillOpacity=".18"
          />
          <path
            d="M120 126L130 156L160 166L130 176L120 206L110 176L80 166L110 156Z"
            fill="#D9B66F"
            fillOpacity=".55"
          />
          <circle cx="120" cy="166" r="8" fill="#F2D9A0" />
          <path d="M77 255L120 231L163 255M90 268H150" stroke="currentColor" />
        </>
      )}

      <path
        d="M48 42L55 49L48 56L41 49Z M192 42L199 49L192 56L185 49Z M48 304L55 311L48 318L41 311Z M192 304L199 311L192 318L185 311Z"
        stroke="#D9B66F"
      />

      <text
        x="120"
        y="326"
        textAnchor="middle"
        fill="currentColor"
        fontSize="8"
        letterSpacing="2"
      >
        NILVAMOON
      </text>
    </svg>
  );
}

function TarotCard({
  variant,
  className,
}: {
  variant: CardVariant;
  className: string;
}) {
  return (
    <div className={`tarot-card ${className}`}>
      <TarotArtwork variant={variant} />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="hero-content">
        <div className="hero-copy">
          <span className="hero-eyebrow">✦ فال آنلاین ، تاروت و حافظ ✦</span>

          <h1>
            فال حافظ ، تاروت و قهوه به سبک <span>نیلوا‌مون</span>
          </h1>

          <p className="hero-welcome">به نیلوا‌مون خوش اومدی</p>

          <p className="hero-description">
            اینجا میتونی همین الان فال حافظ بگیری، کارت‌ های تاروت رو بچینی یا
            سراغ فال قهوه بری؛ ساده، صمیمی و با حال‌ و‌ هوای خودت.
          </p>

          <a href="#experiences" className="hero-button">
            شروع فال و کشف
            <span aria-hidden="true">←</span>
          </a>

          <div className="hero-note">
            <span />
            واقعی ، رایگان ، سریع و ساده
          </div>
        </div>
        <div className="hero-visual" aria-label="سه کارت نمادین تاروت">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-spark spark-one">✦</div>
          <div className="hero-spark spark-two">✧</div>
          <div className="hero-spark spark-three">✦</div>

          <TarotCard variant="moon" className="card-moon" />
          <TarotCard variant="sun" className="card-sun" />
          <TarotCard variant="star" className="card-star" />

          <div className="hero-visual-caption">
            <span>هنر کشف خویشتن</span>
            <span>✧</span>
          </div>
        </div>
      </div>

      <div className="hero-bottom">
        <span>برای دیدن فال حافظ، تاروت و قهوه برو پایین</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
