import { siteConfig } from "@/lib/site";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true" fill="currentColor">
      <path d="M14.23 10.16 21.2 2h-1.65l-6.06 7.1L8.65 2H2.5l7.33 10.64L2.5 22h1.65l6.4-7.5L15.35 22H21.5l-7.27-11.84Zm-2.26 2.65-.74-1.06-5.9-8.44h2.54l4.76 6.81.74 1.06 6.19 8.85h-2.54l-5.05-7.22Z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1h1.3V3h-2.2C12.4 3 11 4.5 11 6.7v1.8H9v2.7h2V21h3.5v-9.8h2.3l.3-2.7h-2.6Z" />
    </svg>
  );
}

const linkClass =
  "inline-flex items-center justify-center text-slate-900 no-underline transition-colors duration-150 hover:text-primary";

export function ArticleShare() {
  return (
    <div className="flex shrink-0 items-center gap-3.5">
      <a
        href={siteConfig.social.instagram}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Instagram'da YasalHaklarınız"
        className={linkClass}
      >
        <IconInstagram />
      </a>
      <a
        href={siteConfig.social.x}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="X'te YasalHaklarınız"
        className={linkClass}
      >
        <IconX />
      </a>
      <a
        href={siteConfig.social.facebook}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Facebook'ta YasalHaklarınız"
        className={linkClass}
      >
        <IconFacebook />
      </a>
    </div>
  );
}
