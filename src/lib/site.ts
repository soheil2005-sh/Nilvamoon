export const SITE_NAME = "نیلوا‌مون";
export const SITE_NAME_EN = "NilvaMoon";

// آدرس سایت از متغیر محیطی خوانده می‌شود تا هنگام انتشار نهایی
// فقط در Netlify عوض شود و نیازی به دست‌زدن به کد نباشد.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nilvamoontest.netlify.app"
).replace(/\/$/, "");

// تا وقتی true نشده، سایت noindex است (برای نسخه‌ی تست).
export const IS_LIVE = process.env.NEXT_PUBLIC_IS_LIVE === "true";