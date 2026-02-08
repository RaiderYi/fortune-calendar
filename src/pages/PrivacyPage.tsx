// ==========================================
// 隐私政策
// ==========================================

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb } from '../components/ui';

interface PrivacyPageProps {
  onLoginClick?: () => void;
}

export default function PrivacyPage({ onLoginClick }: PrivacyPageProps) {
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
              { label: isEnglish ? 'Privacy Policy' : '隐私政策' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'Privacy Policy' : '隐私政策'}
            description={
              isEnglish
                ? 'How we collect, use, and protect your data.'
                : '我们如何收集、使用和保护您的数据。'
            }
          />
        </PageSection>

        <PageSection variant="alt">
          <div className="max-w-3xl prose prose-gray dark:prose-invert space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '1. Data We Collect' : '1. 我们收集的数据'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'We collect: (a) Profile data you provide: birth date, birth time, location, name; (b) Usage data: fortune queries, check-in records, achievements, diary entries, feedback; (c) Device data: browser type, language preference.'
                  : '我们收集：(a) 您提供的个人资料：出生日期、出生时间、地点、姓名；(b) 使用数据：运势查询、签到记录、成就、日记、反馈；(c) 设备数据：浏览器类型、语言偏好。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '2. Storage' : '2. 存储方式'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'Data is stored locally in your browser (localStorage) by default. If you log in, we may sync data to our servers for cross-device access. We do not sell your data to third parties.'
                  : '数据默认存储在您的浏览器本地（localStorage）。若您登录，我们可能将数据同步至服务器以支持多设备访问。我们不会向第三方出售您的数据。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '3. Use of Data' : '3. 数据用途'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'We use your data to: provide fortune predictions, personalize your experience, improve our services, and comply with legal obligations.'
                  : '我们使用您的数据用于：提供运势预测、个性化您的体验、改进服务、履行法律义务。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '4. Your Rights' : '4. 您的权利'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'You can access, correct, or delete your data through the app settings. You may export your data at any time. Contact us for any privacy-related requests.'
                  : '您可通过应用设置访问、更正或删除您的数据。您可随时导出数据。如有隐私相关请求，请联系我们。'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? '5. Updates' : '5. 更新'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isEnglish
                  ? 'We may update this policy from time to time. Continued use of the service constitutes acceptance of the updated policy.'
                  : '我们可能不时更新本政策。继续使用服务即表示您接受更新后的政策。'}
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
              to="/terms"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {isEnglish ? 'Terms of Service' : '用户协议'}
            </Link>
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
