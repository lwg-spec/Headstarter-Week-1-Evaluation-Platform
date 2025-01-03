import axios from 'axios';

interface ExperimentResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  score: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class LLMService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions'; 
  }

  private async callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await axios.post<OpenAIResponse>(
        this.baseUrl,
        {
          model: 'gpt-3.5-turbo', 
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0 
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('LLM API Error:', error);
      throw new Error('Failed to get response from LLM');
    }
  }

  private calculateScore(expected: string, actual: string): number {
    return expected.trim().toLowerCase() === actual.trim().toLowerCase() ? 1 : 0;
  }

  async runExperiment(systemPrompt: string, testCases: { input: string, expectedOutput: string }[]): Promise<ExperimentResult[]> {
    const results: ExperimentResult[] = [];

    for (const testCase of testCases) {
      const actualOutput = await this.callLLM(systemPrompt, testCase.input);
      const score = this.calculateScore(testCase.expectedOutput, actualOutput);

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        score
      });
    }

    return results;
  }
} 
