import { NextResponse } from 'next/server';
import type { BirthData, MiniCalculateResponse } from '@/lib/types/bazi';

/**
 * POST /api/calculate
 * Calculate BaZi birth chart from birth data
 * Returns mini result for free calculator
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as BirthData;
    
    // Validate required fields
    if (!body.date || !body.time || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, time, location' },
        { status: 400 }
      );
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(body.time)) {
      return NextResponse.json(
        { success: false, error: 'Invalid time format. Use HH:mm' },
        { status: 400 }
      );
    }
    
    // Check if date is in the future
    const birthDate = new Date(body.date);
    const now = new Date();
    if (birthDate > now) {
      return NextResponse.json(
        { success: false, error: 'Birth date cannot be in the future' },
        { status: 400 }
      );
    }
    
    // TODO: Integrate with Python BaZi engine
    // For now, return mock data for testing
    const response: MiniCalculateResponse = {
      success: true,
      data: generateMockResult(body),
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Calculate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate mock result for testing
 * TODO: Replace with actual Python API integration
 */
function generateMockResult(birthData: BirthData): MiniCalculateResponse['data'] {
  // Simple deterministic mock based on date
  const date = new Date(birthData.date);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
  const animals = ['Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit'];
  
  const elementIndex = dayOfYear % 5;
  const animalIndex = dayOfYear % 12;
  
  const dayMasterElement = elements[elementIndex];
  const dayMasterAnimal = animals[animalIndex];
  
  const elementDescriptions: Record<string, string> = {
    Wood: 'Growth-driven, compassionate, and visionary. You naturally nurture ideas and people.',
    Fire: 'Passionate, charismatic, and transformative. You inspire others with your energy.',
    Earth: 'Grounded, reliable, and nurturing. You provide stability in chaotic situations.',
    Metal: 'Precise, determined, and principled. You value integrity and craftsmanship.',
    Water: 'Adaptable, intuitive, and wise. You flow around obstacles with grace.',
  };
  
  const personalityTraits: Record<string, string[]> = {
    Wood: ['Creative thinker', 'Natural leader', 'Empathetic', 'Growth-oriented', 'Visionary'],
    Fire: ['Charismatic', 'Enthusiastic', 'Expressive', 'Passionate', 'Inspiring'],
    Earth: ['Reliable', 'Nurturing', 'Practical', 'Patient', 'Grounded'],
    Metal: ['Determined', 'Principled', 'Precise', 'Disciplined', 'Analytical'],
    Water: ['Intuitive', 'Adaptable', 'Wise', 'Flexible', 'Perceptive'],
  };
  
  return {
    dayMaster: {
      stem: `${dayMasterElement === 'Metal' ? 'Geng' : dayMasterElement === 'Wood' ? 'Jia' : dayMasterElement === 'Water' ? 'Ren' : dayMasterElement === 'Fire' ? 'Bing' : 'Wu'} ${dayMasterElement}`,
      element: dayMasterElement,
      yinYang: dayOfYear % 2 === 0 ? 'Yang' : 'Yin',
      animal: dayMasterAnimal,
      description: elementDescriptions[dayMasterElement],
    },
    elementBalance: {
      Wood: dayMasterElement === 'Wood' ? 35 : 15,
      Fire: dayMasterElement === 'Fire' ? 35 : 15,
      Earth: dayMasterElement === 'Earth' ? 35 : 15,
      Metal: dayMasterElement === 'Metal' ? 35 : 15,
      Water: dayMasterElement === 'Water' ? 35 : 15,
      dominant: dayMasterElement,
      weakest: elements[(elementIndex + 3) % 5],
    },
    favorableElements: [
      dayMasterElement,
      elements[(elementIndex + 1) % 5],
    ],
    personalityTraits: personalityTraits[dayMasterElement],
  };
}
