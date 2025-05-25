import React, { useState, useEffect } from "react";
import { getWorkspaces, WorkspaceRead } from "@/lib/workspace";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import Button from "../UI/Button";

interface WorkspaceSelectorProps {
  onSelect?: () => void;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ onSelect }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { workspace, refreshWorkspace } = useWorkspace();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const workspaceList = await getWorkspaces();
      setWorkspaces(workspaceList);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
      setError("Failed to load workspaces. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkspace = async (workspaceId: number) => {
    try {
      // Here you would implement the logic to select a workspace
      // This might involve setting a workspaceId in localStorage or cookies
      localStorage.setItem("activeWorkspaceId", workspaceId.toString());

      // Refresh the workspace context
      await refreshWorkspace();

      if (onSelect) {
        onSelect();
      }
    } catch (err) {
      console.error("Error selecting workspace:", err);
      setError("Failed to select workspace. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Выберите рабочее пространство
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {workspaces.length > 0 ? (
        <div className="space-y-3">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className={`border rounded-lg p-4 cursor-pointer transition hover:bg-blue-50
                ${workspace?.id === ws.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => handleSelectWorkspace(ws.id)}
            >
              <div className="font-medium">{ws.name}</div>
              <div className="text-sm text-gray-500">{ws.location}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded">
          <p className="text-gray-600 mb-4">
            У вас нет доступных рабочих пространств
          </p>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/workspace-creation")}
          >
            Создать рабочее пространство
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;
