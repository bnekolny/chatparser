import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TextInputForm: React.FC = () => {
  const [previousText, setPreviousText] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [revisedMessage, setRevisedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>('verify');

  const hasNewText = () : boolean => {
    console.log(`previousText: ${previousText}`)
    return text !== previousText;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // Store the submitted text
    setPreviousText(text);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      const [resultWithoutRevision, revisedMessage] = parseResponse(data);

      console.log(`resultWithoutRevision: ${resultWithoutRevision}`)
      console.log(`revisedMessage: ${revisedMessage}`);
      setResult(resultWithoutRevision);
      setRevisedMessage(revisedMessage);
    } catch (error) {
      console.error('Error submitting text:', error);
      setResult('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseResponse = (data: string): [string, string] => {
    const aiResponseRevisedMessageRegex = /[\*]*Revised Message:[\*]*([\s\S]*)/;
    const revisedMessageMatch = data.match(aiResponseRevisedMessageRegex);
    const revisedMessage = revisedMessageMatch ? revisedMessageMatch[1].trim() : '';
    const resultWithoutRevision = data.replace(aiResponseRevisedMessageRegex, '').trim();
    return [resultWithoutRevision, revisedMessage];
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
          style={{ resize: 'vertical', overflow: 'hidden' }}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
            const target = e.currentTarget
            target.style.height = 'auto'
            target.style.height = target.scrollHeight + 'px'
          }}
        ></textarea>
        <button type="submit" className="button" disabled={!hasNewText() || isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        <div className="button-container">
          <button type="button" className="button copy-button" onClick={() => navigator.clipboard.writeText(text)} style={{ width: '48%', backgroundColor: '#81C784'}}>
            Copy
          </button>
          <button type="button" className="button clear-button" onClick={() => setText('')} style={{ width: '48%', backgroundColor: '#E57373' }}>
            Clear
          </button>
        </div>
      </form>
      {result && (
        <div className="result">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
      {revisedMessage && (
        <div className="result">
          <div className="result-content">
            <ReactMarkdown>**Revised Message:**</ReactMarkdown>
            <ReactMarkdown>{revisedMessage}</ReactMarkdown>
          </div>
          <div className="button-container">
            <button type="button" className="button copy-button" onClick={() => navigator.clipboard.writeText(text)} style={{ width: '48%', backgroundColor: '#81C784'}}>
              Copy
            </button>
            <button type="button" className="button clear-button" onClick={() => {
                setText(revisedMessage);
                handleSubmit(event);
                // scroll to top with new submission
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'auto',
                });
                }}  disabled={isLoading} style={{ width: '48%'}}>
                {isLoading ? 'Loading...' : 'Submit Revised Message'}
            </button>
          </div>
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
