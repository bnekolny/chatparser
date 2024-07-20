import React from 'react';
import styles from './styles/TextArea.module.css';

interface TextAreaProps {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
	value,
	onChange,
	placeholder = 'Enter your text here',
}) => {
	const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const target = e.currentTarget;
		target.style.height = 'auto';
		target.style.height = target.scrollHeight + 'px';
	};

	return (
		<textarea
			value={value}
			onChange={onChange}
			className={styles.textarea}
			rows={1}
			placeholder={placeholder}
			style={{resize: 'vertical', overflow: 'hidden'}}
			onInput={handleInput}
		/>
	);
};

export default TextArea;
