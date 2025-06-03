"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Select,
  Upload as AntUpload,
  Tag,
  App,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  TagOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  FileOutlined,
} from "@ant-design/icons";
import api from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

const { Text } = Typography;

// Define media type options as a constant
export const MEDIA_TYPES = [
  { value: "promo", label: "Promo" },
  { value: "fun", label: "Fun" },
  { value: "serious", label: "Serious" },
  { value: "information", label: "Information" },
  { value: "meme", label: "Meme" },
  { value: "wallpaper", label: "Wallpaper" },
  { value: "advertisement", label: "Advertisement" },
  { value: "avatar", label: "Avatar" },
];

// Interface for parent component communication
export interface MediaItem {
  url: string;
  type: string;
}

interface CharacterMediaProps {
  characterId?: string;
  media: string[];
  setMedia: (media: string[]) => void;
  getMediaType?: (url: string) => string;
  onMediaTypeChange?: (url: string, type: string) => void;
}

// Define interface for file object from ant design
interface UploadFile {
  status?: string;
  originFileObj?: File;
}

interface UploadChangeInfo {
  file: UploadFile;
}

export function CharacterMedia({
  characterId,
  media,
  setMedia,
  getMediaType,
  onMediaTypeChange,
}: CharacterMediaProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mediaTypes, setMediaTypes] = useState<Record<string, string>>({});
  const isInitialRender = useRef(true);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );
  const [localMedia, setLocalMedia] = useState<string[]>([]);

  // Use global toast provider instead of Ant Design message
  const toast = useToast();
  const { modal } = App.useApp();

  // Initialize local media state from props
  useEffect(() => {
    setLocalMedia(media);
    console.log("Media props updated:", media);
  }, [media]);

  useEffect(() => {
    const types: Record<string, string> = {};
    localMedia.forEach((url) => {
      if (getMediaType) {
        types[url] = getMediaType(url);
      } else if (!mediaTypes[url]) {
        types[url] = "promo";
      } else {
        types[url] = mediaTypes[url];
      }
    });

    if (
      JSON.stringify(types) !== JSON.stringify(mediaTypes) ||
      isInitialRender.current
    ) {
      setMediaTypes(types);
      isInitialRender.current = false;
    }
  }, [localMedia, getMediaType, mediaTypes]);

  const handleFileChange = async (info: UploadChangeInfo) => {
    if (!characterId || info.file.status !== "uploading") return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (info.file.originFileObj) {
        formData.append("media", info.file.originFileObj);

        const response = await api.post(
          `/api/upload/character/${characterId}/media`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          const newUrl = response.data.mediaUrl;

          console.log("Media upload successful:", newUrl);

          // Mark this image as loading until it's loaded
          setLoadingImages((prev) => ({ ...prev, [newUrl]: true }));

          // Add to local state first
          const newMedia = [...localMedia, newUrl];
          setLocalMedia(newMedia);

          // Then update parent component
          setMedia(newMedia);

          // Set media type
          setMediaTypes((prev) => ({
            ...prev,
            [newUrl]: "promo",
          }));

          if (onMediaTypeChange) {
            onMediaTypeChange(newUrl, "promo");
          }

          // Preload the image to ensure it's in the browser cache
          const preloadImage = () => {
            const img = document.createElement("img");
            img.onload = () => {
              setLoadingImages((prev) => {
                const updated = { ...prev };
                delete updated[newUrl];
                return updated;
              });
            };
            img.onerror = () => {
              setLoadingImages((prev) => {
                const updated = { ...prev };
                delete updated[newUrl];
                return updated;
              });
            };
            img.src = newUrl;
          };

          preloadImage();
        } else {
          throw new Error(response.data.error || "Failed to upload media");
        }
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload media. Please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = (index: number) => {
    const urlToDelete = localMedia[index];
    const newMedia = localMedia.filter((_, i) => i !== index);
    setLocalMedia(newMedia);
    setMedia(newMedia);

    setMediaTypes((prev) => {
      const updatedTypes = { ...prev };
      delete updatedTypes[urlToDelete];
      return updatedTypes;
    });
  };

  const handleChangeMediaType = (url: string, type: string) => {
    setMediaTypes((prev) => ({
      ...prev,
      [url]: type,
    }));

    if (onMediaTypeChange) {
      onMediaTypeChange(url, type);
    }

    toast.message.success(`Media type has been set to ${type}`);
  };

  const getMediaTypeIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    const isTempUrl = url.startsWith("blob:") || url.startsWith("data:");
    const isLoading = loadingImages[url];

    if (isLoading) {
      return (
        <div
          className="image-container"
          style={{
            width: "100%",
            height: "150px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div className="ant-spin ant-spin-spinning">
              <span className="ant-spin-dot">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
            <div style={{ marginTop: 8 }}>Loading image...</div>
          </div>
        </div>
      );
    }

    // For temporary URLs or known image extensions
    if (
      isTempUrl ||
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
    ) {
      return (
        <div
          className="image-container"
          style={{ width: "100%", height: "150px", position: "relative" }}
        >
          <img
            src={url}
            alt="Media thumbnail"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      );
    } else if (["mp4", "mov", "webm"].includes(extension || "")) {
      return <VideoCameraOutlined />;
    } else if (["mp3", "wav", "ogg"].includes(extension || "")) {
      return <SoundOutlined />;
    } else {
      return <FileOutlined />;
    }
  };

  const getMediaTypeLabel = (url: string) => {
    if (getMediaType) {
      return getMediaType(url);
    }
    return mediaTypes[url] || "promo";
  };

  const getMediaTypeBadgeColor = (type: string): string => {
    const colors: Record<string, string> = {
      promo: "blue",
      fun: "purple",
      serious: "default",
      information: "green",
      meme: "gold",
      wallpaper: "geekblue",
      advertisement: "red",
      avatar: "cyan",
    };
    return colors[type] || "default";
  };

  const renderMediaPreview = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    const fileName = url.split("/").pop() || "Media Preview";
    const isTempUrl = url.startsWith("blob:") || url.startsWith("data:");

    // For temporary URLs or known image extensions
    if (
      isTempUrl ||
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
    ) {
      return (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={url}
            alt={`Character media: ${fileName}`}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
          />
        </div>
      );
    } else if (["mp4", "mov", "webm"].includes(extension || "")) {
      return (
        <video
          controls
          style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
        >
          <source
            src={url}
            type={`video/${extension === "mov" ? "quicktime" : extension}`}
          />
          Your browser does not support the video tag.
        </video>
      );
    } else if (["mp3", "wav", "ogg"].includes(extension || "")) {
      return (
        <audio controls style={{ width: "100%", marginTop: 8 }}>
          <source src={url} type={`audio/${extension}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <FileOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Button type="link" href={url} target="_blank">
            Download file
          </Button>
        </div>
      );
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>Character Media</h3>
        {characterId && (
          <AntUpload
            accept="image/*,audio/*,video/*"
            showUploadList={false}
            onChange={handleFileChange}
            disabled={isUploading}
          >
            <Button icon={<UploadOutlined />} loading={isUploading}>
              {isUploading ? "Uploading..." : "Upload Media"}
            </Button>
          </AntUpload>
        )}
      </div>
      <Card>
        {localMedia.length > 0 ? (
          <div
            className="grid grid-cols-5 gap-6 max-h-[400px] min-h-[200px]"
            style={{
              overflowY: "auto",
              padding: "0 8px",
            }}
          >
            {localMedia.map((url, index) => {
              return (
                <div
                  key={`media-item-${url}-${index}`}
                  style={{ position: "relative" }}
                >
                  <Card
                    size="small"
                    hoverable
                    onClick={() => {
                      modal.info({
                        title: url.split("/").pop() || "Media Preview",
                        content: renderMediaPreview(url),
                        width: 800,
                        okText: "Close",
                        maskClosable: true,
                      });
                    }}
                    styles={{
                      body: {
                        padding: 15,
                      },
                    }}
                    style={{ height: "100%" }}
                  >
                    <div
                      style={{
                        aspectRatio: "1/1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getMediaTypeIcon(url)}
                      <Text
                        ellipsis
                        style={{
                          width: "100%",
                          textAlign: "center",
                          marginTop: 8,
                        }}
                      >
                        {url.split("/").pop()}
                      </Text>
                    </div>
                  </Card>

                  <Space
                    style={{ position: "absolute", top: 4, left: 4, right: 4 }}
                  >
                    <Tag color={getMediaTypeBadgeColor(getMediaTypeLabel(url))}>
                      {getMediaTypeLabel(url)}
                    </Tag>
                    <Space size={4}>
                      <Button
                        type="text"
                        size="small"
                        icon={<TagOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          modal.info({
                            title: "Change Media Type",
                            content: (
                              <Select
                                style={{ width: "100%" }}
                                value={getMediaTypeLabel(url)}
                                onChange={(value) => {
                                  handleChangeMediaType(url, value);
                                }}
                                options={MEDIA_TYPES}
                              />
                            ),
                            okText: "Cancel",
                          });
                        }}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(index);
                        }}
                      />
                    </Space>
                  </Space>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <UploadOutlined
              style={{
                fontSize: 32,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            />
            <h3>No media uploaded yet</h3>
            <p>
              Upload images, audio, or video files to enhance your character
            </p>
          </div>
        )}
      </Card>
    </Space>
  );
}
