import React from 'react'
import { CalendarHeaderProps } from '../types'
import Button from '../UI/Button'

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
	date,
	onPrevDay,
	onNextDay,
	onToday,
	viewMode,
	onViewModeChange,
}) => {
	const formatDate = (date: Date): string => {
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}
		return date.toLocaleDateString('ru-RU', options)
	}

	return (
		<div className="flex justify-between items-center py-4">
			<div className="flex items-center">
				<Button
					variant="outline"
					size="medium"
					onClick={onToday}
					className="mr-2"
				>
					Сегодня
				</Button>
				<div className="flex items-center space-x-1">
					<button
						onClick={onPrevDay}
						className="p-2 rounded hover:bg-gray-100"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="15 18 9 12 15 6"></polyline>
						</svg>
					</button>
					<button
						onClick={onNextDay}
						className="p-2 rounded hover:bg-gray-100"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</button>
				</div>
				<h2 className="text-xl font-bold ml-4">{formatDate(date)}</h2>
			</div>

			<div className="flex border rounded-md">
				<button
					onClick={() => onViewModeChange('day')}
					className={`px-4 py-2 ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-white'}`}
				>
					День
				</button>
				<button
					onClick={() => onViewModeChange('week')}
					className={`px-4 py-2 ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-white'}`}
				>
					Неделя
				</button>
				<button
					onClick={() => onViewModeChange('month')}
					className={`px-4 py-2 ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-white'}`}
				>
					Месяц
				</button>
			</div>

			<div className="flex items-center">
				<button className="p-2 rounded-full hover:bg-gray-100">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</button>
				<button className="p-2 rounded-full hover:bg-gray-100">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
						<polyline points="17 21 17 13 7 13 7 21"></polyline>
						<polyline points="7 3 7 8 15 8"></polyline>
					</svg>
				</button>
				<button className="p-2 rounded-full hover:bg-gray-100">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
				</button>
			</div>
		</div>
	)
}

export default CalendarHeader