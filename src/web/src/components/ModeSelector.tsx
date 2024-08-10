import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './styles/ModeSelector.module.css';
import {Mode} from '../types';
import {capitalizeFirstLetter} from '../utils/languageUtils';
import {useChatContext} from '../context/ChatContext';

const ModeSelector: React.FC = () => {
	const {t} = useTranslation();
	const {mode, setMode} = useChatContext();

	return (
		<div className={styles.modeSelector}>
			<span className={styles.selector}>
				<input
					type="radio"
					id={Mode.Verify}
					name="mode"
					value={Mode.Verify}
					checked={mode === Mode.Verify}
					onChange={() => setMode(Mode.Verify)}
				/>
				<label htmlFor={Mode.Verify}>
					{t(capitalizeFirstLetter(Mode.Verify))}
				</label>
			</span>

			<span className={styles.selector}>
				<input
					type="radio"
					id={Mode.Improve}
					name="mode"
					value={Mode.Improve}
					checked={mode === Mode.Improve}
					onChange={() => setMode(Mode.Improve)}
				/>
				<label htmlFor={Mode.Improve}>
					{t(capitalizeFirstLetter(Mode.Improve))}
				</label>
			</span>
		</div>
	);
};

export default ModeSelector;
