import { CollapsibleSection } from "./CollapsibleSection";
import { TextAreaItemList } from "./TextAreaItemList";

interface ContentSectionsProps {
  bioItems: string[];
  setBioItems: (items: string[]) => void;
  loreItems: string[];
  setLoreItems: (items: string[]) => void;
  knowledgeItems: string[];
  setKnowledgeItems: (items: string[]) => void;
  initiallyOpen?: {
    bio?: boolean;
    lore?: boolean;
    knowledge?: boolean;
  };
}

export function ContentSections({
  bioItems,
  setBioItems,
  loreItems,
  setLoreItems,
  knowledgeItems,
  setKnowledgeItems,
  initiallyOpen = {},
}: ContentSectionsProps) {
  return (
    <div className="space-y-3">
      {/* Bio Section */}
      <CollapsibleSection title="Bio" initiallyOpen={initiallyOpen.bio}>
        <TextAreaItemList
          items={bioItems}
          setItems={setBioItems}
          placeholder="Add bio information"
        />
      </CollapsibleSection>

      {/* Lore Section */}
      <CollapsibleSection title="Lore" initiallyOpen={initiallyOpen.lore}>
        <TextAreaItemList
          items={loreItems}
          setItems={setLoreItems}
          placeholder="Add lore information"
        />
      </CollapsibleSection>

      {/* Knowledge Section */}
      <CollapsibleSection
        title="Knowledge"
        initiallyOpen={initiallyOpen.knowledge}
      >
        <TextAreaItemList
          items={knowledgeItems}
          setItems={setKnowledgeItems}
          placeholder="Add knowledge information"
        />
      </CollapsibleSection>
    </div>
  );
}
