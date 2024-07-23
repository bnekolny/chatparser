import React from 'react';
import styles from './styles/ModeSelector.module.css';
import {Mode} from '../types';
import {capitalizeFirstLetter} from '../utils';
import {useChatContext} from '../context/ChatContext';

const ModeSelector: React.FC = () => {
	const {mode, setMode} = useChatContext();
	return (
		<div className={styles.modeSelector}>
			<div className={styles.selector}>
				<input
					type="radio"
					id={Mode.Verify}
					name="mode"
					value={Mode.Verify}
					checked={mode === Mode.Verify}
					onChange={() => setMode(Mode.Verify)}
				/>
				<label htmlFor={Mode.Verify}>
					{capitalizeFirstLetter(Mode.Verify)}
				</label>
			</div>

			<div className={styles.selector}>
				<input
					type="radio"
					id={Mode.Improve}
					name="mode"
					value={Mode.Improve}
					checked={mode === Mode.Improve}
					onChange={() => setMode(Mode.Improve)}
				/>
				<label htmlFor={Mode.Improve}>
					{capitalizeFirstLetter(Mode.Improve)}
				</label>
			</div>
		</div>
	);
};

export default ModeSelector;
