import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import type { Transaction } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node as PMNode, Schema } from "@tiptap/pm/model";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    footnoteReference: {
      insertFootnote: () => ReturnType;
    };
  }
}

export const footnotePluginKey = new PluginKey<{
  numbers: Map<string, number>;
}>("footnotes");

/** Gövde içindeki referans id’leri (footnoteList’e inmeden), ilk görünüş sırası. */
export function collectReferenceIdsFromPM(doc: PMNode): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();

  doc.descendants((node) => {
    if (node.type.name === "footnoteList") return false;
    if (node.type.name === "footnoteReference") {
      const id = node.attrs.footnoteId as string | null;
      if (id && !seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
    return undefined;
  });

  return ids;
}

function findFootnoteList(
  doc: PMNode,
): { pos: number; node: PMNode } | null {
  let found: { pos: number; node: PMNode } | null = null;
  doc.forEach((child, offset) => {
    if (child.type.name === "footnoteList") {
      found = { pos: offset, node: child };
    }
  });
  return found;
}

function emptyItem(schema: Schema, footnoteId: string): PMNode {
  return schema.nodes.footnoteItem.create(
    { footnoteId },
    schema.nodes.paragraph.create(),
  );
}

/**
 * Referans sırasına göre listeyi senkronize et; yetim item’ları düşür.
 * Değişiklik yoksa null.
 */
export function buildFootnoteSyncTr(state: {
  doc: PMNode;
  schema: Schema;
  tr: Transaction;
}): Transaction | null {
  const { doc, schema } = state;
  const orderedIds = collectReferenceIdsFromPM(doc);
  const listInfo = findFootnoteList(doc);

  if (orderedIds.length === 0) {
    if (!listInfo) return null;
    const tr = state.tr.delete(
      listInfo.pos,
      listInfo.pos + listInfo.node.nodeSize,
    );
    return tr.docChanged ? tr : null;
  }

  const existing = new Map<string, PMNode>();
  if (listInfo) {
    listInfo.node.forEach((item) => {
      if (item.type.name !== "footnoteItem") return;
      const id = item.attrs.footnoteId as string | null;
      if (id && !existing.has(id)) existing.set(id, item);
    });
  }

  const nextItems = orderedIds.map(
    (id) => existing.get(id) ?? emptyItem(schema, id),
  );

  let same = false;
  if (listInfo && listInfo.node.childCount === nextItems.length) {
    same = true;
    for (let i = 0; i < nextItems.length; i++) {
      const cur = listInfo.node.child(i);
      const next = nextItems[i];
      if (cur.attrs.footnoteId !== next.attrs.footnoteId || !cur.eq(next)) {
        same = false;
        break;
      }
    }
  }

  let tr = state.tr;

  if (!listInfo) {
    const list = schema.nodes.footnoteList.create(null, nextItems);
    tr = tr.insert(doc.content.size, list);
  } else if (!same) {
    const list = schema.nodes.footnoteList.create(null, nextItems);
    tr = tr.replaceWith(
      listInfo.pos,
      listInfo.pos + listInfo.node.nodeSize,
      list,
    );
  }

  return tr.docChanged ? tr : null;
}

/**
 * Silinen footnoteItem id’leri için gövde referanslarını kaldır.
 */
export function removeOrphanReferencesTr(
  oldDoc: PMNode,
  newDoc: PMNode,
  tr: Transaction,
): Transaction | null {
  const oldList = findFootnoteList(oldDoc);
  const newList = findFootnoteList(newDoc);
  if (!oldList) return null;

  const oldIds = new Set<string>();
  oldList.node.forEach((item) => {
    if (item.type.name === "footnoteItem" && item.attrs.footnoteId) {
      oldIds.add(item.attrs.footnoteId as string);
    }
  });

  const newIds = new Set<string>();
  if (newList) {
    newList.node.forEach((item) => {
      if (item.type.name === "footnoteItem" && item.attrs.footnoteId) {
        newIds.add(item.attrs.footnoteId as string);
      }
    });
  }

  const removed: string[] = [];
  oldIds.forEach((id) => {
    if (!newIds.has(id)) removed.push(id);
  });
  if (removed.length === 0) return null;

  const stillReferenced = new Set(collectReferenceIdsFromPM(newDoc));
  const toDelete = removed.filter((id) => stillReferenced.has(id));
  if (toDelete.length === 0) return null;

  const deleteSet = new Set(toDelete);
  const positions: { from: number; to: number }[] = [];

  newDoc.descendants((node, pos) => {
    if (node.type.name === "footnoteList") return false;
    if (
      node.type.name === "footnoteReference" &&
      deleteSet.has(node.attrs.footnoteId as string)
    ) {
      positions.push({ from: pos, to: pos + node.nodeSize });
    }
    return undefined;
  });

  if (positions.length === 0) return null;

  positions.sort((a, b) => b.from - a.from);
  let next = tr;
  for (const { from, to } of positions) {
    next = next.delete(from, to);
  }
  return next.docChanged ? next : null;
}

function buildDecorations(doc: PMNode): DecorationSet {
  const ids = collectReferenceIdsFromPM(doc);
  const numbers = new Map(ids.map((id, i) => [id, i + 1]));
  const decos: Decoration[] = [];

  doc.descendants((node, pos) => {
    if (node.type.name === "footnoteReference") {
      const id = node.attrs.footnoteId as string | null;
      const n = id ? numbers.get(id) : undefined;
      if (n != null) {
        decos.push(
          Decoration.node(pos, pos + node.nodeSize, {
            "data-n": String(n),
            title: `Dipnot ${n}`,
          }),
        );
      }
    }
    if (node.type.name === "footnoteItem") {
      const id = node.attrs.footnoteId as string | null;
      const n = id ? numbers.get(id) : undefined;
      if (n != null) {
        decos.push(
          Decoration.node(pos, pos + node.nodeSize, {
            "data-n": String(n),
          }),
        );
        decos.push(
          Decoration.widget(
            pos + 1,
            () => {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "footnote-back";
              btn.textContent = "↩";
              btn.title = `Metindeki ${n} numarasına dön`;
              btn.setAttribute("data-footnote-back", id ?? "");
              btn.addEventListener("mousedown", (e) => {
                e.preventDefault();
                e.stopPropagation();
              });
              return btn;
            },
            { side: -1, key: `fn-back-${id}` },
          ),
        );
      }
    }
    return undefined;
  });

  return DecorationSet.create(doc, decos);
}

function scrollToFootnoteItem(editor: Editor, footnoteId: string) {
  const el = editor.view.dom.querySelector(
    `.footnote-item[data-footnote-id="${CSS.escape(footnoteId)}"]`,
  );
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollToFootnoteRef(editor: Editor, footnoteId: string) {
  const el = editor.view.dom.querySelector(
    `sup.footnote-reference[data-footnote-id="${CSS.escape(footnoteId)}"]`,
  );
  el?.scrollIntoView({ behavior: "smooth", block: "center" });

  let found: number | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "footnoteList") return false;
    if (
      node.type.name === "footnoteReference" &&
      node.attrs.footnoteId === footnoteId
    ) {
      found = pos;
      return false;
    }
    return undefined;
  });
  if (found != null) {
    editor.chain().focus().setTextSelection(found + 1).run();
  }
}

