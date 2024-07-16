import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TextInputForm: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>('verify');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/message/${mode}`, {
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
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'improve' || hash === 'verify') {
      setMode(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = mode;
  }, [mode]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <textarea
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
      <div className="mode-and-description">
        <div className="mode-selector">
          <input
            type="radio"
            id="verify"
            name="mode"
            value="verify"
            checked={mode === 'verify'}
            onChange={() => setMode('verify')}
          />
          <label htmlFor="verify">Verify</label>

          <input
            type="radio"
            id="improve"
            name="mode"
            value="improve"
            checked={mode === 'improve'}
            onChange={() => setMode('improve')}
          />
          <label htmlFor="improve">Improve</label>
        </div>
        <p className="description">
          This page helps with composing messages in Spanish as a learner. Input a message that you want to send either to "verify" it has the intended meaning, or to "improve" and push your abilities.
        </p>
      </div>
    </div>
  );
};

export default TextInputForm;
