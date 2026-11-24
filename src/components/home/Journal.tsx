import Image from "next/image";

const topics = [
  {
    key: "psychology",
    number: "۰۱",
    title: "روان‌شناسی و خودشناسی",
    description:
      "نگاهی ساده و کاربردی به احساسات، رابطه‌ها و شناخت بهتر خودمان.",
    tag: "ذهن و احساس",
    image: "/images/journal/psychology.jpg",
  },
  {
    key: "dreams",
    number: "۰۲",
    title: "خواب و نمادها",
    description:
      "آشنایی با نمادهای رایج خواب و راه‌هایی برای فکر کردن به تجربه‌های شخصی.",
    tag: "دنیای خواب",
    image: "/images/journal/dreams.jpg",
  },
  {
    key: "lifestyle",
    number: "۰۳",
    title: "سبک زندگی و آشپزی",
    description: "ایده‌های کوچک و خوش‌حال‌وهوا برای روزمرگی، خانه و آشپزخانه.",
    tag: "زندگی روزمره",
    image: "/images/journal/lifestyle.jpg",
  },
];

export default function Journal() {
  return (
    <section
      className="journal-section"
      id="journal"
      aria-labelledby="journal-title"
    >
      <div className="journal-heading">
        <span className="section-eyebrow">مجله نیلوا‌مون</span>
        <h2 id="journal-title">
          کمی مکث، <span>کمی کشف</span>
        </h2>
        <p>
          اینجا قرار است کنار تجربه‌های نمادین، مطالبی برای شناخت بهتر خودمان و
          لذت بردن از زندگی هم پیدا کنی.
        </p>
      </div>

<div className="nova-grid">
  {topics.map((topic) => (
    <article className={`nova-card nova-card--${topic.key}`} key={topic.key}>
      <Image
        src={topic.image}
        alt=""
        fill
        sizes="(max-width: 600px) 92vw, (max-width: 900px) 46vw, 31vw"
        className="nova-image"
      />

      <div className="nova-top">
        <span className="nova-category">{topic.tag}</span>
        <span className="nova-index">{topic.number}</span>
      </div>

      <div className="nova-panel">
        <h3 className="nova-title">{topic.title}</h3>
        <p className="nova-desc">{topic.description}</p>
        <div className="nova-footer">
          <span className="nova-action">به‌زودی در مجله</span>
          <span className="nova-status">در حال نگارش</span>
        </div>
      </div>
    </article>
  ))}
</div>
    </section>
  );
}