import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatContext } from '../../context/ChatContext';
import { Mode, Locale } from '../../types';
import styles from './styles/TestPromptTextArea.module.css';
import Button from '../Button';
import {shortLanguageCode} from '../../utils';

const TestPromptTextArea: React.FC = () => {
  const { handleSendMessage, prompt, setPrompt, mode, setMode } = useChatContext();
  const { i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      const response = await fetch(`/assets/prompts/${i18n.language}/${mode}.txt`);
      setPrompt(await response.text());
    })();
  }, [i18n.language, mode]);

  return (
    <div>
      <select value={shortLanguageCode(i18n.language)} onChange={(event) => i18n.changeLanguage(event.target.value as Locale)}>
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



