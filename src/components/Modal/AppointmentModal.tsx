
"use client"
import React, { useState, useEffect, useRef } from "react"
import { AppointmentModalProps, Appointment } from "../types"
import Button from "../UI/Button"
import axiosInstance from "@/lib/axios"

const AppointmentModal: React.FC<
  AppointmentModalProps & { onDelete?: (id: string) => void }
> = ({
  workspaceId,
  isOpen,
  onClose,
  appointment,
  isNewAppointment,
  selectedHour,
  selectedDate,
  onSave,
  onDelete,
}) => {
    const emptyAppointment: Appointment = {
      id: "",
      startTime: selectedHour
        ? `${selectedHour.toString().padStart(2, "0")}:00`
        : "09:00",
      endTime: selectedHour
        ? `${(selectedHour + 1).toString().padStart(2, "0")}:00`
        : "10:00",
      clientName: "",
      phoneNumber: "",
      location: "",
      status: "new",
    }
    const [formData, setFormData] = useState<Appointment>(emptyAppointment)
    const [showClientDetails, setShowClientDetails] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [filteredClients, setFilteredClients] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any | null>(null)
    const [isLoadingClients, setIsLoadingClients] = useState(false)
    const suggestionRef = useRef<HTMLDivElement>(null)
    const submitButtonRef = useRef<HTMLButtonElement>(null)
    const lastSubmitTime = useRef<number>(0)
    const formRef = useRef<HTMLFormElement>(null)

    // Fetch clients when modal opens
    useEffect(() => {
      if (isOpen) {
        fetchClients()
        if (appointment) {
          setFormData(appointment)
        } else {
          setFormData(emptyAppointment)
          setSelectedClient(null)
        }
      }
    }, [isOpen, appointment, selectedHour, selectedDate])

    // Filter clients when clientName or phoneNumber changes
    useEffect(() => {
      if (formData.clientName || formData.phoneNumber) {
        const nameQuery = formData.clientName.toLowerCase()
        const phoneQuery = formData.phoneNumber.replace(/\D/g, "")

        const filtered = clients.filter((client) => {
          const fullName = `${client.name} ${client.surname}`.toLowerCase()
          const phone = client.phone ? client.phone.replace(/\D/g, "") : ""

          return fullName.includes(nameQuery) || phone.includes(phoneQuery)
        })

        setFilteredClients(filtered)
        setShowSuggestions(
          filtered.length > 0 && (nameQuery.length > 2 || phoneQuery.length > 3),
        )
      } else {
        setFilteredClients([])
        setShowSuggestions(false)
      }
    }, [formData.clientName, formData.phoneNumber, clients])

    // Close suggestions when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          suggestionRef.current &&
          !suggestionRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    const fetchClients = async () => {
      setIsLoadingClients(true)
      try {
        const response = await axiosInstance.get("/api/client/get_clients")
        setClients(response.data || [])
      } catch (error) {
        console.error("Error fetching clients:", error)
      } finally {
        setIsLoadingClients(false)
      }
    }

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))

      if (name === "clientName" || name === "phoneNumber") {
        setSelectedClient(null) // Reset selected client when typing
      }
    }

    const handleClientSelect = (client: any) => {
      setSelectedClient(client)
      setFormData((prev) => ({
        ...prev,
        clientName: `${client.name} ${client.surname}`.trim(),
        phoneNumber: client.phone || "",
        clientType: client.category || "regular",
        dateOfBirth: client.birth_date || "",
        personalDiscount: client.personal_discount?.toString() || "",
        notes: client.prefernces || "",
      }))
      setShowSuggestions(false)
    }

    const createClient = async () => {
      // Parse name to extract first name and surname
      const nameParts = formData.clientName.trim().split(" ")
      const name = nameParts[0] || ""
      const surname = nameParts.slice(1).join(" ") || ""

      const clientData = {
        name,
        surname,
        phone: formData.phoneNumber,
        category: formData.clientType || "regular",
        personal_discount: formData.personalDiscount
          ? parseFloat(formData.personalDiscount)
          : null,
        birth_date: formData.dateOfBirth || null,
        prefernces: formData.notes || null,
        comments: formData.comment || null,
      }

      try {
        const response = await axiosInstance.post(
          "/api/client/create_client",
          clientData,
        )

        // Extract client_id from the response correctly
        console.log("Client creation response:", response.data)

        // If response is in format {"message":"Client created successfully","client_id":7}
        if (response.data && response.data.client_id) {
          return response.data.client_id
        }
        // Fallback to id if client_id isn't available
        else if (response.data && response.data.id) {
          return response.data.id
        }

        throw new Error("No client ID returned from API")
      } catch (error) {
        console.error("Error creating client:", error)
        throw error
      }
    }

    // Function to handle the submit button click - used to immediately disable the button
    const handleSubmitButtonClick = (e: React.MouseEvent) => {
      if (isSubmitting) {
        e.preventDefault()
        return
      }

      // Check for double-click (clicks within 1000ms)
      const now = Date.now()
      if (now - lastSubmitTime.current < 1000) {
        e.preventDefault()
        return
      }

      lastSubmitTime.current = now
      setIsSubmitting(true)

      // Let the form submit normally after disabling the button
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      // If already submitting, prevent duplicate submission
      if (isSubmitting) return

      setIsSubmitting(true)

      try {
        // Get client_id - either from selected client or create a new one
        let clientId = selectedClient?.id
        if (!clientId) {
          clientId = await createClient()
        }

        // Format the booking data according to the API requirements
        const bookingData = {
          client_id: clientId,
          workspace_id: workspaceId,
          start_time: formData.startTime,
          end_time: formData.endTime,
          status: formData.status,
          price: 0, // Add price field if needed
        }

        // Create the booking
        const response = await axiosInstance.post(
          "/api/booking/bookings",
          bookingData,
        )

        // Log the response to see its structure
        console.log("Booking creation response:", response.data)

        // Get the booking ID from the response (adapt this based on the actual response structure)
        let bookingId = ""
        if (response.data && response.data.id) {
          bookingId = response.data.id.toString()
        } else if (response.data && response.data.booking_id) {
          bookingId = response.data.booking_id.toString()
        } else {
          // Generate a temporary ID if none is provided by API
          bookingId = Date.now().toString()
        }

        // Transform API response to match frontend model and call onSave
        const appointmentData: Appointment = {
          ...formData,
          id: bookingId,
          clientId: clientId,
        }

        // Call onSave without await
        onSave(appointmentData)

        // Close the modal first
        onClose()

        // Reload the page after a small delay to ensure onSave processing completes
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } catch (error) {
        console.error("Error saving appointment:", error)
        alert("Ошибка при сохранении записи. Проверьте консоль для деталей.")
        setIsSubmitting(false)
      }
    }

    const handleDelete = async () => {
      if (appointment && appointment.id && onDelete) {
        setIsSubmitting(true)
        try {
          await onDelete(appointment.id)
          window.location.reload()
        } catch (error) {
          console.error("Error deleting appointment:", error)
          setIsSubmitting(false)
        }
      }
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              {isNewAppointment ? "Новая запись" : "Редактировать запись"}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
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

          <form ref={formRef} onSubmit={handleSubmit} className="p-4">
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Клиент{" "}
                {selectedClient && (
                  <span className="text-green-600 text-xs">
                    (Выбран существующий клиент)
                  </span>
                )}
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Имя клиента"
                required
                disabled={isSubmitting}
                onFocus={() =>
                  filteredClients.length > 0 && setShowSuggestions(true)
                }
              />

              {/* Client suggestions dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionRef}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                >
                  {isLoadingClients ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Загрузка клиентов...
                    </div>
                  ) : filteredClients.length > 0 ? (
                    filteredClients.slice(0, 5).map((client) => (
                      <div
                        key={client.id}
                        className="cursor-pointer hover:bg-blue-50 px-4 py-2"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="font-medium">
                          {client.name} {client.surname}
                        </div>
                        {client.phone && (
                          <div className="text-sm text-gray-600">
                            {client.phone}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Нет совпадений. Будет создан новый клиент.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="+7 (XXX) XXX-XX-XX"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Начало
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Окончание
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Место проведения
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Место проведения"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={isSubmitting}
              >
                <option value="new">Новое</option>
                <option value="confirmed">Подтверждено</option>
                <option value="canceled">Отменено</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Комментарий
              </label>
              <textarea
                name="comment"
                value={formData.comment || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Комментарий"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                onClick={() => setShowClientDetails(!showClientDetails)}
                disabled={isSubmitting}
              >
                {showClientDetails ? "Скрыть" : "Показать"} дополнительную
                информацию
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
                  className={`ml-1 transform ${showClientDetails ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            {showClientDetails && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория клиента
                  </label>
                  <select
                    name="clientType"
                    value={formData.clientType || "regular"}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={isSubmitting}
                  >
                    <option value="regular">Обычный</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Персональная скидка (%)
                  </label>
                  <input
                    type="number"
                    name="personalDiscount"
                    value={formData.personalDiscount || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Примечания
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Что любит, предпочтения и т.д."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}

            <div className="flex justify-between space-x-2 pt-2 border-t border-gray-200">
              {!isNewAppointment && onDelete && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Удалить
                </Button>
              )}

              <div className="flex ml-auto space-x-2">
                <Button
                  variant="outline"
                  onClick
                  ={onClose}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button
                  ref={submitButtonRef}
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={handleSubmitButtonClick}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Сохранение...
                    </span>
                  ) : isNewAppointment ? (
                    "Создать"
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

export default AppointmentModal