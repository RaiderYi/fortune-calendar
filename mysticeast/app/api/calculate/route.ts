import { NextResponse } from 'next/server';
import type { CalculationResult } from '@/types';

interface CalculateRequestBody {
  date: string;
  time: string;
  timezone: string;
  location?: string;
}

interface CalculateResponseBody {
  success: boolean;
  data?: CalculationResult;
  error?: string;
}

/**
 * POST /api/calculate
 * Calculate BaZi birth chart from birth data
 * Returns mini result for free calculator
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CalculateRequestBody;
    
    // Validate required fields
    if (!body.date || !body.time || !body.timezone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, time, timezone' },
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
    
    const response: CalculateResponseBody = {
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
function generateMockResult(birthData: CalculateRequestBody): CalculationResult {
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
  
  const dominantScore = 34;
  const secondaryScore = 22;
  const tertiaryScore = 18;
  const lowScore = 14;
  const weakestScore = 12;
  const orderedElements = [
    dayMasterElement,
    elements[(elementIndex + 1) % 5],
    elements[(elementIndex + 2) % 5],
    elements[(elementIndex + 3) % 5],
    elements[(elementIndex + 4) % 5],
  ] as const;
  const elementScoreMap: Record<string, number> = {
    [orderedElements[0]]: dominantScore,
    [orderedElements[1]]: secondaryScore,
    [orderedElements[2]]: tertiaryScore,
    [orderedElements[3]]: lowScore,
    [orderedElements[4]]: weakestScore,
  };

  return {
    dayMaster: {
      stem: dayMasterElement === 'Metal' ? 'Geng' : dayMasterElement === 'Wood' ? 'Jia' : dayMasterElement === 'Water' ? 'Ren' : dayMasterElement === 'Fire' ? 'Bing' : 'Wu',
      element: dayMasterElement,
      yinYang: dayOfYear % 2 === 0 ? 'Yang' : 'Yin',
      animal: dayMasterAnimal,
    },
    chart: {
      year: { stem: 'Jia', branch: 'Dragon', element: 'Wood' },
      month: { stem: 'Bing', branch: 'Tiger', element: 'Fire' },
      day: {
        stem: dayMasterElement === 'Metal' ? 'Geng' : dayMasterElement === 'Wood' ? 'Jia' : dayMasterElement === 'Water' ? 'Ren' : dayMasterElement === 'Fire' ? 'Bing' : 'Wu',
        branch: dayMasterAnimal,
        element: dayMasterElement,
      },
      hour: { stem: 'Xin', branch: 'Rooster', element: 'Metal' },
    },
    elements: {
      wood: elementScoreMap.Wood,
      fire: elementScoreMap.Fire,
      earth: elementScoreMap.Earth,
      metal: elementScoreMap.Metal,
      water: elementScoreMap.Water,
    },
    insight: {
      title: `Your ${dayMasterElement} pattern in action`,
      description: `${elementDescriptions[dayMasterElement]} This pattern is strongest when you choose environments that support your ${personalityTraits[dayMasterElement][0].toLowerCase()} side.`,
      category: 'general',
    },
  };
}
