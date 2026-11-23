const experiences = [
  {
    category: "فال حافظ",
    symbol: "✧",
    title: "غزل با معنی و تفسیر",
    description:
      "نیت کن و غزل حافظ رو باز کن؛ هم شعر رو بخون و هم معنی و پیامش رو برای امروز و نیتت ببین.",
    link: "#fortunes",
    className: "experience-fortune",
    action: "گرفتن فال حافظ",
  },
  {
    category: "فال قهوه",
    symbol: "☕",
    title: "تعبیر و تفسیر نقش های فنجان قهوه",
    description:
      "سراغ نشانه ها و شکل های توی فنجان قهوه برو و ببین چه پیام و روایتی برات شکل گرفته.",
    link: "#coffee",
    className: "experience-coffee",
    action: "دیدن فال قهوه",
  },
  {
    category: "تاروت",
    symbol: "☾",
    title: "فال تاروت روزانه و احساسی",
    description:
      "کارت‌های تاروت رو با فکر به نیت‌ات انتخاب کن و با دریچه‌ای دیگه به مسیر پیش‌روت نگاه کن!",
    link: "#tarot",
    className: "experience-tarot",
    action: "کشف دنیای تاروت",
  },
];

export default function Experiences() {
  return (
    <section className="experiences-section" id="experiences">
      <div className="experiences-heading">
        <span className="section-eyebrow">مسیرهای کشف و شهود</span>

        <h2>
          کدوم فال رو امروز <span>میخوای؟</span>
        </h2>

        <p>
          هر فال دنیای خودش رو داره؛ هر کدوم که امروز بیشتر به دلت میشینه رو
          انتخاب کن.
        </p>
      </div>

      <div className="experiences-grid">
        {experiences.map((item) => (
          <article
            className={`experience-card ${item.className}`}
            key={item.category}
          >
            <div className="experience-card-top">
              <span className="experience-category">{item.category}</span>
              <span className="experience-symbol">{item.symbol}</span>
            </div>

            <div className="experience-card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <a href={item.link}>
                {item.action}
                <span aria-hidden="true"> ←</span>
              </a>
            </div>

            <div className="experience-card-orbit" />
          </article>
        ))}
      </div>
    </section>
  );
}
