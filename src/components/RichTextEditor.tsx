import { useState, useCallback, useRef } from "react";
import { $getSelection, $createParagraphNode, $createTextNode } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useEffect } from "react";
import {
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  ListNode,
  ListItemNode,
} from "@lexical/list";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from "react-icons/md";
import { BsListUl, BsListOl } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import EmojiPickerModal from "./EmojiPickerModal";
import {
  extractTextFromEditorState,
  extractHtmlFromEditorState,
  clearEditorContent,
  richTextTheme,
} from "../utils/richTextUtils";
import { type EmojiClickData } from "emoji-picker-react";
import { GrAttachment } from "react-icons/gr";

interface IRichTextEditorProps {
  onSendMessage: (message: string, htmlContent?: string) => void;
  isLoading: boolean;
}

// Toolbar component
function ToolbarPlugin({ onEmojiClick }: { onEmojiClick: () => void }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));

        // Update block type based on current selection
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if (element.getType() === "heading") {
          const headingElement = element as any; // eslint-disable-line @typescript-eslint/no-explicit-any
          setBlockType(headingElement.getTag());
        } else {
          setBlockType("paragraph");
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    const unregisterSelectionChange = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const unregisterFormatChange = editor.registerCommand(
      FORMAT_TEXT_COMMAND,
      () => {
        // Update toolbar after format command
        setTimeout(() => updateToolbar(), 10);
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      unregisterSelectionChange();
      unregisterFormatChange();
    };
  }, [editor, updateToolbar]);

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.focus();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertList = (listType: "bullet" | "number") => {
    editor.focus();
    if (listType === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatParagraph = (format: string) => {
    editor.focus();
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Get the anchor node (where cursor is)
        const anchorNode = selection.anchor.getNode();
        const targetNode = anchorNode.getTopLevelElementOrThrow();

        // Get the text content to preserve it
        const textContent = targetNode.getTextContent();

        // Create new node based on format
        let newNode;
        if (format === "paragraph") {
          newNode = $createParagraphNode();
        } else if (format === "h1" || format === "h2") {
          newNode = $createHeadingNode(format as "h1" | "h2");
        }

        if (newNode) {
          // Add text content to new node
          if (textContent) {
            const textNode = $createTextNode(textContent);
            newNode.append(textNode);
          }

          // Replace the current node
          targetNode.replace(newNode);

          // Set selection to the end of the new node
          newNode.selectEnd();
        }
      }
    });

    setBlockType(format);
    setShowBlockDropdown(false);
  };

  const getBlockTypeLabel = (type: string) => {
    switch (type) {
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      default:
        return "Paragraph";
    }
  };

  return (
    <div className="flex items-center gap-1 p-2">
      {/* Block Type Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowBlockDropdown(!showBlockDropdown)}
          className="p-2 rounded hover:bg-gray-100 text-black cursor-pointer flex items-center gap-1 min-w-[100px]"
          title="Block Type"
        >
          <span className="text-sm">{getBlockTypeLabel(blockType)}</span>
          <MdArrowDropDown className="w-4 h-4" />
        </button>
        {showBlockDropdown && (
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
            {["paragraph", "h1", "h2"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => formatParagraph(type)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-black"
              >
                {getBlockTypeLabel(type)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => formatText("bold")}
        className={`p-2 rounded hover:bg-gray-100 text-black cursor-pointer ${
          isBold ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Bold (Ctrl+B)"
      >
        <MdFormatBold className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => formatText("italic")}
        className={`p-2 rounded hover:bg-gray-100 text-black cursor-pointer ${
          isItalic ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Italic (Ctrl+I)"
      >
        <MdFormatItalic className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => formatText("underline")}
        className={`p-2 rounded hover:bg-gray-100 text-black cursor-pointer ${
          isUnderline ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Underline (Ctrl+U)"
      >
        <MdFormatUnderlined className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => insertList("bullet")}
        className="p-2 rounded hover:bg-gray-100 text-black cursor-pointer"
        title="Bullet List"
      >
        <BsListUl className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => insertList("number")}
        className="p-2 rounded hover:bg-gray-100 text-black cursor-pointer"
        title="Numbered List"
      >
        <BsListOl className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={onEmojiClick}
        className="p-2 rounded hover:bg-gray-100 text-black cursor-pointer"
        title="Add Emoji"
      >
        <BsEmojiSmile className="w-5 h-5" />
      </button>
    </div>
  );
}

// Plugin to set editor reference
function EditorRefPlugin({
  editorRef,
}: {
  editorRef: React.MutableRefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);

  return null;
}

const RichTextEditor = ({ onSendMessage, isLoading }: IRichTextEditorProps) => {
  const [editorState, setEditorState] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editorRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const initialConfig = {
    namespace: "RichTextEditor",
    nodes: [ListNode, ListItemNode, HeadingNode],
    theme: {
      ...richTextTheme,
      heading: {
        h1: "text-2xl font-bold mb-2",
        h2: "text-xl font-bold mb-2",
      },
    },
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorChange = (editorState: any) => {
    const textContent = extractTextFromEditorState(editorState);
    setEditorState(textContent);
  };

  const handleSend = () => {
    if (!editorRef.current || isLoading) return;

    const textContent = extractTextFromEditorState(
      editorRef.current.getEditorState()
    ).trim();

    const htmlContent = extractHtmlFromEditorState(
      editorRef.current.getEditorState()
    ).trim();

    if (textContent) {
      onSendMessage(textContent, htmlContent);
      clearEditorContent(editorRef.current);
      setEditorState("");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (editorRef.current) {
      editorRef.current.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText(emojiData.emoji);
        }
      });
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiButtonClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    toggleEmojiPicker();
  };

  return (
    <div className="w-full h-full flex flex-col rounded-xl relative">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex-1 bg-white rounded-t-xl flex flex-col">
          <ToolbarPlugin onEmojiClick={handleEmojiButtonClick} />
          <div className="flex-1 relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="w-full h-full p-4 text-black outline-none resize-none min-h-[100px] max-h-[200px] overflow-y-auto" />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                  {isLoading ? "AI is thinking..." : "Ask me anything ..."}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleEditorChange} />
            <HistoryPlugin />
            <ListPlugin />
            <EditorRefPlugin editorRef={editorRef} />
          </div>
        </div>
        <div className="w-full h-[62px] bg-white border-t-2 border-gray-300 p-4 flex items-center justify-between rounded-b-xl">
          <button className="w-fit h-fit py-[9px] px-[12px] rounded-lg shadow-md border-1 border-gray-200 cursor-pointer flex items-center justify-center">
            <GrAttachment className="text-black w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!editorState.trim() || isLoading}
            className={`w-fit ${
              editorState.trim() && !isLoading
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] cursor-pointer"
                : "bg-[#60A5FA] cursor-not-allowed"
            } text-white rounded-lg py-[9px] px-[12px] outline-none flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_#0000000F] transition-colors`}
          >
            {isLoading ? (
              "..."
            ) : (
              <>
                Send
                <RiSendPlaneFill className="text-white w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </LexicalComposer>

      <EmojiPickerModal
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiClick={handleEmojiClick}
      />
    </div>
  );
};

export default RichTextEditor;
