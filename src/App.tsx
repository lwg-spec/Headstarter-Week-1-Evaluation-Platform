import { useState } from 'react'
import './App.css'
import { LLMService } from './services/llmService'

interface TestCase {
  input: string;
  expectedOutput: string;
  score?: number;
  actualOutput?: string;
}

const llmService = new LLMService(import.meta.env.VITE_OPENAI_API_KEY);

function App() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '' }
  ])
  const [results, setResults] = useState<TestCase[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runExperiment = async () => {
    setIsRunning(true)
    setError(null)
    
    try {
      const experimentResults = await llmService.runExperiment(
        systemPrompt,
        testCases
      )

      setResults(experimentResults)
      
      const averageScore = experimentResults.reduce((acc, result) => acc + (result.score ?? 0), 0) / experimentResults.length
      console.log(`Average Score: ${averageScore}`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsRunning(false)
    }
  }

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
        <button 
          onClick={runExperiment} 
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Experiment'}
        </button>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      <div className="results">
        <h2>Results</h2>
        {results.length > 0 && (
          <>
            <p>Average Score: {(results.reduce((acc, r) => acc + (r.score ?? 0), 0) / results.length).toFixed(2)}</p>
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <h3>Test Case {index + 1}</h3>
                <p>Input: {result.input}</p>
                <p>Expected: {result.expectedOutput}</p>
                <p>Actual: {result.actualOutput}</p>
                <p>Score: {result.score}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default App
