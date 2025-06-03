import React, { useState } from "react";
import { Input, Button, Alert } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface NewDestination {
  name: string;
  rtmpUrl: string;
  streamKey: string;
}

interface AddRestreamFormProps {
  onAddDestination: (newDestination: NewDestination) => Promise<boolean>;
  error: string | null;
  setError: (error: string | null) => void;
}

export const AddRestreamForm: React.FC<AddRestreamFormProps> = ({
  onAddDestination,
  error,
  setError,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDestination, setNewDestination] = useState<NewDestination>({
    name: "",
    rtmpUrl: "",
    streamKey: "",
  });

  const validateForm = (): boolean => {
    if (!newDestination.name.trim()) {
      setError("Platform name is required");
      return false;
    }
    if (!newDestination.rtmpUrl.trim()) {
      setError("RTMP URL is required");
      return false;
    }
    if (!newDestination.streamKey.trim()) {
      setError("Stream key is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsAdding(true);
    setError(null);

    try {
      const success = await onAddDestination({
        name: newDestination.name,
        rtmpUrl: newDestination.rtmpUrl,
        streamKey: newDestination.streamKey,
      });

      if (success) {
        // Reset form
        setNewDestination({
          name: "",
          rtmpUrl: "",
          streamKey: "",
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Platform Name
          </label>
          <Input
            value={newDestination.name}
            onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
            placeholder="e.g. Twitch, YouTube, etc."
            className="bg-card/50 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            RTMP URL
          </label>
          <Input
            value={newDestination.rtmpUrl}
            onChange={(e) => setNewDestination({ ...newDestination, rtmpUrl: e.target.value })}
            placeholder="rtmp://..."
            className="bg-card/50 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Stream Key
          </label>
          <Input.Password
            value={newDestination.streamKey}
            onChange={(e) => setNewDestination({ ...newDestination, streamKey: e.target.value })}
            placeholder="Enter stream key"
            className="bg-card/50 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ background: 'rgba(255, 0, 0, 0.1)', border: 'none' }}
        />
      )}

      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={isAdding}
          className="bg-card/30 border-border hover:bg-card/50"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isAdding ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: '16px', marginRight: '8px' }} spin />} />
          ) : (
            <PlusOutlined style={{ marginRight: '8px' }} />
          )}
          {isAdding ? 'Adding...' : 'Add Destination'}
        </Button>
      </div>
    </div>
  );
}; 