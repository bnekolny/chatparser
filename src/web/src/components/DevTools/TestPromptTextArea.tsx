import React, { useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Mode } from '../../types';
import styles from './styles/TestPromptTextArea.module.css';
import Button from '../Button';

const TestPromptTextArea: React.FC = () => {
  const { setText, handleSendMessage, prompt, setPrompt, mode, setMode } = useChatContext();

  useEffect(() => {
    (async () => {
      const response = await fetch(`/assets/prompts/en/${mode}.txt`);
      setPrompt(await response.text());
    })();
  }, [mode, setText]);

  const handleSubmit = () => {
    handleSendMessage();
  };

  return (
    <div>
      <select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
        {Object.values(Mode).map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Enter test prompt here..."
        className={styles.testPromptTextArea}
      />
      <Button
        type="button"
        onClick={handleSubmit}
        className={styles.submitButton}
      >
        Submit Prompt
      </Button>
    </div>
  );
};

export default TestPromptTextArea;



