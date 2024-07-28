import React from 'react';
import {useChatContext} from '../context/ChatContext';
import styles from './styles/Button.module.css';

const TestTextButton: React.FC = () => {
	const {setText} = useChatContext();

	const testString = `
    👋 hola! Creo que estamos lista para la próxima cita contigo! Puedas avisarme a cuando traerle? Lo más fácil para nosotros es algun tiempo después de 14:00, si es posible durante la semana o cualquier hora en el fin de semana. 

    Gracias!
    `.trim();

	const submitTestText = async () => {
		setText(testString);
	};

	return (
		<button
			type="button"
			onClick={submitTestText}
			className={styles.submitTestText}
		>
			Submit test text
		</button>
	);
};

export default TestTextButton;
