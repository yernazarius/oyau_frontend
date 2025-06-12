import React, { useState, useEffect } from "react";
import { generateGptRecommendation } from "../../services/gptService";
import Button from "../UI/Button";

interface GptRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

interface RecommendationResponse {
  message: string;
}

const GptRecommendationModal: React.FC<GptRecommendationModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
}) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && clientId) {
      fetchRecommendation();
    }
  }, [isOpen, clientId]);

  const fetchRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateGptRecommendation(clientId);

      // Handle the response format with message property
      if (typeof data === "object" && data !== null && "message" in data) {
        setRecommendation((data as RecommendationResponse).message);
      } else if (typeof data === "string") {
        setRecommendation(data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      setError(
        "Не удалось получить рекомендацию. Пожалуйста, попробуйте позже.",
      );
      console.error("Error fetching recommendation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse and render markdown-like content
  const renderFormattedContent = (content: string) => {
    // Split the content into lines for processing
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // Handle headers (###)
      if (line.startsWith("###")) {
        return (
          <h3 key={index} className="text-lg font-bold text-blue-700 mt-4 mb-2">
            {line.substring(3).trim()}
          </h3>
        );
      }

      // Handle secondary headers (##)
      if (line.startsWith("##")) {
        return (
          <h2 key={index} className="text-xl font-bold text-blue-800 mt-5 mb-3">
            {line.substring(2).trim()}
          </h2>
        );
      }

      // Handle main headers (#)
      if (line.startsWith("#")) {
        return (
          <h1
            key={index}
            className="text-2xl font-bold text-blue-900 mt-6 mb-4"
          >
            {line.substring(1).trim()}
          </h1>
        );
      }

      // Handle numbered list items (1., 2., etc.)
      if (/^\d+\./.test(line.trim())) {
        const itemContent = line.replace(/^\d+\./, "").trim();

        // Handle bold text within list items
        const formattedContent = itemContent.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>",
        );

        return (
          <div key={index} className="ml-5 my-1">
            <span className="font-medium">•</span>
            <span
              className="ml-2"
              dangerouslySetInnerHTML={{
                __html: formattedContent,
              }}
            />
          </div>
        );
      }

      // Handle bullet points (-)
      if (line.trim().startsWith("-")) {
        const itemContent = line.replace(/^-/, "").trim();

        // Handle bold text within bullet points
        const formattedContent = itemContent.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>",
        );

        return (
          <div key={index} className="ml-8 my-1">
            <span className="font-medium">•</span>
            <span
              className="ml-2"
              dangerouslySetInnerHTML={{
                __html: formattedContent,
              }}
            />
          </div>
        );
      }

      // Handle bold text in regular paragraphs
      if (line.includes("**")) {
        const formattedContent = line.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>",
        );

        return line.trim() === "" ? (
          <br key={index} />
        ) : (
          <p
            key={index}
            className="my-2"
            dangerouslySetInnerHTML={{
              __html: formattedContent,
            }}
          />
        );
      }

      // Handle regular text
      return line.trim() === "" ? (
        <br key={index} />
      ) : (
        <p key={index} className="my-2">
          {line}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto my-8">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Рекомендация для {clientName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-6">
              <svg
                className="animate-spin h-8 w-8 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-2 text-gray-600">Генерация рекомендации...</p>
            </div>
          ) : recommendation ? (
            <div className="py-2">
              <div className="text-gray-800 recommendation-content">
                {renderFormattedContent(recommendation)}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button
            variant="primary"
            onClick={fetchRecommendation}
            disabled={isLoading}
          >
            Обновить рекомендацию
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GptRecommendationModal;
