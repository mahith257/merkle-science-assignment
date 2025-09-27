import { $getRoot } from "lexical";

/**
 * Extracts plain text content from the Lexical editor state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractTextFromEditorState = (editorState: any): string => {
  let textContent = "";
  editorState.read(() => {
    const root = $getRoot();
    textContent = root.getTextContent();
  });
  return textContent;
};

/**
 * Clears the content of the Lexical editor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearEditorContent = (editor: any): void => {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
  });
};

/**
 * Inserts text at the current cursor position in the Lexical editor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const insertTextAtCursor = (editor: any, text: string): void => {
  editor.update(() => {
    const selection = editor.getEditorState().read(() => {
      return editor.getEditorState()._selection;
    });

    if (selection) {
      selection.insertText(text);
    }
  });
};

/**
 * Rich text editor theme configuration
 */
export const richTextTheme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  list: {
    nested: {
      listitem: "list-item",
    },
    ol: "list-decimal list-inside",
    ul: "list-disc list-inside",
    listitem: "list-item",
  },
};

/**
 * Initial configuration for the Lexical editor
 */
export const createEditorConfig = (namespace: string = "RichTextEditor") => ({
  namespace,
  nodes: [], // Will be populated with required nodes
  theme: richTextTheme,
  onError: (error: Error) => {
    console.error("Lexical error:", error);
  },
});
