"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { AppointmentModalProps, Appointment, ApiClient } from "../types"
import Button from "@/components/UI/Button"
import axiosInstance from "@/lib/axios"
import { XIcon, ChevronDownIcon, Loader2 } from "lucide-react"

const AppointmentModal: React.FC<AppointmentModalProps> = ({
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
    startTime: selectedHour ? `${selectedHour.toString().padStart(2, "0")}:00` : "09:00",
    endTime: selectedHour ? `${(selectedHour + 1).toString().padStart(2, "0")}:00` : "10:00",
    clientName: "",
    phoneNumber: "",
    location: "",
    status: "new",
    comment: "",
    clientType: "regular",
    dateOfBirth: "",
    personalDiscount: "",
    notes: "",
  }
  const [formData, setFormData] = useState<Appointment>(emptyAppointment)
  const [showClientDetails, setShowClientDetails] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<ApiClient[]>([])
  const [filteredClients, setFilteredClients] = useState<ApiClient[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ApiClient | null>(null)
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const suggestionRef = useRef<HTMLDivElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const submissionInProgressRef = useRef<boolean>(false)
  const submissionPromiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    console.log("Modal isOpen changed or dependencies updated:", { isOpen, appointmentId: appointment?.id })
    if (isOpen) {
      fetchClients()
      if (appointment) {
        console.log("Setting form data from existing appointment:", appointment)
        setFormData({
          ...emptyAppointment,
          ...appointment,
          personalDiscount: appointment.personalDiscount?.toString() ?? "",
        })
      } else {
        console.log("Resetting form data for new appointment.")
        setFormData(emptyAppointment)
        setSelectedClient(null)
      }
      setFormError(null)
      setIsSubmitting(false)
      submissionInProgressRef.current = false
      submissionPromiseRef.current = null
      console.log("Modal opened, submission flags reset")
    }
  }, [isOpen, appointment, selectedHour, selectedDate, workspaceId])

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
      setShowSuggestions(filtered.length > 0 && (formData.clientName.length > 0 || formData.phoneNumber.length > 0))
    } else {
      setFilteredClients([])
      setShowSuggestions(false)
    }
  }, [formData.clientName, formData.phoneNumber, clients])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
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
      setClients([])
    } finally {
      setIsLoadingClients(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleSelectClient = (client: ApiClient) => {
    setSelectedClient(client)
    setFormData((prev) => ({
      ...prev,
      clientName: `${client.name} ${client.surname}`,
      phoneNumber: client.phone || "",
      clientType: client.category === "vip" ? "vip" : "regular",
      dateOfBirth: client.birth_date || "",
      personalDiscount: client.personal_discount?.toString() ?? "",
      notes: client.prefernces || "",
      comment: client.comments || prev.comment,
    }))
    setShowSuggestions(false)
  }

  const createClient = async (): Promise<string> => {
    console.log("createClient called")
    const clientData = {
      name: formData.clientName.split(" ")[0] || "",
      surname: formData.clientName.split(" ").slice(1).join(" ") || "",
      phone: formData.phoneNumber,
      category: formData.clientType === "vip" ? "vip" : "regular",
      personal_discount: formData.personalDiscount ? Number.parseFloat(formData.personalDiscount as string) : null,
      birth_date: formData.dateOfBirth || null,
      prefernces: formData.notes || null,
      comments: formData.comment || null,
    }

    try {
      console.log("Attempting to POST /api/client/create_client", clientData)
      const response = await axiosInstance.post("/api/client/create_client", clientData)
      console.log("Client creation response:", response.data)
      if (response.data && (response.data.client_id || response.data.id)) {
        return response.data.client_id || response.data.id
      }
      throw new Error("No client ID returned from API after client creation")
    } catch (error) {
      console.error("Error creating client:", error)
      throw error
    }
  }

  const validateForm = () => {
    if (!formData.clientName.trim() || !formData.phoneNumber.trim()) {
      setFormError("Пожалуйста, заполните имя клиента и номер телефона")
      return false
    }
    if (!formData.startTime || !formData.endTime) {
      setFormError("Пожалуйста, укажите время начала и окончания")
      return false
    }
    if (formData.startTime >= formData.endTime) {
      setFormError("Время начала должно быть раньше времени окончания")
      return false
    }
    return true
  }

  const performSubmission = async () => {
    console.log("performSubmission started")

    let clientId = selectedClient?.id
    if (!clientId && formData.clientName && formData.phoneNumber) {
      console.log("No selected client, attempting to create new client.")
      clientId = await createClient()
      console.log("New client created/retrieved, ID:", clientId)
    } else if (selectedClient?.id) {
      console.log("Using selected client ID:", clientId)
    }

    if (!clientId) {
      throw new Error("Client ID is missing. Cannot proceed with booking.")
    }

    const bookingData = {
      client_id: clientId,
      workspace_id: workspaceId,
      start_time: formData.startTime,
      end_time: formData.endTime,
      status: formData.status,
      price: 0,
      location: formData.location,
      comment: formData.comment,
    }
    console.log("Booking data prepared:", bookingData)

    let response
    if (isNewAppointment) {
      console.log("Attempting to POST /api/booking/bookings (new appointment)")
      response = await axiosInstance.post("/api/booking/bookings", bookingData)
    } else {
      console.log(`Attempting to PUT /api/booking/bookings (update appointment ID: ${appointment?.id})`)
      response = await axiosInstance.put("/api/booking/bookings", {
        ...bookingData,
        id: Number.parseInt(appointment!.id),
      })
    }
    console.log("Booking API response:", response.data)

    let bookingId = ""
    if (response.data && response.data.id) {
      bookingId = response.data.id.toString()
    } else if (response.data && response.data.booking_id) {
      bookingId = response.data.booking_id.toString()
    } else {
      console.warn("Booking ID not found in response, generating a temporary one.")
      bookingId = `temp_${Date.now()}`
    }

    const appointmentData: Appointment = {
      ...formData,
      id: bookingId,
      clientId: clientId,
    }
    console.log("Appointment data for onSave:", appointmentData)

    if (onSave) {
      await onSave(appointmentData)
      console.log("onSave callback completed.")
    }
    onClose()
    console.log("Modal closed after successful submission.")
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    console.log("handleSubmit called. submissionInProgressRef:", submissionInProgressRef.current)

    // Early return if submission is already in progress
    if (submissionInProgressRef.current) {
      console.warn("Submission already in progress, ignoring duplicate request")
      return
    }

    if (!validateForm()) {
      console.log("Form validation failed.")
      return
    }

    console.log("Form validated, proceeding with submission.")
    submissionInProgressRef.current = true
    setIsSubmitting(true)
    setFormError(null)

    try {
      await performSubmission()
      console.log("Submission completed successfully")
    } catch (error: any) {
      console.error("Error during submission process:", error)
      setFormError(
        error.response?.data?.detail || error.message || "Ошибка при сохранении записи. Пожалуйста, попробуйте снова.",
      )
    } finally {
      console.log("Submission process finished (finally block). Resetting submission flags.")
      submissionInProgressRef.current = false
      submissionPromiseRef.current = null
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    console.log("handleDelete called for appointment ID:", appointment?.id)
    if (appointment && appointment.id && appointment.id.trim() !== "" && onDelete) {
      if (!confirm("Вы уверены, что хотите удалить эту запись?")) {
        console.log("Deletion cancelled by user.")
        return
      }

      if (submissionInProgressRef.current) {
        console.warn("Operation already in progress")
        return
      }
      submissionInProgressRef.current = true
      setIsSubmitting(true)
      setFormError(null)

      try {
        console.log(`Attempting to call onDelete prop for ID: ${appointment.id}`)
        await onDelete(appointment.id)
        console.log("onDelete prop completed.")
        onClose()
        console.log("Modal closed after successful deletion.")
      } catch (error: any) {
        console.error("Error deleting appointment:", error)
        setFormError(error.response?.data?.detail || "Ошибка при удалении записи. Пожалуйста, попробуйте снова.")
      } finally {
        console.log("Deletion process finished (finally block). Resetting submission flags.")
        submissionInProgressRef.current = false
        setIsSubmitting(false)
      }
    } else {
      console.warn("Cannot delete: missing appointment data or onDelete handler.", {
        hasAppointment: !!appointment,
        appointmentId: appointment?.id,
        hasOnDelete: !!onDelete,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto my-8">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {isNewAppointment ? "Создать новую запись" : "Редактировать запись"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-4 space-y-4" noValidate>
          {formError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-300 rounded-md text-sm">
              {formError}
            </div>
          )}

          <div className="relative">
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя клиента
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Имя клиента"
              required
              disabled={isSubmitting}
              autoComplete="off"
            />
            {showSuggestions && (
              <div
                ref={suggestionRef}
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {isLoadingClients ? (
                  <div className="p-2 text-gray-500 dark:text-gray-400">Загрузка...</div>
                ) : filteredClients.length === 0 ? (
                  <div className="p-2 text-gray-500 dark:text-gray-400">Нет результатов</div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {client.name} {client.surname}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{client.phone || "Нет телефона"}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Номер телефона
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="+7 (XXX) XXX-XX-XX"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Начало
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Окончание
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Место проведения
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Место проведения"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Статус
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="new">Новое</option>
              <option value="confirmed">Подтверждено</option>
              <option value="canceled">Отменено</option>
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Комментарий"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
              onClick={() => setShowClientDetails(!showClientDetails)}
              disabled={isSubmitting}
            >
              {showClientDetails ? "Скрыть" : "Показать"} дополнительную информацию
              <ChevronDownIcon
                className={`ml-1 h-4 w-4 transform transition-transform ${showClientDetails ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {showClientDetails && (
            <>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Дата рождения
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="clientType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тип клиента
                </label>
                <select
                  id="clientType"
                  name="clientType"
                  value={formData.clientType || "regular"}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                >
                  <option value="regular">Обычный</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="personalDiscount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Персональная скидка (%)
                </label>
                <input
                  type="number"
                  id="personalDiscount"
                  name="personalDiscount"
                  value={formData.personalDiscount || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Заметки
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Заметки о клиенте"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 sm:space-y-0 sm:space-x-2">
            <div>
              {!isNewAppointment && onDelete && appointment?.id && appointment.id.trim() !== "" && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-700/30 dark:text-red-300 dark:hover:bg-red-600/50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Удаление...
                    </span>
                  ) : (
                    "Удалить"
                  )}
                </Button>
              )}
            </div>
            <div className="flex w-full sm:w-auto space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Отмена
              </Button>
              <Button
                ref={submitButtonRef}
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
                onClick={(e) => {
                  if (submissionInProgressRef.current) {
                    e.preventDefault()
                    console.warn("Submission in progress, ignoring button click")
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
