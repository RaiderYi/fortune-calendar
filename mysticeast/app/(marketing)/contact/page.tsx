import { Metadata } from 'next';
import { Mail, MessageCircle, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact MysticEast | MysticEast',
  description:
    'Get in touch with MysticEast for reading requests, questions, partnerships, and general inquiries.',
};

const inquiryTypes = [
  'Questions about the free calculator or your elemental result',
  'Requests for a full personalized reading',
  'Annual forecast or compatibility reading inquiries',
  'General collaborations, partnerships, or press inquiries',
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Contact MysticEast</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            We&apos;d love to hear from you
          </h1>
          <p className="text-xl text-primary-200/80 leading-relaxed max-w-2xl mx-auto">
            If you have a question, want to request a reading, or need help understanding which service fits best, email is the simplest way to reach us.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="crystal-card p-8 md:p-10">
            <h2 className="font-serif text-3xl font-bold text-primary-950 mb-4">
              Primary contact
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
              We currently handle inquiries directly by email so every request can be reviewed with care.
            </p>
            <a
              href="mailto:bazirili@foxmail.com"
              className="inline-flex items-center text-lg font-semibold text-primary-900 hover:text-primary-700 transition-colors"
            >
              <Mail className="w-5 h-5 mr-3 text-gold-600" />
              bazirili@foxmail.com
            </a>
          </div>

          <div className="crystal-card p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-primary-950 mb-4">
              Helpful to include
            </h2>
            <div className="space-y-3 text-charcoal/75">
              <p>Your birth date</p>
              <p>Your birth time</p>
              <p>Your birth location</p>
              <p>The kind of reading or question you have in mind</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="crystal-card p-8 md:p-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-jade-100 rounded-full mb-5">
              <Sparkles className="w-4 h-4 text-jade-700" />
              <span className="text-sm font-medium text-jade-700">Common inquiry types</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {inquiryTypes.map((item) => (
                <div key={item} className="rounded-2xl border border-primary-100 bg-white/70 p-5 text-charcoal/75">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-8 text-charcoal/60 leading-relaxed">
              We generally aim to respond within 1–2 business days. Your birth data and questions are handled with privacy and care.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
