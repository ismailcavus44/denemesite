import Link from "next/link";

const DISCLAIMER_LINK = "/sorumluluk-reddi";

export function LegalDisclaimerMini() {
  return (
    <p className="text-xs text-slate-500">
      Bu sayfa genel bilgilendirme amaçlıdır; hukuki danışmanlık değildir.{" "}
      <Link href={DISCLAIMER_LINK} className="underline hover:text-slate-700">
        Sorumluluk Reddi
      </Link>
    </p>
  );
}
