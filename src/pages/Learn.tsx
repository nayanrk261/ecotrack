import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BookOpen, ExternalLink } from 'lucide-react';

import { KEY_FACTS, EMISSION_SOURCES, QUICK_TIPS } from '../lib/constants';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getLocalizedFactLabel = (label: string, locale: string) => {
  if (locale === 'en') return label;
  switch (label) {
    case 'Global CO₂ emissions annually': return 'वार्षिक वैश्विक CO₂ उत्सर्जन';
    case 'Average global carbon footprint per person/year': return 'प्रति व्यक्ति/वर्ष औसत वैश्विक कार्बन फुटप्रिंट';
    case 'Average Indian carbon footprint per person/year': return 'प्रति व्यक्ति/वर्ष औसत भारतीय कार्बन फुटप्रिंट';
    case 'Year by which we need Net Zero emissions': return 'वर्ष जब तक हमें नेट ज़ीरो उत्सर्जन की आवश्यकता है';
    case 'Maximum warming target under Paris Agreement': return 'पेरिस समझौते के तहत अधिकतम ग्लोबल वार्मिंग लक्ष्य';
    default: return label;
  }
};

const getLocalizedSourceLabel = (label: string, locale: string) => {
  if (locale === 'en') return label;
  switch (label) {
    case 'Electricity & Heat': return 'बिजली और गर्मी';
    case 'Transport': return 'परिवहन';
    case 'Manufacturing': return 'विनिर्माण';
    case 'Agriculture': return 'कृषि';
    case 'Buildings': return 'भवन';
    default: return label;
  }
};

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

/** Animated counter hook */
function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(parseFloat((progress * target).toFixed(1)));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return value;
}

function FactCard({
  fact,
}: {
  fact: (typeof KEY_FACTS)[number];
}) {
  const { locale } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const animatedValue = useCountUp(fact.value, 1500, visible);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [handleIntersection]);

  const suffixText = locale === 'hi' && fact.suffix.includes('tons') ? ' टन' : fact.suffix;

  return (
    <div ref={ref} className="card fact-card">
      <span className="fact-emoji">{fact.icon}</span>
      <div className="fact-value">
        {fact.value >= 100
          ? Math.round(animatedValue)
          : animatedValue.toFixed(1)}
        {suffixText}
      </div>
      <p className="fact-label">{getLocalizedFactLabel(fact.label, locale)}</p>
    </div>
  );
}

