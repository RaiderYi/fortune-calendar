import { Metadata } from 'next';
import { Lock, Mail, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | MysticEast',
  description:
    'Learn how MysticEast handles birth data, contact information, and privacy when providing elemental readings and guidance.',
};

const sections = [
  {
    title: 'What we collect',
    body:
      'When you use MysticEast, we may collect information you choose to provide, such as your birth date, birth time, birth location, email address, and the details you share in a message or reading request.',
  },
  {
    title: 'How we use it',
    body:
      'We use your information to calculate charts, respond to inquiries, deliver requested readings, and improve the experience of our site and services. We only use the information needed to provide the guidance you asked for.',
  },
  {
    title: 'How we protect it',
    body:
      'We treat your birth data and personal details as confidential. MysticEast is designed to support self-understanding, and we do not treat your information casually. We aim to keep your information private and secure.',
  },
  {
    title: 'Sharing and retention',
    body:
      'We do not sell your personal information. Information is only retained for as long as it is reasonably useful for providing the requested service, maintaining correspondence, or meeting basic operational needs.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Lock className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Privacy Policy</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Your information should be handled with care
          </h1>
          <p className="text-xl text-primary-200/80 leading-relaxed max-w-2xl mx-auto">
            MysticEast is built around trust. This page explains, in plain language, how we use the information you choose to share with us.
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
              <div className="h-12 w-12 rounded-full bg-jade-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-jade-700" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary-950 mb-3">Questions about privacy?</h2>
                <p className="text-lg text-charcoal/75 leading-relaxed mb-4">
                  If you have any questions about how your information is handled, contact us directly and we&apos;ll do our best to help.
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
