import React from 'react'
import { useWorkspace } from '@/contexts/WorkspaceContext'

const WorkspaceInfo: React.FC = () => {
	const { workspace, loading } = useWorkspace()

	if (loading) {
		return <div className="text-gray-500">Загрузка...</div>
	}

	if (!workspace) {
		return null
	}

	return (
		<div className="flex items-center">
			<div className="text-sm">
				<span className="text-gray-500 mr-1">Рабочее пространство:</span>
				<span className="font-medium">{workspace.name}</span>
				<span className="text-gray-400 mx-1">•</span>
				<span className="text-gray-500">{workspace.location}</span>
			</div>
		</div>
	)
}

export default WorkspaceInfo