export const FootnotesKit = Extension.create({
  name: "footnotesKit",

  addCommands() {
    return {
      insertFootnote:
        () =>
        ({ state, dispatch, editor }) => {
          const { schema, selection } = state;
          for (let d = selection.$from.depth; d > 0; d--) {
            if (selection.$from.node(d).type.name === "footnoteList") {
              return false;
            }
          }

          const footnoteId =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `fn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

          const ref = schema.nodes.footnoteReference.create({ footnoteId });
          const item = emptyItem(schema, footnoteId);

          let tr = state.tr.replaceSelectionWith(ref, false);
          const listInfo = findFootnoteList(tr.doc);

          if (listInfo) {
            const insertAt = listInfo.pos + listInfo.node.nodeSize - 1;
            tr = tr.insert(insertAt, item);
            tr = tr.setSelection(
              TextSelection.near(tr.doc.resolve(insertAt + 2)),
            );
          } else {
            const list = schema.nodes.footnoteList.create(null, item);
            const at = tr.doc.content.size;
            tr = tr.insert(at, list);
            tr = tr.setSelection(
              TextSelection.near(tr.doc.resolve(at + 2)),
            );
          }

          tr = tr.scrollIntoView();
          if (dispatch) dispatch(tr);

          queueMicrotask(() => {
            scrollToFootnoteItem(editor, footnoteId);
          });

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: footnotePluginKey,

        state: {
          init: (_, state) => ({
            numbers: new Map(
              collectReferenceIdsFromPM(state.doc).map((id, i) => [id, i + 1]),
            ),
          }),
          apply: (tr, value, _old, state) => {
            if (!tr.docChanged) return value;
            return {
              numbers: new Map(
                collectReferenceIdsFromPM(state.doc).map((id, i) => [
                  id,
                  i + 1,
                ]),
              ),
            };
          },
        },

        appendTransaction(transactions, oldState, newState) {
          if (!transactions.some((t) => t.docChanged)) return null;

          const orphanTr = removeOrphanReferencesTr(
            oldState.doc,
            newState.doc,
            newState.tr,
          );
          if (orphanTr) {
            const synced = buildFootnoteSyncTr({
              doc: orphanTr.doc,
              schema: newState.schema,
              tr: orphanTr,
            });
            return synced ?? orphanTr;
          }

          return buildFootnoteSyncTr({
            doc: newState.doc,
            schema: newState.schema,
            tr: newState.tr,
          });
        },

        props: {
          decorations(state) {
            return buildDecorations(state.doc);
          },

          handleClickOn(_view, _pos, node) {
            if (node.type.name === "footnoteReference") {
              const id = node.attrs.footnoteId as string | null;
              if (!id) return false;
              scrollToFootnoteItem(editor, id);
              return true;
            }
            return false;
          },

          handleDOMEvents: {
            click(_view, event) {
              const t = event.target as HTMLElement | null;
              const back = t?.closest?.("[data-footnote-back]") as
                | HTMLElement
                | null;
              if (!back) return false;
              const id = back.getAttribute("data-footnote-back");
              if (!id) return false;
              event.preventDefault();
              scrollToFootnoteRef(editor, id);
              return true;
            },
          },
        },
      }),
    ];
  },
});
