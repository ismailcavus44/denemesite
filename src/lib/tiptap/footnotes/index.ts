import Document from "@tiptap/extension-document";
import { FootnoteReference } from "./FootnoteReference";
import { FootnoteItem } from "./FootnoteItem";
import { FootnoteList } from "./FootnoteList";
import { FootnotesKit } from "./footnotes-kit";

/** `block+` gövde + sonda opsiyonel tek footnoteList. */
export const ArticleDocument = Document.extend({
  content: "block+ footnoteList?",
});

export const footnoteExtensions = [
  FootnoteReference,
  FootnoteItem,
  FootnoteList,
  FootnotesKit,
];

export {
  FootnoteReference,
  FootnoteItem,
  FootnoteList,
  FootnotesKit,
};
