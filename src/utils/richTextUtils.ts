import {
  $getRoot,
  $createParagraphNode,
  $isTextNode,
  $isElementNode,
} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode, $isListItemNode } from "@lexical/list";

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
 * Converts a Lexical node to HTML string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nodeToHtml(node: any): string {
  if ($isTextNode(node)) {
    let text = node.getTextContent();
    if (node.hasFormat("bold")) text = `<strong>${text}</strong>`;
    if (node.hasFormat("italic")) text = `<em>${text}</em>`;
    if (node.hasFormat("underline")) text = `<u>${text}</u>`;
    return text;
  }

  if ($isHeadingNode(node)) {
    const tag = node.getTag();
    const children = node.getChildren().map(nodeToHtml).join("");
    return `<${tag}>${children}</${tag}>`;
  }

  if ($isListNode(node)) {
    const tag = node.getListType() === "bullet" ? "ul" : "ol";
    const children = node.getChildren().map(nodeToHtml).join("");
    return `<${tag}>${children}</${tag}>`;
  }

  if ($isListItemNode(node)) {
    const children = node.getChildren().map(nodeToHtml).join("");
    return `<li>${children}</li>`;
  }

  if ($isElementNode(node)) {
    const children = node.getChildren().map(nodeToHtml).join("");
    return node.getType() === "paragraph" ? `<p>${children}</p>` : children;
  }

  return node.getTextContent();
}

/**
 * Extracts HTML content from the Lexical editor state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractHtmlFromEditorState = (editorState: any): string => {
  let htmlContent = "";
  try {
    editorState.read(() => {
      const root = $getRoot();
      const children = root.getChildren();
      htmlContent = children.map(nodeToHtml).join("");
    });
  } catch (error) {
    console.warn(
      "Failed to generate HTML from editor state, falling back to text:",
      error
    );
    // Fallback to plain text if HTML generation fails
    editorState.read(() => {
      const root = $getRoot();
      htmlContent = root.getTextContent();
    });
  }
  return htmlContent;
};

/**
 * Clears the content of the Lexical editor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearEditorContent = (editor: any): void => {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    root.append($createParagraphNode());
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
