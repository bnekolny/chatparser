import React from 'react';
import styles from './styles/Button.module.css';

interface ButtonProps {
	type: 'submit' | 'button';
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	type,
	onClick,
	disabled,
	className,
	children,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${styles.button} ${className ? styles[className] : ''}`}
		>
			{children}
		</button>
	);
};

export default Button;
