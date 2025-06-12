import React, { useState } from "react";
import GptRecommendationModal from "./GptRecommendationModal";
import "./styles.css";

interface GptRecommendationButtonProps {
  clientId: string;
  clientName: string;
}

const GptRecommendationButton: React.FC<GptRecommendationButtonProps> = ({
  clientId,
  clientName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center ml-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        GPT-рекомендация
      </button>

      <GptRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientId={clientId}
        clientName={clientName}
      />
    </>
  );
};

export default GptRecommendationButton;
