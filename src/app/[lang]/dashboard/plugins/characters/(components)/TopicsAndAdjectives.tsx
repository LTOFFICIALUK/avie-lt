import { ItemList } from "./ItemList";

interface TopicsAndAdjectivesProps {
  topics: string[];
  setTopics: (topics: string[]) => void;
  adjectives: string[];
  setAdjectives: (adjectives: string[]) => void;
}

export function TopicsAndAdjectives({
  topics,
  setTopics,
  adjectives,
  setAdjectives,
}: TopicsAndAdjectivesProps) {
  return (
    <div className=" flex flex-col gap-16">
      {/* Topics */}
      <ItemList
        items={topics}
        setItems={setTopics}
        placeholder="Add topic"
        label="Topics"
        itemType="topic"
      />

      {/* Adjectives */}
      <ItemList
        items={adjectives}
        setItems={setAdjectives}
        placeholder="Add adjective"
        label="Adjectives"
        itemType="adjective"
      />
    </div>
  );
}
