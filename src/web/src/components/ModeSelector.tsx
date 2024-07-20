import React from 'react';
import styles from './styles/ModeSelector.module.css';
import {Mode} from '../types';

interface ModeSelectorProps {
	mode: Mode;
	setMode: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({mode, setMode}) => {
	return (
		<div className={styles.modeSelector}>
			<input
				type="radio"
				id="verify"
				name="mode"
				value="verify"
				checked={mode === Mode.Verify}
				onChange={() => setMode(Mode.Verify)}
			/>
			<label htmlFor="verify">Verify</label>

			<input
				type="radio"
				id="improve"
				name="mode"
				value="improve"
				checked={mode === Mode.Improve}
				onChange={() => setMode(Mode.Improve)}
			/>
			<label htmlFor="improve">Improve</label>
		</div>
	);
};

export default ModeSelector;
