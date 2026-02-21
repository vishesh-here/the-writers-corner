import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ReviewRequest {
  content: string
  apiKey: string
}

interface ReviewCategory {
  title: string
  items: {
    issue: string
    suggestion: string
    severity: 'low' | 'medium' | 'high'
  }[]
}

interface ReviewResponse {
  overallScore: number
  summary: string
  categories: {
    grammarAndSpelling: ReviewCategory
    styleAndTone: ReviewCategory
    structureAndCoherence: ReviewCategory
    contentSuggestions: ReviewCategory
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ReviewRequest = await req.json()

    if (!body.content || !body.apiKey) {
      return NextResponse.json(
        { error: 'Content and API key are required' },
        { status: 400 }
      )
    }

    if (body.content.length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters for meaningful review' },
        { status: 400 }
      )
    }

    if (body.content.length > 50000) {
      return NextResponse.json(
        { error: 'Content exceeds maximum length of 50,000 characters' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert writing reviewer specializing in creative writing, novels, and storytelling. Analyze the provided writing and return a comprehensive review in JSON format.

Your review must include:
1. An overall score from 1-100
2. A brief summary (2-3 sentences)
3. Detailed feedback in four categories:
   - Grammar and Spelling: Identify errors and suggest corrections
   - Style and Tone: Analyze voice consistency, word choice, and readability
   - Structure and Coherence: Evaluate flow, transitions, and organization
   - Content Suggestions: Provide creative improvements and enhancements

For each issue found, specify:
- The issue description
- A specific suggestion for improvement
- Severity level (low, medium, high)

Return ONLY valid JSON in this exact format:
{
  "overallScore": number,
  "summary": "string",
  "categories": {
    "grammarAndSpelling": {
      "title": "Grammar & Spelling",
      "items": [{"issue": "string", "suggestion": "string", "severity": "low|medium|high"}]
    },
    "styleAndTone": {
      "title": "Style & Tone",
      "items": [{"issue": "string", "suggestion": "string", "severity": "low|medium|high"}]
    },
    "structureAndCoherence": {
      "title": "Structure & Coherence",
      "items": [{"issue": "string", "suggestion": "string", "severity": "low|medium|high"}]
    },
    "contentSuggestions": {
      "title": "Content Suggestions",
      "items": [{"issue": "string", "suggestion": "string", "severity": "low|medium|high"}]
    }
  }
}

If a category has no issues, return an empty items array. Limit to 5 most important items per category.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please review the following writing:\n\n${body.content}` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenAI API key and try again.' },
          { status: 401 }
        )
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        )
      }

      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid request to OpenAI API. The content may be too long.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: error.error?.message || 'Failed to get AI review. Please try again.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reviewContent = data.choices?.[0]?.message?.content

    if (!reviewContent) {
      return NextResponse.json(
        { error: 'No review generated. Please try again.' },
        { status: 500 }
      )
    }

    // Parse the JSON response from GPT
    let review: ReviewResponse
    try {
      // Handle potential markdown code blocks in the response
      const jsonContent = reviewContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      review = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', reviewContent)
      return NextResponse.json(
        { error: 'Failed to parse AI review. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error in AI review:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
