import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TextInputForm: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // TODO: make this dynamic for the environment
      const response = await fetch('/api/message/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: text,
      });
      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error('Error submitting text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [text]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          className="textarea"
          rows={1}
          placeholder="Enter your text here"
        ></textarea>
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div className="result">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
      <p className="description">
        This page exists to help with taking a message that you're about to send, as a Spanish learner, and giving feedback on grammatical usage and suggestions for improvements.
      </p>
    </div>
  );
};

export default TextInputForm;
