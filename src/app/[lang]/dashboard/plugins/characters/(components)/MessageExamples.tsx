import { useState } from "react";
import { Input, Button } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { CollapsibleSection } from "./CollapsibleSection";
import { handleDeleteItem } from "@/lib/character";

const { TextArea } = Input;

interface MessageExample {
  user: string;
  content: {
    text: string;
  };
}

interface MessageExamplesProps {
  messageExamples: Array<Array<MessageExample>>;
  setMessageExamples: (examples: Array<Array<MessageExample>>) => void;
  initiallyOpen?: boolean;
}

export function MessageExamples({
  messageExamples,
  setMessageExamples,
  initiallyOpen = false,
}: MessageExamplesProps) {
  const [messageExample, setMessageExample] = useState("");

  const handleAddMessageExample = () => {
    if (messageExample.trim()) {
      // Parse the message example into a conversation
      const lines = messageExample.trim().split("\n");
      const conversation: MessageExample[] = [];

      for (const line of lines) {
        if (line.trim()) {
          // Check if line starts with "User:" or "Character:"
          if (line.startsWith("User:")) {
            conversation.push({
              user: "user",
              content: { text: line.substring(5).trim() },
            });
          } else if (line.startsWith("Character:")) {
            conversation.push({
              user: "character",
              content: { text: line.substring(10).trim() },
            });
          } else {
            // If no prefix, assume it continues the last message
            if (conversation.length > 0) {
              const lastMessage = conversation[conversation.length - 1];
              lastMessage.content.text += "\n" + line.trim();
            } else {
              // If first message has no prefix, assume it's from the user
              conversation.push({
                user: "user",
                content: { text: line.trim() },
              });
            }
          }
        }
      }

      if (conversation.length > 0) {
        setMessageExamples([...messageExamples, conversation]);
        setMessageExample("");
      }
    }
  };

  const handleDeleteMessageExample = (index: number) => {
    handleDeleteItem(index, messageExamples, setMessageExamples);
  };

  return (
    <CollapsibleSection title="Message Examples" initiallyOpen={initiallyOpen}>
      <div className="flex space-x-2">
        <TextArea
          value={messageExample}
          onChange={(e) => setMessageExample(e.target.value)}
          placeholder="Add message example (format: User: message\nCharacter: response)"
          style={{ minHeight: "100px", backgroundColor: "var(--color-gray)" }}
        />
        <Button
          onClick={handleAddMessageExample}
          type="primary"
          icon={<UploadOutlined />}
        />
      </div>

      {/* Display existing message examples */}
      <div className="space-y-4 mt-2">
        {messageExamples.map((conversation, index) => (
          <div
            key={index}
            className="group relative p-3 bg-zinc-900/50 hover:bg-zinc-900/70 rounded-md"
          >
            {conversation.map((message, messageIndex) => (
              <div
                key={messageIndex}
                className={`mb-2 ${
                  message.user === "user" ? "text-blue-400" : "text-green-400"
                }`}
              >
                <span className="font-medium">
                  {message.user === "user" ? "User: " : "Character: "}
                </span>
                <span className="text-zinc-300">{message.content.text}</span>
              </div>
            ))}
            <Button
              onClick={() => handleDeleteMessageExample(index)}
              type="text"
              size="small"
              danger
              icon={<CloseOutlined />}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}
