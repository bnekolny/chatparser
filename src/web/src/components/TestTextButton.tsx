import React from 'react';
import {Mode} from './../types';

interface TestTextButtonProps {
	setTextFunction: (arg0: string) => void;
	sendMessageFunction: (arg0: string, arg1: Mode) => void;
}

const TestTextButton: React.FC<TestTextButtonProps> = ({
	setTextFunction,
	sendMessageFunction,
}) => {
	const testString = `
    👋 hola! Creo que estamos lista para la próxima cita contigo! Puedas avisarme a cuando traerle? Lo más fácil para nosotros es algun tiempo después de 14:00, si es posible durante la semana o cualquier hora en el fin de semana. 

    Gracias!
    `.trim();

	const submitTestText = async () => {
		setTextFunction(testString);
		sendMessageFunction(testString, Mode.Verify);
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
