import { Button, Alert, Modal } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CharacterFormData } from "@/types/character";
import { FiPlus, FiSettings, FiTrash2, FiUser, FiEdit3 } from "react-icons/fi";

interface CharacterListProps {
  characters: CharacterFormData[];
  onRefresh?: () => Promise<void>;
}

export function CharacterList({
  characters: initialCharacters,
  onRefresh,
}: CharacterListProps) {
  const router = useRouter();
  const [characters, setCharacters] =
    useState<CharacterFormData[]>(initialCharacters);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadingState: Record<string, boolean> = {};
    characters.forEach((character) => {
      if (character.avatarUrl) {
        loadingState[character.id] = true;
      }
    });
    setLoadingImages(loadingState);
  }, [characters]);

  const handleImageLoad = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Delete button clicked for character:", id);
    
    // Set the character ID to delete and show the modal
    setCharacterToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!characterToDelete) return;
    
    const id = characterToDelete;
    console.log("Confirmed delete for character:", id);
    setDeletingId(id);
    setError(null);

    try {
      console.log("Sending delete request to:", `/api/character/${id}`);
      const response = await api.delete(`/api/character/${id}`);
      console.log("Delete response:", response);
      
      setCharacters((prev) =>
        prev.filter((character) => character.id !== id)
      );
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error("Error deleting character:", err);
      setError("Failed to delete character. Please try again.");
    } finally {
      setDeletingId(null);
      setShowConfirmModal(false);
      setCharacterToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setCharacterToDelete(null);
  };

  return (
    <div className="w-full">
      {/* Create Character Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => router.push("characters/create")}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create Character
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Empty State */}
      {characters.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Characters Yet</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Create your first AI character to get started with personalized streaming experiences.
          </p>
          <button
            onClick={() => router.push("characters/create")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Create Character
          </button>
        </div>
      ) : (
        /* Character Grid */
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => router.push(`characters/${character.id}`)}
              className="bg-[#1A1A1A] rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 border border-gray-800 hover:border-cyan-500 group"
            >
              {/* Character Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    {character.avatarUrl ? (
                      <>
                        {loadingImages[character.id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400" />
                          </div>
                        )}
                        <Image
                          src={character.avatarUrl}
                          alt={character.name}
                          fill
                          className="object-cover"
                          unoptimized={
                            character.avatarUrl.startsWith("data:") ||
                            character.avatarUrl.startsWith("blob:")
                          }
                          onLoadingComplete={() => handleImageLoad(character.id)}
                          onError={(e) => {
                            console.error("Error loading avatar:", e);
                            handleImageLoad(character.id);
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </>
                    ) : (
                      <FiUser className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Character Name */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {character.name}
                    </h3>
                    <p className="text-gray-400 text-sm">AI Character</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/plugins/settings/character/${character.id}`);
                    }}
                    disabled={deletingId === character.id}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiSettings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(character.id, e)}
                    disabled={deletingId === character.id}
                    className="p-2 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === character.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400" />
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Character Description */}
              <div className="mb-4">
                <p className="text-gray-400 leading-relaxed line-clamp-4">
                  {character.settings?.system || "No description available"}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-500">
                  Click to edit
                </div>
                <div className="flex items-center text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  <span>Customize</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span className="text-white text-lg font-semibold">
            Delete Character
          </span>
        }
        open={showConfirmModal}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ 
          danger: true,
          className: "bg-red-600 hover:bg-red-700 border-red-600"
        }}
        cancelButtonProps={{
          className: "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
        }}
        className="[&_.ant-modal-content]:bg-[#1A1A1A] [&_.ant-modal-content]:border [&_.ant-modal-content]:border-gray-700"
      >
        <div className="text-gray-300">
          <p className="mb-2">Are you sure you want to delete this character?</p>
          <p className="text-gray-400">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}