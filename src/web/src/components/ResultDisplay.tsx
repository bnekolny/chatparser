import {useChatContext} from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';

const ResultDisplay: React.FC = () => {
	const {response} = useChatContext();

	if (response) {
		return <ReactMarkdown>{response}</ReactMarkdown>;
	}

	return null;
};

export default ResultDisplay;
