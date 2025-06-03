import { useState } from "react";
import { Input, Button } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditingIndex, handleAddItem, handleDeleteItem, handleEditItem } from "@/lib/character";

interface InputItemListProps {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder: string;
}

export function InputItemList({
  items,
  setItems,
  placeholder,
}: InputItemListProps) {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<EditingIndex>(null);

  const handleAddItemWrapper = () => {
    handleAddItem(
      inputValue,
      items,
      setItems,
      setInputValue,
      "input",
      editingIndex,
      setEditingIndex
    );
  };

  const handleDeleteItemWrapper = (index: number) => {
    handleDeleteItem(index, items, setItems);
  };

  const handleEditItemWrapper = (index: number) => {
    handleEditItem(
      index,
      items[index],
      setInputValue,
      "input",
      setEditingIndex
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          style={{ backgroundColor: 'var(--color-gray)' }}
          onPressEnter={handleAddItemWrapper}
        />
        <Button
          onClick={handleAddItemWrapper}
          type="primary"
          icon={<UploadOutlined />}
        />
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="group relative p-3 bg-zinc-900/50 hover:bg-zinc-900/70 rounded-md"
          >
            <p className="text-sm text-zinc-300">{item}</p>
            <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => handleEditItemWrapper(index)}
                type="text"
                size="small"
                icon={<EditOutlined />}
                className="text-zinc-400 hover:text-zinc-300"
              />
              <Button
                onClick={() => handleDeleteItemWrapper(index)}
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="text-zinc-400 hover:text-red-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 