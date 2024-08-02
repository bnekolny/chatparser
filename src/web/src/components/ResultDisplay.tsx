import {useChatContext} from '../context/ChatContext';
import Markdown from 'react-markdown';
import styles from './styles/ResultDisplay.module.css';

const ResultDisplay: React.FC = () => {
	const {response} = useChatContext();

	if (response) {
		return <div className={styles.markdownContainer}>
				<Markdown>{response}</Markdown>
			</div>;
	}

	return null;
};

export default ResultDisplay;
