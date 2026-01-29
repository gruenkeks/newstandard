import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, answers = {} } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const API_KEY = process.env.KIT_API_KEY;
    const FORM_ID = process.env.KIT_FORM_ID;

    // debug logs
    console.log('Attempting subscription:', { 
      email, 
      hasApiKey: !!API_KEY, 
      hasFormId: !!FORM_ID,
      formId: FORM_ID 
    });

    if (!API_KEY || !FORM_ID) {
      console.error('Kit API credentials missing');
      // In development, we can mock success if credentials aren't set yet
      if (process.env.NODE_ENV === 'development') {
        console.log('Mock Subscription Success:', { email, answers });
        return NextResponse.json({ success: true, mocked: true });
      }
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const API_URL = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`;

    // Map your quiz answers to Kit custom fields.
    // Ensure you create fields with these exact keys (goal, experience, challenge) in your Kit dashboard.
    const customFields = {
      goal: answers.goal?.join(", "),
      experience: answers.experience?.join(", "),
      challenge: answers.challenge?.join(", "),
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: API_KEY,
        email: email,
        fields: customFields,
      }),
    });

    const data = await response.json();
    
    console.log('Kit API Response:', data);

    if (!response.ok) {
      console.error('Kit API Error:', data);
      return NextResponse.json({ error: 'Subscription failed' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

