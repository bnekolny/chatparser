import React from 'react';
import styles from './styles/LandscapeBlocker.module.css';

const NoLandscapePhone: React.FC = () => {
	return (
		<div className={styles.noLandscape}>
			<img
				src="https://cdn.bfldr.com/Z0BJ31FP/at/wrszrqk8r6t8j6xfbjvkfw/icon-rotate-phone-vertical.png"
				alt="Please rotate your device"
			/>
		</div>
	);
};

export default NoLandscapePhone;
