import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CategoryPillarProps = {
  pillarMd: string;
};

const mdComponents = {
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-4 mb-2 text-base font-semibold text-slate-900 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 text-slate-600 leading-7 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc pl-6 text-slate-600 leading-7">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal pl-6 text-slate-600 leading-7">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
};

function parsePillarSections(md: string): { title: string; body: string }[] {
  const parts = md.trim().split(/\n(?=## )/);
  return parts
    .map((block) => {
      const firstLineEnd = block.indexOf("\n");
      const firstLine = firstLineEnd === -1 ? block : block.slice(0, firstLineEnd);
      if (!firstLine.startsWith("## ")) return null;
      const body = firstLineEnd === -1 ? "" : block.slice(firstLineEnd + 1).trim();
      const title = firstLine.replace(/^##\s*/, "").trim();
      return title ? { title, body } : null;
    })
    .filter((s): s is { title: string; body: string } => Boolean(s));
}

export function CategoryPillar({ pillarMd }: CategoryPillarProps) {
  const sections = parsePillarSections(pillarMd);
  if (sections.length === 0) return null;

  return (
    <article className="max-w-none">
      <Accordion type="single" collapsible className="w-full">
        {sections.map((section, i) => (
          <AccordionItem key={i} value={`pillar-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-none text-slate-600">
                <ReactMarkdown components={mdComponents}>
                  {section.body}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </article>
  );
}
