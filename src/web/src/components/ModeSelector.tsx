import React from 'react';
import styles from './styles/ModeSelector.module.css';
import {Mode} from '../types';
import {capitalizeFirstLetter} from '../utils';

interface ModeSelectorProps {
	mode: Mode;
	setMode: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({mode, setMode}) => {
	return (
		<div className={styles.modeSelector}>
			<input
				type="radio"
				id={Mode.Verify}
				name="mode"
				value={Mode.Verify}
				checked={mode === Mode.Verify}
				onChange={() => setMode(Mode.Verify)}
			/>
			<label htmlFor={Mode.Verify}>{capitalizeFirstLetter(Mode.Verify)}</label>

			<input
				type="radio"
				id={Mode.Improve}
				name="mode"
				value={Mode.Improve}
				checked={mode === Mode.Improve}
				onChange={() => setMode(Mode.Improve)}
			/>
			<label htmlFor={Mode.Improve}>{capitalizeFirstLetter(Mode.Verify)}</label>
		</div>
	);
};

export default ModeSelector;
