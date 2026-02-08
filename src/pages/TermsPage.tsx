// ==========================================
// 用户协议
// ==========================================

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb } from '../components/ui';

interface TermsPageProps {
  onLoginClick?: () => void;
}

export default function TermsPage({ onLoginClick }: TermsPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-slate-900">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1">
        <PageSection>
          <Breadcrumb
            items={[
              { label: isEnglish ? 'Home' : '首页', to: '/' },
              { label: isEnglish ? 'Terms of Service' : '用户协议' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'Terms of Service' : '用户协议'}
            description={
              isEnglish
                ? 'Terms and conditions for using our service.'
                : '使用我们服务的条款与条件。'
            }
          />
        </PageSection>

        <PageSection variant="alt">
          <div className="max-w-3xl prose prose-gray dark:prose-invert space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '1. Acceptance' : '1. 接受条款'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'By accessing or using our service, you agree to be bound by these terms. If you do not agree, please do not use the service.'
                  : '访问或使用我们的服务即表示您同意受本条款约束。若不同意，请勿使用服务。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '2. Service Description' : '2. 服务说明'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'We provide Bazi-based fortune predictions for entertainment and reference. Results are not professional advice. See our Disclaimer for details.'
                  : '我们提供基于八字的运势预测，仅供娱乐与参考。结果不构成专业建议。详见免责声明。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '3. User Responsibilities' : '3. 用户责任'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'You agree to provide accurate information and use the service lawfully. You shall not misuse, abuse, or attempt to compromise our systems.'
                  : '您同意提供准确信息并合法使用服务。您不得滥用、误用或试图破坏我们的系统。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '4. Limitation of Liability' : '4. 责任限制'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'We are not liable for any decisions made based on our predictions. The service is provided "as is" without warranties of any kind.'
                  : '我们不对基于预测做出的任何决策负责。服务按「现状」提供，不提供任何形式的保证。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '5. Changes' : '5. 变更'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'We may modify these terms at any time. Continued use after changes constitutes acceptance.'
                  : '我们可能随时修改本条款。在变更后继续使用即表示接受。'}
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
              {isEnglish ? 'Last updated: ' : '最后更新：'}
              {new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'zh-CN')}
            </p>
          </div>
        </PageSection>

        <PageSection>
          <div className="flex gap-4">
            <Link
              to="/help"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {isEnglish ? 'Back to Help' : '返回帮助中心'}
            </Link>
            <Link
              to="/privacy"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {isEnglish ? 'Privacy Policy' : '隐私政策'}
            </Link>
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
