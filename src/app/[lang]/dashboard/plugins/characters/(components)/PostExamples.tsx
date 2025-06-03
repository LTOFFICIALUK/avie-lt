import { CollapsibleSection } from "./CollapsibleSection";
import { TextAreaItemList } from "./TextAreaItemList";

interface PostExamplesProps {
  postExamples: string[];
  setPostExamples: (examples: string[]) => void;
  initiallyOpen?: boolean;
}

export function PostExamples({
  postExamples,
  setPostExamples,
  initiallyOpen = false,
}: PostExamplesProps) {
  return (
    <CollapsibleSection title="Post Examples" initiallyOpen={initiallyOpen}>
      <TextAreaItemList
        items={postExamples}
        setItems={setPostExamples}
        placeholder="Add post example"
      />
    </CollapsibleSection>
  );
} 