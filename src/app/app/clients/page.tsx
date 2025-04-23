'use client'

import React, { useState } from 'react'
import ClientCard, { Client } from '@/components/Client/ClientCard'
import ClientModal from '@/components/Client/ClientModal'
import Button from '@/components/UI/Button'
import Link from 'next/link'

const MOCK_CLIENTS: Client[] = [
	{
		id: '1',
		name: 'Иванова Анна',
		phoneNumber: '+7 777 777 77 77',
		category: 'vip',
		dateOfBirth: '1990-05-15',
		discount: 10,
		notes: 'Предпочитает утренние часы. Любит зеленый чай во время процедур.',
		visits: [
			{ id: 'v1', date: '2023-12-10', service: 'Маникюр', amount: 2500 },
			{ id: 'v2', date: '2023-11-25', service: 'Стрижка', amount: 3500 },
			{ id: 'v3', date: '2023-10-15', service: 'Окрашивание', amount: 5000 },
		]
	},
	{
		id: '2',
		name: 'Петров Сергей',
		phoneNumber: '+7 888 888 88 88',
		category: 'regular',
		dateOfBirth: '1985-08-25',
		visits: [
			{ id: 'v4', date: '2023-12-05', service: 'Стрижка', amount: 1500 },
		]
	}
]

export default function ClientsPage() {
	const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined)
	const [searchQuery, setSearchQuery] = useState('')

	const handleEditClient = (client: Client) => {
		setSelectedClient(client)
		setIsModalOpen(true)
	}

	const handleAddClient = () => {
		setSelectedClient(undefined)
		setIsModalOpen(true)
	}

	const handleSaveClient = (client: Client) => {
		if (selectedClient) {
			setClients(clients.map(c => c.id === client.id ? client : c))
		} else {
			setClients([...clients, client])
		}
	}

	const filteredClients = searchQuery.trim()
		? clients.filter(client =>
			client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			client.phoneNumber.includes(searchQuery)
		)
		: clients

	return (
		<div className="flex flex-col h-screen">
			<header className="bg-white shadow-sm border-b border-gray-200 py-4">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<div className="text-blue-600 font-bold text-2xl">OYAU</div>
						<div className="text-gray-500">- Название компании</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="text-sm text-gray-500">Подписка действует до 07.04.2024</div>
						<button className="bg-blue-500 text-white px-4 py-2 rounded-md">Обновить</button>
						<div className="relative">
							<input
								type="text"
								placeholder="Поиск клиента"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
							/>
							<svg
								className="absolute left-3 top-2.5 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							</svg>
						</div>
						<button className="p-2 rounded-full hover:bg-gray-100">
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
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
								<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
							</svg>
						</button>
						<button className="p-2 rounded-full hover:bg-gray-100">
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
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</svg>
						</button>
					</div>
				</div>
			</header>

			<main className="flex flex-grow overflow-hidden">
				<aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-8">
					<Link href="/app" className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
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
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
							<polyline points="9 22 9 12 15 12 15 22"></polyline>
						</svg>
					</Link>
					<Link href="/app/clients" className="p-3 text-blue-600 bg-blue-100 rounded-lg">
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
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</Link>
					<a href="#" className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
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
							<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
							<line x1="8" y1="21" x2="16" y2="21"></line>
							<line x1="12" y1="17" x2="12" y2="21"></line>
						</svg>
					</a>
					<a href="#" className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
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
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
					</a>
					<a href="#" className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
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
							<line x1="4" y1="21" x2="4" y2="14"></line>
							<line x1="4" y1="10" x2="4" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12" y2="3"></line>
							<line x1="20" y1="21" x2="20" y2="16"></line>
							<line x1="20" y1="12" x2="20" y2="3"></line>
							<line x1="1" y1="14" x2="7" y2="14"></line>
							<line x1="9" y1="8" x2="15" y2="8"></line>
							<line x1="17" y1="16" x2="23" y2="16"></line>
						</svg>
					</a>
				</aside>

				<div className="flex-grow p-6 overflow-y-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold">Клиенты</h1>
						<Button variant="primary" onClick={handleAddClient}>
							<span className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2"
								>
									<line x1="12" y1="5" x2="12" y2="19"></line>
									<line x1="5" y1="12" x2="19" y2="12"></line>
								</svg>
								Добавить клиента
							</span>
						</Button>
					</div>

					{filteredClients.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredClients.map(client => (
								<ClientCard
									key={client.id}
									client={client}
									onEdit={handleEditClient}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-gray-400 mb-4"
							>
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</svg>
							<p className="text-gray-600 mb-4">
								{searchQuery.trim()
									? 'Клиенты по вашему запросу не найдены'
									: 'У вас пока нет ни одного клиента'}
							</p>
							{!searchQuery.trim() && (
								<Button variant="primary" onClick={handleAddClient}>
									Добавить клиента
								</Button>
							)}
						</div>
					)}
				</div>
			</main>

			<ClientModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				client={selectedClient}
				onSave={handleSaveClient}
			/>
		</div>
	)
}