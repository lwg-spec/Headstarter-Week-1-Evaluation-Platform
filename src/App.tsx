import { useState } from 'react'
import './App.css'

interface TestCase {
  input: string;
  expectedOutput: string;
  score?: number;
}

function App() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '' }
  ])

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }])
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    const newTestCases = [...testCases]
    newTestCases[index] = { ...newTestCases[index], [field]: value }
    setTestCases(newTestCases)
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  return (
    <div className="experiment-container">
      <h1>LLM Experiment Interface</h1>
      
      <div className="system-prompt">
        <h2>System Prompt</h2>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter the system prompt for the LLM..."
        />
      </div>

      <div className="test-cases">
        <h2>Test Cases</h2>
        {testCases.map((testCase, index) => (
          <div key={index} className="test-case">
            <input
              type="text"
              value={testCase.input}
              onChange={(e) => updateTestCase(index, 'input', e.target.value)}
              placeholder="Input prompt"
            />
            <input
              type="text"
              value={testCase.expectedOutput}
              onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
              placeholder="Expected output"
            />
            <button onClick={() => removeTestCase(index)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={addTestCase}>Add Test Case</button>
        <button>Run Experiment</button>
      </div>

      <div className="results">
        <h2>Results</h2>
        <p>Average Score: N/A</p>
        {/* Results will be displayed here */}
      </div>
    </div>
  )
}

export default App
