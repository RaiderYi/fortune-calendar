import { Metadata } from 'next';
import { FileCheck2, Mail, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | MysticEast',
  description:
    'Review the basic terms for using MysticEast, including the informational nature of readings, user responsibilities, and contact details.',
};

const sections = [
  {
    title: 'Using MysticEast',
    body:
      'By using this website, you agree to use MysticEast in a respectful and lawful way. Our content, free tools, and reading services are designed to support reflection, insight, and personal growth.',
  },
  {
    title: 'Nature of the guidance',
    body:
      'MysticEast readings are intended for informational and self-understanding purposes. They are not a substitute for medical, legal, financial, or psychological advice, and should not be treated as a guarantee of future outcomes.',
  },
  {
    title: 'Your responsibility',
    body:
      'If you request a reading, you are responsible for providing accurate birth details to the best of your knowledge. The quality of the insight depends in part on the quality of the information you provide.',
  },
  {
    title: 'Service expectations',
    body:
      'Some services may be provided manually by email, especially during the current experience phase. Where paid offerings are discussed, any specific scope, pricing, or turnaround will be clarified directly before delivery.',
  },
  {
    title: 'Satisfaction and contact',
    body:
      'If you have a question about your experience, contact us directly. We aim to respond reasonably and resolve issues with care and integrity.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <FileCheck2 className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Terms of Use</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Clear expectations, simple language
          </h1>
          <p className="text-xl text-primary-200/80 leading-relaxed max-w-2xl mx-auto">
            These terms explain the basics of using MysticEast and how our readings and guidance should be understood.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="crystal-card p-8">
              <h2 className="font-serif text-2xl font-bold text-primary-950 mb-4">{section.title}</h2>
              <p className="text-lg text-charcoal/75 leading-relaxed">{section.body}</p>
            </div>
          ))}

          <div className="crystal-card p-8 bg-white/80 border border-gold-200/60">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-gold-700" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary-950 mb-3">Need clarification?</h2>
                <p className="text-lg text-charcoal/75 leading-relaxed mb-4">
                  If anything on this page feels unclear, contact us directly before requesting a reading and we&apos;ll clarify how the current process works.
                </p>
                <a href="mailto:bazirili@foxmail.com" className="inline-flex items-center font-semibold text-primary-900 hover:text-primary-700 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-gold-600" />
                  bazirili@foxmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
