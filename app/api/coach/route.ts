import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, image, history } = await req.json();
    if (!message && !image) {
      return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
    }

    const messages: any[] = [
      { role: 'system', content: 'You are an expert fitness coach. Answer concisely about workouts, form, nutrition, and training. If the user shares an image, analyze it and provide feedback (e.g., form check, body analysis). Keep responses under 4-5 sentences unless asked for detail.' },
    ];

    if (history) {
      for (const m of history) {
        messages.push({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.parts[0].text,
        });
      }
    }

    if (image) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message || 'Analyze this image for me.' },
          { type: 'image_url', image_url: { url: image, detail: 'high' } },
        ],
      });
    } else {
      messages.push({ role: 'user', content: message });
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: image ? 'llama-3.2-90b-vision-preview' : 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 800,
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      console.error('Groq error:', JSON.stringify(data));
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error('Coach API error:', err.message);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