export default function Learn() {
  const { locale, t } = useLanguage();

  const barData = {
    labels: EMISSION_SOURCES.map((s) => getLocalizedSourceLabel(s.label, locale)),
    datasets: [
      {
        label: t('pctTotalEmissions'),
        data: EMISSION_SOURCES.map((s) => s.value),
        backgroundColor: EMISSION_SOURCES.map((s) => s.color),
        borderRadius: 6,
        borderSkipped: false as const,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#a1a1aa' },
        grid: { color: '#1a1a1a' },
        max: 40,
      },
      y: {
        ticks: { color: '#a1a1aa', font: { size: 13 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">
          <BookOpen size={32} className="icon-green" />
          {locale === 'en' ? 'Learn About ' : ''}
          <span className="text-gradient">
            {locale === 'en' ? 'Climate Change' : 'जलवायु परिवर्तन'}
          </span>
          {locale === 'hi' ? ' के बारे में सीखें' : ''}
        </h1>
        <p className="page-subtitle">
          {t('learnSubtitle')}
        </p>

        {/* ===== What is Carbon Footprint ===== */}
        <section className="card learn-section">
          <h2 className="learn-section-title">{t('whatIsFootprint')}</h2>
          <p className="learn-text">
            {locale === 'en' ? (
              <>
                A <strong>carbon footprint</strong> is the total amount of greenhouse
                gases — primarily carbon dioxide (CO₂) — generated by our actions.
                This includes everything from the energy we use at home, to how we
                travel, what we eat, and what we buy.
              </>
            ) : (
              <>
                एक <strong>कार्बन फुटप्रिंट</strong> हमारे कार्यों द्वारा उत्पन्न ग्रीनहाउस गैसों - मुख्य रूप से कार्बन डाइऑक्साइड (CO₂) - की कुल मात्रा है।
                इसमें हमारे द्वारा घर पर उपयोग की जाने वाली ऊर्जा से लेकर हमारे यात्रा करने के तरीके, हम क्या खाते हैं और क्या खरीदते हैं, सब कुछ शामिल है।
              </>
            )}
          </p>
          <p className="learn-text">
            {locale === 'en' ? (
              <>
                The average global carbon footprint is about <strong>4.7 tons</strong> per
                person per year. To limit global warming to 1.5°C — the target of the
                Paris Agreement — we need to bring this down to under{' '}
                <strong>2 tons</strong> per person per year by 2050.
              </>
            ) : (
              <>
                औसत वैश्विक कार्बन फुटप्रिंट प्रति वर्ष प्रति व्यक्ति लगभग <strong>4.7 टन</strong> है। ग्लोबल वार्मिंग को 1.5°C तक सीमित करने के लिए — जो पेरिस समझौते का लक्ष्य है — हमें 2050 तक इसे प्रति वर्ष प्रति व्यक्ति <strong>2 टन</strong> से कम करने की आवश्यकता है।
              </>
            )}
          </p>
        </section>

        {/* ===== Key Facts ===== */}
        <section>
          <h2 className="section-title">
            {locale === 'en' ? 'Key ' : 'मुख्य '}<span className="text-gradient">{locale === 'en' ? 'Facts' : 'तथ्य'}</span>
          </h2>
          <div className="facts-grid">
            {KEY_FACTS.map((fact, i) => (
              <FactCard key={i} fact={fact} />
            ))}
          </div>
        </section>

        {/* ===== Top Emission Sources ===== */}
        <section className="card learn-section">
          <h2 className="learn-section-title">
            {t('topSources')}
          </h2>
          <div className="chart-container chart-container-tall">
            <Bar data={barData} options={barOptions} />
          </div>
        </section>

        {/* ===== Quick Tips ===== */}
        <section>
          <h2 className="section-title">
            {locale === 'en' ? 'Quick ' : 'त्वरित '}<span className="text-gradient">{locale === 'en' ? 'Tips' : 'सुझाव'}</span>
          </h2>
          <p className="section-subtitle">
            {t('quickTipsSubtitle')}
          </p>
          <div className="tips-grid">
            {QUICK_TIPS.map((tip, i) => {
              const localized = getLocalizedTip(tip.title, tip.description, locale);
              return (
                <div key={i} className="card tip-card">
                  <span className="tip-emoji">{tip.icon}</span>
                  <h3 className="tip-title">{localized.title}</h3>
                  <p className="tip-desc">{localized.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== Resources ===== */}
        <section>
          <h2 className="section-title">
            {locale === 'en' ? 'Trusted ' : 'विश्वसनीय '}<span className="text-gradient">{locale === 'en' ? 'Resources' : 'संसाधन'}</span>
          </h2>
          <div className="resources-grid">
            {[
              {
                title: 'UN Climate Action',
                titleHi: 'संयुक्त राष्ट्र जलवायु कार्रवाई',
                desc: 'Official United Nations resource on climate change initiatives and global agreements.',
                descHi: 'जलवायु परिवर्तन पहल और वैश्विक समझौतों पर आधिकारिक संयुक्त राष्ट्र संसाधन।',
                url: 'https://www.un.org/climatechange',
              },
              {
                title: 'NASA Climate',
                titleHi: 'नासा क्लाइमेट',
                desc: "NASA's comprehensive data, evidence, and visualizations on Earth's changing climate.",
                descHi: 'पृथ्वी की बदलती जलवायु पर नासा का व्यापक डेटा, प्रमाण और विज़ुअलाइज़ेशन।',
                url: 'https://climate.nasa.gov',
              },
              {
                title: 'IPCC Reports',
                titleHi: 'आईपीसीसी रिपोर्ट',
                desc: 'Scientific assessments from the Intergovernmental Panel on Climate Change.',
                descHi: 'इंटरगवर्नमेंटल पैनल ऑन क्लाइमेट चेंज (IPCC) से वैज्ञानिक आकलन।',
                url: 'https://www.ipcc.ch',
              },
            ].map((res) => (
              <a
                key={res.title}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card resource-card"
              >
                <h3 className="resource-title">
                  {locale === 'en' ? res.title : res.titleHi}
                  <ExternalLink size={16} />
                </h3>
                <p className="resource-desc">
                  {locale === 'en' ? res.desc : res.descHi}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
