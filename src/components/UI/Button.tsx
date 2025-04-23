import React from 'react'
import { ButtonProps } from '../types'

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	variant = 'primary',
	size = 'medium',
	disabled = false,
	type = 'button',
	className = '',
}) => {
	const baseStyles = 'rounded-md font-medium transition-colors'

	const variantStyles = {
		primary: 'bg-blue-500 text-white hover:bg-blue-600',
		secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
		outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
	}

	const sizeStyles = {
		small: 'px-3 py-1 text-sm',
		medium: 'px-4 py-2',
		large: 'px-6 py-3 text-lg',
	}

	const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

	const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`

	return (
		<button
			type={type}
			className={buttonClasses}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

export default Button