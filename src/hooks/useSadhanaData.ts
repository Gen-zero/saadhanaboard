
import { useState } from 'react';

export interface SadhanaData {
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
}

export const useSadhanaData = () => {
  const [sadhanaData] = useState<SadhanaData>({
    purpose: "To deepen my connection with the divine and cultivate inner peace.",
    goal: "Complete a 40-day meditation practice focusing on gratitude and compassion.",
    deity: "Universal Divine Consciousness",
    message: "I offer my practice with devotion and seek guidance on this spiritual journey.",
    offerings: [
      "Daily meditation for 30 minutes",
      "Weekly reading of sacred texts",
      "Acts of service in my community",
      "Abstaining from negative speech",
      "Practice of gratitude"
    ]
  });

  const formatPaperContent = (data: SadhanaData): string => {
    return `
Purpose:
${data.purpose}

Goal:
${data.goal}

Divine Focus:
${data.deity}

Message:
"${data.message}"

My Offerings:
${data.offerings.map((o, i) => `${i+1}. ${o}`).join('\n')}
    `;
  };

  return {
    sadhanaData,
    paperContent: formatPaperContent(sadhanaData)
  };
};
