import React from 'react';
import TestTextButton from './TestTextButton';
import TestPromptTextArea from './TestPromptTextArea';
import styles from './styles/DevToolsPane.module.css';

const DevToolsPane: React.FC = () => {
  return (
    <div className={styles.devToolsPane}>
      <TestTextButton />
      <TestPromptTextArea />
      {/* Add more dev tools here as needed */}
    </div>
  );
};

export default DevToolsPane;
