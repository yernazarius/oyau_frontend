import React from "react";
import GptRecommendationButton from "./GptRecommendationButton";

export interface ClientVisit {
  id: string;
  date: string;
  service: string;
  amount: number;
}

export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  category: "regular" | "vip";
  dateOfBirth?: string;
  visits: ClientVisit[];
  discount?: number;
  notes?: string;
}

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">{client.name}</h2>
            <p className="text-gray-600">{client.phoneNumber}</p>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                client.category === "vip"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {client.category === "vip" ? "VIP" : "Обычный"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Дата рождения</p>
            <p className="font-medium">{formatDate(client.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Персональная скидка</p>
            <p className="font-medium">
              {client.discount ? `${client.discount}%` : "-"}
            </p>
          </div>
        </div>

        {client.notes && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Примечания</p>
            <p className="p-3 bg-gray-50 rounded text-sm">{client.notes}</p>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">История посещений</h3>
            <span className="text-sm text-gray-500">
              Всего: {client.visits.length}
            </span>
          </div>

          {client.visits.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Услуга
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.visits.slice(0, 5).map((visit) => (
                    <tr key={visit.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {formatDate(visit.date)}
                      </td>
                      <td className="px-4 py-3 text-sm">{visit.service}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {visit.amount.toLocaleString("ru-RU")} ₽
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {client.visits.length > 5 && (
                <div className="bg-gray-50 px-4 py-3 text-center">
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-700">
                    Показать все
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded">
              История посещений пуста
            </p>
          )}
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => onEdit(client)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Редактировать
          </button>

          <GptRecommendationButton
            clientId={client.id}
            clientName={client.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
