import { CollapsibleSection } from "./CollapsibleSection";
import { TextAreaItemList } from "./TextAreaItemList";

interface StyleSettingsProps {
  styleAll: string[];
  setStyleAll: (styles: string[]) => void;
  styleChat: string[];
  setStyleChat: (styles: string[]) => void;
  stylePost: string[];
  setStylePost: (styles: string[]) => void;
  initiallyOpen?: {
    all?: boolean;
    chat?: boolean;
    post?: boolean;
  };
}

export function StyleSettings({
  styleAll,
  setStyleAll,
  styleChat,
  setStyleChat,
  stylePost,
  setStylePost,
  initiallyOpen = {},
}: StyleSettingsProps) {
  return (
    <div className="space-y-3">
      {/* All Style Rules */}
      <CollapsibleSection
        title="All Style Rules"
        initiallyOpen={initiallyOpen.all}
      >
        <TextAreaItemList
          items={styleAll}
          setItems={setStyleAll}
          placeholder="Add style rule for all content"
        />
      </CollapsibleSection>

      {/* Chat Style Rules */}
      <CollapsibleSection
        title="Chat Style Rules"
        initiallyOpen={initiallyOpen.chat}
      >
        <TextAreaItemList
          items={styleChat}
          setItems={setStyleChat}
          placeholder="Add style rule for chat messages"
        />
      </CollapsibleSection>

      {/* Post Style Rules */}
      <CollapsibleSection
        title="Post Style Rules"
        initiallyOpen={initiallyOpen.post}
      >
        <TextAreaItemList
          items={stylePost}
          setItems={setStylePost}
          placeholder="Add style rule for posts"
        />
      </CollapsibleSection>
    </div>
  );
}
