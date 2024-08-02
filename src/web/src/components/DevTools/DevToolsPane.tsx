import React, { useEffect } from 'react';
import TestTextButton from './TestTextButton';
import TestPromptTextArea from './TestPromptTextArea';
import styles from './styles/DevToolsPane.module.css';

const DevToolsPane: React.FC = () => {
  useEffect(() => {
    document.body.classList.add(styles.devToolsPaneActive);
    return () => {
      document.body.classList.remove(styles.devToolsPaneActive);
    };
  }, []);

  return (
    <div className={styles.devToolsPane}>
      <TestTextButton />
      <TestPromptTextArea />
      {/* Add more dev tools here as needed */}
    </div>
  );
};

export default DevToolsPane;