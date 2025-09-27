import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiClick: (emojiData: EmojiClickData) => void;
}

const EmojiPickerModal = ({
  isOpen,
  onClose,
  onEmojiClick,
}: EmojiPickerModalProps) => {
  if (!isOpen) return null;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiClick(emojiData);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={450}
            searchPlaceholder="Search emojis..."
            previewConfig={{
              showPreview: false,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EmojiPickerModal;
