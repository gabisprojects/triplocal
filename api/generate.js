export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { destination, duration, vibes, travelerType, tweak, previousPlan } = req.body;

  if (!destination || !duration || !vibes || !travelerType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const vibeDescriptions = {
    chill: 'unhurried, slow-paced, café culture, relaxed ambiance',
    foodie: 'local food markets, authentic restaurants, street food, culinary gems',
    active: 'outdoor activities, hiking, swimming, parks, physical adventures',
    remote: 'reliable Wi-Fi cafés, co-working spots, quiet productive spaces'
  };

  const travelerContext = {
    solo: 'a solo traveler who enjoys independence and meeting locals',
    couple: 'a couple looking for shared experiences with some romantic options',
    friends: 'a group of friends wanting social, fun, and shareable experiences',
    'remote-solo': 'a remote worker traveling alone who needs reliable work spots and solo-friendly social options'
  };

  const vibeContext = vibes.map(v => vibeDescriptions[v] || v).join(', and ');
  const traveler = travelerContext[travelerType] || 'an independent traveler';

  let prompt;

  if (tweak && previousPlan) {
    // TWEAK MODE
    prompt = `You previously generated this local experience plan for ${destination}:

---
${previousPlan}
---

The traveler has asked for a refinement: "${tweak}"

Their original profile:
- Destination: ${destination}
- Stay duration: ${duration}  
- Vibe: ${vibeContext}
- Traveler type: ${traveler}

Please generate an improved version of the plan that incorporates their feedback. Keep what was working well and adjust what they've asked to change. Maintain the same structure and warm, local-friend tone. Do not acknowledge the previous plan or the tweak request — just deliver the improved plan directly.`;
  } else {
    // FRESH PLAN
    prompt = `You are a brilliant local friend who has lived in ${destination} for years and knows the city deeply — the hidden cafés, the neighbourhood rhythms, the spots that never make it into guidebooks. You are creating a personalised local experience plan for a slow traveler.

TRAVELER PROFILE:
- Destination: ${destination}
- Stay duration: ${duration}
- Vibe: ${vibeContext}
- Traveler type: ${traveler}

Create a rich, conversational, opinionated local experience plan. Write like a knowledgeable friend, not a travel brochure. Be specific, evocative, and practical.

Structure your response with these sections:

## Your ${destination} Local Guide

Start with a 2-3 sentence warm intro that captures the essence of the city for this traveler's vibe.

### Your Daily Rhythm

Describe the ideal day structure for this traveler in ${destination} — morning rituals, afternoon flow, evening options. Be specific about timing and neighbourhood energy.

### Day-by-Day Plan

For each period of the stay (group into logical blocks based on ${duration}), give 3 recommendations with:
- A specific place or activity (with neighbourhood/area)
- Why this fits their vibe
- Best time to go and one insider tip

### ✦ Local Gems — The Non-Obvious List

This is the most important section. Give 5-6 specific local gems that tourists almost never find. For each:
- Name and neighbourhood
- What makes it special and local
- When to go and what to do/order/bring

### Neighbourhood to Call Home

Recommend the best neighbourhood for this traveler to base themselves, with 3 reasons why.

### Practical Local Knowledge

3-4 essential tips that will make them feel like a local immediately — cultural norms, transport secrets, timing tips, what to avoid.

Keep the tone warm, specific, and enthusiastic. Avoid generic advice. Every recommendation should feel like it came from someone who actually lives there.`;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ plan: text });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
