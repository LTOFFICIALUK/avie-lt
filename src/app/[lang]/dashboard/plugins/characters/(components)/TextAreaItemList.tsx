import React, { useState } from "react";
import { Input, Button, List, Typography, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

interface TextAreaItemListProps {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder?: string;
}

export function TextAreaItemList({
  items,
  setItems,
  placeholder = "Enter item details",
}: TextAreaItemListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddItem = () => {
    // Add empty item only when user clicks add
    setItems(["", ...items]);
    setEditingIndex(0);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = (index: number) => {
    const newItems = [...items];

    // If saving an empty item, remove it if no content is added
    if (editValue.trim() === "") {
      newItems.splice(index, 1);
    } else {
      newItems[index] = editValue;
    }

    setItems(newItems);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    // If cancelling an empty item, remove it
    if (items[0] === "") {
      const newItems = [...items];
      newItems.splice(0, 1);
      setItems(newItems);
    }
    setEditingIndex(null);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button icon={<PlusOutlined />} onClick={handleAddItem} block>
        Add New Item
      </Button>

      <List
        dataSource={items}
        renderItem={(item, index) => (
          <List.Item
            actions={
              editingIndex === index
                ? [
                    <Button
                      key="save"
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => handleSaveEdit(index)}
                    />,
                    <Button
                      key="cancel"
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={handleCancelEdit}
                    />,
                  ]
                : [
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleStartEdit(index)}
                    />,
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteItem(index)}
                    />,
                  ]
            }
          >
            {editingIndex === index ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={placeholder}
                onPressEnter={() => handleSaveEdit(index)}
              />
            ) : (
              <Typography.Text>{item || "Empty Item"}</Typography.Text>
            )}
          </List.Item>
        )}
      />
    </Space>
  );
}
