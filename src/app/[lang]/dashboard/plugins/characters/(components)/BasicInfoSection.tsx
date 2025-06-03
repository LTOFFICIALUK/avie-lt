"use client";

import { useState, useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import Image from "next/image";
import { Input, Select, Alert, Space, Typography, Checkbox } from "antd";
import {
  InfoCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import api from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

const { TextArea } = Input;
const { Text } = Typography;

interface BasicInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  voiceModel: string;
  setVoiceModel: (model: string) => void;
  system: string;
  setSystem: (system: string) => void;
  characterId?: string;
  chatActive: boolean;
  setChatActive: (active: boolean) => void;
}

export function BasicInfoSection({
  name,
  setName,
  avatarUrl,
  setAvatarUrl,
  voiceModel,
  setVoiceModel,
  system,
  setSystem,
  characterId,
  chatActive,
  setChatActive,
}: BasicInfoSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const toast = useToast();

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file) return;
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        if (characterId) {
          const response = await api.post(
            `/api/upload/character/${characterId}/avatar`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            setAvatarUrl(response.data.avatarUrl);
            toast.success("Avatar uploaded successfully");
          } else {
            throw new Error(response.data.error || "Failed to upload avatar");
          }
        } else {
          const response = await api.post("/api/upload/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            setAvatarUrl(response.data.imageUrl);
          } else {
            throw new Error(response.data.error || "Failed to upload image");
          }
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        setUploadError("Failed to upload image. Please try again.");
        toast.error("Failed to upload avatar. Please try again later.");
      } finally {
        setIsUploading(false);
      }
    },
    [characterId, setAvatarUrl, toast]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (file) {
        handleImageUpload(file);
      }
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
  });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 24 }}>
        {/* Avatar Upload */}
        <div style={{ width: "25%", minWidth: 200 }}>
          <h3>Character Avatar</h3>
          <div
            {...getRootProps()}
            style={{
              width: 144,
              height: 144,
              borderRadius: "50%",
              border: "2px dashed var(--color-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              background: "var(--color-gray)",
            }}
          >
            <input {...getInputProps()} disabled={isUploading} />

            {isUploading ? (
              <div style={{ textAlign: "center" }}>
                <LoadingOutlined
                  style={{ fontSize: 24, color: "var(--color-brand)" }}
                />
                <Text style={{ marginTop: 8, display: "block" }}>
                  Uploading...
                </Text>
              </div>
            ) : avatarUrl ? (
              <>
                <div style={{ position: "absolute", inset: 0 }}>
                  <Image
                    src={avatarUrl}
                    alt="Character avatar"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized={avatarUrl.startsWith("data:")}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UploadOutlined style={{ fontSize: 24, color: "#fff" }} />
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <UploadOutlined
                  style={{ fontSize: 24, color: "var(--color-brand)" }}
                />
                <Text style={{ marginTop: 8, display: "block" }}>
                  Drop image here, or click to select
                </Text>
              </div>
            )}
          </div>
          {uploadError && (
            <Text
              type="danger"
              style={{ marginTop: 8, display: "block", fontSize: 12 }}
            >
              {uploadError}
            </Text>
          )}
        </div>

        {/* Character Name and other fields */}
        <div style={{ flex: 1 }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Character Name */}
            <div>
              <Text style={{ marginBottom: 8, display: "block" }}>
                Character Name
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character name"
              />
            </div>

            {/* Voice Model */}
            <div>
              <Text style={{ marginBottom: 8, display: "block" }}>
                Voice Model
              </Text>
              <Select
                value={voiceModel}
                onChange={setVoiceModel}
                style={{ width: "100%" }}
                options={[
                  { value: "en_US-hfc_female-medium", label: "Female (US)" },
                  { value: "en_US-hfc_male-medium", label: "Male (US)" },
                  { value: "en_GB-hfc_female-medium", label: "Female (UK)" },
                  { value: "en_GB-hfc_male-medium", label: "Male (UK)" },
                ]}
              />
            </div>

            {/* Instructions for avatar */}
            <Alert
              type="info"
              icon={<InfoCircleOutlined />}
              message="Upload a portrait image for best results. Images will be cropped to fit."
              style={{
                background: "var(--color-brand)",
                color: "var(--color-gray)",
                border: "none",
              }}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="chatActive"
                checked={chatActive}
                onChange={(e) => setChatActive(e.target.checked)}
                className="border-gray-700"
              />
              <label 
                htmlFor="chatActive" 
                className="pl-2 text-sm font-medium text-white cursor-pointer"
              >
                Character active in chat
              </label>
            </div>
          </Space>
        </div>
      </div>

      {/* System Prompt */}
      <div className="flex flex-col gap-5">
        <h3>System Prompt</h3>
        <TextArea
          styles={{
            textarea: {
              background: "var(--background)",
            },
          }}
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          placeholder="Enter system prompt"
          style={{ maxHeight: 500, minHeight: 400 }}
        />
      </div>
    </Space>
  );
}

<style jsx>{`
  div:hover {
    opacity: 1 !important;
  }
`}</style>;
