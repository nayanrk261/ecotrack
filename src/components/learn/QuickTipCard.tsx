/**
 * @file QuickTipCard.tsx
 * @description Renders a simple quick tip card explaining actions to reduce carbon footprint.
 */

import type { QuickTipCardProps } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../Card';

const getLocalizedTip = (title: string, desc: string, locale: string) => {
  if (locale === 'en') return { title, description: desc };
  switch (title) {
    case 'Walk more':
      return { title: 'अधिक चलें', description: '2 किमी से कम की यात्राओं के लिए पैदल चलें या साइकिल का उपयोग करें।' };
    case 'Switch off lights':
      return { title: 'बिजली बंद करें', description: 'कमरे से बाहर निकलते समय बत्तियाँ बंद कर दें।' };
    case 'Set AC to 24°C':
      return { title: 'एसी को 24°C पर सेट करें', description: 'हर एक डिग्री कम तापमान 6% अधिक ऊर्जा का उपयोग करता है।' };
    case 'Eat more plants':
      return { title: 'अधिक शाकाहार अपनाएं', description: 'सप्ताह में एक दिन भी बिना मांस का भोजन करने से मदद मिलती है।' };
    case 'Unplug chargers':
      return { title: 'चार्जर अनप्लग करें', description: 'चार्जर खाली रहने पर भी बिजली खींचते हैं।' };
    case 'Shorter showers':
      return { title: 'छोटे शॉवर लें', description: 'पानी और इसे गर्म करने में लगने वाली ऊर्जा की बचत करें।' };
    case 'Go paperless':
      return { title: 'कागज रहित बनें', description: 'डिजिटल बिल और स्टेटमेंट पर स्विच करें।' };
    case 'Buy local':
      return { title: 'स्थानीय उत्पाद खरीदें', description: 'आयातित वस्तुओं से होने वाले परिवहन उत्सर्जन को कम करें।' };
    case 'Recycle properly':
      return { title: 'सही ढंग से रीसायकल करें', description: 'कचरे को सही श्रेणियों में अलग करें।' };
    case 'Plant trees':
      return { title: 'पेड़ लगाएं', description: 'पेड़ CO₂ को अवशोषित करते हैं और छाया प्रदान करते हैं।' };
    case 'Full loads only':
      return { title: 'फुल लोड पर चलाएं', description: 'वाशिंग मशीन और डिशवॉशर को केवल पूरा भरने पर ही चलाएं।' };
    case 'Seal drafts':
      return { title: 'दरारें सील करें', description: 'खिड़कियों और दरवाजों के आसपास हवा के रिसाव को रोकें।' };
    default:
      return { title, description: desc };
  }
};

export default function QuickTipCard({ tip }: QuickTipCardProps) {
  const { locale } = useLanguage();
  const localized = getLocalizedTip(tip.title, tip.description, locale);

  return (
    <Card className="tip-card">
      <span className="tip-emoji">{tip.icon}</span>
      <h3 className="tip-title">{localized.title}</h3>
      <p className="tip-desc">{localized.description}</p>
    </Card>
  );
}
