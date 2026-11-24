import Image from "next/image";

type ExperienceKind = "hafez" | "coffee" | "tarot";

const experiences: {
  id: string;
  kind: ExperienceKind;
  image: string;
  category: string;
  number: string;
  title: string;
  description: string;
  action: string;
  note: string;
}[] = [
  {
    id: "hafez",
    kind: "hafez",
    image: "/images/experiences/hafez.jpg",
    category: "شعر و معنا",
    number: "۰۱",
    title: "فال حافظ",
    description:
      "نیتی در دل کن و به دنیای غزل‌های حافظ قدم بگذار؛ با متن شعر، معنی روان و برداشتی برای تأمل بیشتر.",
    action: "رفتن به دنیای حافظ",
    note: "یک غزل، چند لایه معنا",
  },
  {
    id: "coffee",
    kind: "coffee",
    image: "/images/experiences/coffee.jpg",
    category: "نشانه‌ها و نمادها",
    number: "۰۲",
    title: "فال قهوه",
    description:
      "با نقش‌های فنجان همراه شو و با نمادها و روایت‌های سنتی فال قهوه بیشتر آشنا شو.",
    action: "کشف نقش‌های فنجان",
    note: "روایت نمادها در فنجان",
  },
  {
    id: "tarot",
    kind: "tarot",
    image: "/images/experiences/tarot.jpg",
    category: "کارت و خودشناسی",
    number: "۰۳",
    title: "فال تاروت",
    description:
      "کارت‌ها را به چشم ابزاری نمادین برای مکث، پرسیدن سؤال‌های بهتر و نگاه تازه به موقعیتت ببین.",
    action: "آشنایی با کارت‌ها",
    note: "نمادهایی برای تأمل",
  },
];

export default function Experiences() {
  return (
    <section
      className="experiences-section"
      id="experiences"
      aria-labelledby="experiences-title"
    >
      <div className="experiences-heading">
        <span className="section-eyebrow">✦ مسیرهای کشف و شهود ✦</span>

        <h2 id="experiences-title">
          امروز دلت می‌خواد <span>کدوم دنیا رو کشف کنی؟</span>
        </h2>

        <p>
          از غزل‌های حافظ تا نمادهای تاروت و نقش‌های فنجان؛ راه خودت رو انتخاب
          کن.
        </p>
      </div>

      <div className="nova-grid">
        {experiences.map((item) => (
          <article
            className={`nova-card nova-card--${item.kind}`}
            id={item.id}
            key={item.id}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(max-width: 600px) 92vw, (max-width: 900px) 46vw, 31vw"
              className="nova-image"
            />

            <div className="nova-top">
              <span className="nova-category">{item.category}</span>
              <span className="nova-index">{item.number}</span>
            </div>

            <div className="nova-panel">
              <span className="nova-note">{item.note}</span>

              <h3 className="nova-title">{item.title}</h3>

              <p className="nova-desc">{item.description}</p>

              <div className="nova-footer">
                <span className="nova-action">{item.action}</span>
                <span className="nova-status">در حال آماده‌سازی</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="nova-cta-wrap">
        {/* بعداً که صفحهٔ فال‌ها ساخته شد، فقط href را عوض کن؛ مثلاً href="/fal" */}
        <a href="#experiences" className="glass-cta">
          <span className="glass-cta-label">ادامه فال‌ها</span>
          <span className="glass-cta-arrow" aria-hidden="true">
            ←
          </span>
        </a>
      </div>
    </section>
  );
}