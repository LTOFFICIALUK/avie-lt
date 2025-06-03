import React, { useState } from "react";
import { Input, Button, Tag } from "antd";
import { EditingIndex, handleAddItem, handleDeleteItem } from "@/lib/character";

interface ItemListProps {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder: string;
  label: string;
  itemType: string;
}

export function ItemList({
  items,
  setItems,
  placeholder,
  label,
  itemType,
}: ItemListProps) {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<EditingIndex>(null);

  const handleAddItemWrapper = () => {
    handleAddItem(
      inputValue,
      items,
      setItems,
      setInputValue,
      itemType,
      editingIndex,
      setEditingIndex
    );
  };

  const handleDeleteItemWrapper = (index: number) => {
    handleDeleteItem(index, items, setItems);
  };

  return (
    <div className="flex flex-col gap-5">
      <h3>{label}</h3>
      <div className="flex justify-between">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onPressEnter={handleAddItemWrapper}
          style={{ width: "calc(100% - 100px)" }}
        />
        <Button type="default" onClick={handleAddItemWrapper}>
          {editingIndex !== null ? "Update" : "Add"}
        </Button>
      </div>
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {items.map((item, index) => (
          <Tag
            style={{ padding: 8 }}
            color="var(--color-gray)"
            key={index}
            closable
            onClose={() => handleDeleteItemWrapper(index)}
          >
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}
