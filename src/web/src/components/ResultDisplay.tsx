import styles from './styles/ResultDisplay.module.css';
import {useChatContext} from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';

const ResultDisplay: React.FC = () => {
	const {response} = useChatContext();

	if (response) {
		return (
			<ReactMarkdown className={styles.response}>{response}</ReactMarkdown>
		);
	}

	return null;
};

export default ResultDisplay;
