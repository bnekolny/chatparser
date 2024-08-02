import React, { useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Mode, Locale } from '../../types';
import styles from './styles/TestPromptTextArea.module.css';
import Button from '../Button';

const TestPromptTextArea: React.FC = () => {
  const { handleSendMessage, prompt, setPrompt, mode, setMode, locale, setLocale } = useChatContext();

  useEffect(() => {
    (async () => {
      const response = await fetch(`/assets/prompts/${locale}/${mode}.txt`);
      setPrompt(await response.text());
    })();
  }, [locale, mode]);

  return (
    <div>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
        {Object.values(Locale).map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
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
        onClick={() => handleSendMessage()}
        className={styles.submitButton}
      >
        Submit Prompt
      </Button>
    </div>
  );
};

export default TestPromptTextArea;



