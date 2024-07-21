import React from 'react';
import {useChatContext} from '../context/ChatContext';
import {useMessageApi} from '../hooks/useMessageApi';

const TestTextButton: React.FC = () => {
	const {setText, mode} = useChatContext();
	const {sendMessage} = useMessageApi();

	const testString = `
    👋 hola! Creo que estamos lista para la próxima cita contigo! Puedas avisarme a cuando traerle? Lo más fácil para nosotros es algun tiempo después de 14:00, si es posible durante la semana o cualquier hora en el fin de semana. 

    Gracias!
    `.trim();

	const submitTestText = async () => {
		setText(testString);
		await sendMessage(testString, mode);
	};

	return (
		<button
			type="button"
			onClick={submitTestText}
			className="button"
			style={{marginTop: '30px'}}
		>
			Submit test text
		</button>
	);
};

export default TestTextButton;
