"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const PREVIEW_LINES = 4;
const LINE_HEIGHT = 1.75;

type QuestionBodyAccordionProps = {
  body: string;
};

export function QuestionBodyAccordion({ body }: QuestionBodyAccordionProps) {
  const [open, setOpen] = useState(false);
  const lines = body.trim().split("\n");
  const isLong = lines.length > PREVIEW_LINES;
  const previewText = isLong
    ? lines.slice(0, PREVIEW_LINES).join("\n")
    : body.trim();

  return (
    <section className="rounded-2xl border border-slate-100 bg-white shadow-lg">
      <div className="border-l-4 border-slate-800 pl-4 sm:pl-5">
        <div className="flex items-center gap-2 py-3">
          <MessageCircle className="size-5 text-slate-700" aria-hidden />
          <span className="text-sm font-semibold text-slate-800">
            Gerçek Kullanıcı Sorusu
          </span>
        </div>
        <div className="m-0 pb-4 text-slate-700 leading-7" data-nosnippet>
          <AnimatePresence mode="wait">
            {!open && (
              <motion.p
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="m-0 whitespace-pre-line text-sm"
                style={{
                  lineHeight: LINE_HEIGHT,
                  maxHeight: isLong
                    ? `${PREVIEW_LINES * LINE_HEIGHT}em`
                    : "none",
                  overflow: "hidden",
                }}
              >
                {previewText}
              </motion.p>
            )}
            {open && (
              <motion.p
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="m-0 whitespace-pre-line text-sm"
                style={{ lineHeight: LINE_HEIGHT }}
              >
                {body.trim()}
              </motion.p>
            )}
          </AnimatePresence>
          {isLong && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-800 hover:underline"
            >
              {open ? (
                <>
                  <ChevronUp className="size-4" />
                  Gizle
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  Devamını gör
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
