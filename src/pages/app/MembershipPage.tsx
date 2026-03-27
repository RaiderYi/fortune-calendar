// ==========================================
// 会员与支付页面
// Membership & Payment Page
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ChevronLeft, CheckCircle, Gift, Zap, Star, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../../components/oriental/animations';
import { DonationSection, FloatingDonateButton } from '../../components/payment/DonationSection';
import { 
  getMembership, 
  isValidMembership, 
  getMembershipRemainingDays,
  MEMBERSHIP_CONFIG,
  upgradeMembership,
  MembershipType
} from '../../utils/membershipStorage';
import { useAuth } from '../../contexts/AuthContext';

export default function MembershipPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<MembershipType | null>(null);
  const [showDonation, setShowDonation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const currentMembership = getMembership();
  const isMember = isValidMembership() && currentMembership.type !== 'free';
  const remainingDays = getMembershipRemainingDays();

  // 会员类型列表
  const membershipTypes: MembershipType[] = ['monthly', 'quarterly', 'yearly', 'lifetime'];

  const handleUpgrade = (type: MembershipType) => {
    setSelectedPlan(type);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPlan) return;
    
    // 模拟支付成功
    upgradeMembership(selectedPlan);
    setShowPaymentModal(false);
    
    // 刷新页面显示新状态
    window.location.reload();
  };

  return (
    <PageTransition className="min-h-screen bg-paper">
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-paper-dark transition-colors"
            >
              <ChevronLeft size={20} className="text-ink" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <Crown size={20} className="text-gold-dark" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-ink">
                {isEnglish ? 'Membership' : '会员中心'}
              </h1>
              <p className="text-xs text-light-ink font-serif">
                {isEnglish ? 'Unlock premium features' : '解锁高级功能'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* 当前会员状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            rounded-2xl p-6 text-center
            ${isMember 
              ? 'bg-gradient-to-r from-gold/20 via-vermilion/10 to-gold/20 border-2 border-gold/30' 
              : 'bg-white shadow-card'}
          `}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-vermilion flex items-center justify-center">
            <Crown size={32} className="text-white" />
          </div>
          
          {isMember ? (
            <>
              <h2 className="text-2xl font-serif text-ink mb-2">
                {MEMBERSHIP_CONFIG[currentMembership.type].name}
              </h2>
              <p className="text-light-ink font-serif mb-2">
                {remainingDays === -1 
                  ? '终身会员，尊享所有权益' 
                  : `剩余 ${remainingDays} 天`}
              </p>
              <div className="flex items-center justify-center gap-2 text-gold">
                <Star size={16} className="fill-gold" />
                <span className="font-serif">已解锁全部高级功能</span>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-serif text-ink mb-2">
                {isEnglish ? 'Free User' : '免费用户'}
              </h2>
              <p className="text-light-ink font-serif mb-4">
                {isEnglish 
                  ? 'Upgrade to unlock all premium features' 
                  : '升级会员解锁全部高级功能'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['AI智能咨询', '无限运势查询', '高级命理分析'].map((feature) => (
                  <span key={feature} className="px-3 py-1 bg-paper-dark rounded-full text-sm text-light-ink font-serif">
                    {feature}
                  </span>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* 会员套餐 */}
        {!showDonation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-serif text-ink mb-4">
              {isEnglish ? 'Choose Your Plan' : '选择会员套餐'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipTypes.map((type, index) => {
                const config = MEMBERSHIP_CONFIG[type];
                const isPopular = type === 'quarterly';
                
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleUpgrade(type)}
                    className={`
                      relative rounded-2xl p-5 cursor-pointer transition-all
                      ${isPopular 
                        ? 'bg-gradient-to-br from-gold/10 to-vermilion/5 border-2 border-gold' 
                        : 'bg-white shadow-card border-2 border-transparent hover:border-vermilion/30'}
                    `}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-white text-xs font-serif rounded-full">
                        🔥 性价比之选
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{config.icon}</span>
                        <div>
                          <h4 className="font-serif text-ink">{config.name}</h4>
                          <p className="text-xs text-light-ink">{config.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-vermilion">
                          ¥{type === 'lifetime' ? config.yearlyPrice : config.monthlyPrice}
                        </div>
                        <div className="text-xs text-muted">
                          {type === 'lifetime' ? '一次性' : '/月'}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {config.benefits.slice(0, 4).map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-light-ink">
                          <CheckCircle size={14} className="text-vermilion" />
                          <span className="font-serif">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <button className={`
                      w-full py-2 rounded-xl font-serif transition-colors
                      ${isPopular 
                        ? 'bg-gold text-white hover:bg-gold-dark' 
                        : 'bg-vermilion/10 text-vermilion hover:bg-vermilion/20'}
                    `}>
                      {isEnglish ? 'Select' : '选择'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 打赏区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart size={20} className="text-vermilion" />
            <h3 className="text-lg font-serif text-ink">
              {isEnglish ? 'Support Developer' : '支持开发者'}
            </h3>
          </div>
          
          <DonationSection 
            onClose={() => setShowDonation(false)}
            showCloseButton={false}
          />
        </motion.div>

        {/* 会员权益对比 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-card"
        >
          <h3 className="text-lg font-serif text-ink mb-4">
            {isEnglish ? 'Benefits Comparison' : '权益对比'}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 font-serif text-light-ink">功能</th>
                  <th className="text-center py-3 font-serif text-light-ink">免费</th>
                  <th className="text-center py-3 font-serif text-vermilion">会员</th>
                </tr>
              </thead>
              <tbody className="font-serif">
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 flex items-center gap-2">
                    <Zap size={14} className="text-gold" />
                    运势查询
                  </td>
                  <td className="text-center text-muted">3次/日</td>
                  <td className="text-center text-vermilion font-bold">无限</td>
                </tr>
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 flex items-center gap-2">
                    <Gift size={14} className="text-gold" />
                    AI咨询
                  </td>
                  <td className="text-center text-muted">不可用</td>
                  <td className="text-center text-vermilion font-bold">10-无限次</td>
                </tr>
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 flex items-center gap-2">
                    <Star size={14} className="text-gold" />
                    历史记录
                  </td>
                  <td className="text-center text-muted">7天</td>
                  <td className="text-center text-vermilion font-bold">永久</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2">
                    <Crown size={14} className="text-gold" />
                    专属主题
                  </td>
                  <td className="text-center text-muted">—</td>
                  <td className="text-center text-vermilion font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* 支付确认弹窗 */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-serif text-ink mb-4">
                确认购买
              </h3>
              <div className="bg-paper-dark rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-light-ink font-serif">
                    {MEMBERSHIP_CONFIG[selectedPlan].name}
                  </span>
                  <span className="font-bold text-ink">
                    ¥{selectedPlan === 'lifetime' 
                      ? MEMBERSHIP_CONFIG[selectedPlan].yearlyPrice 
                      : MEMBERSHIP_CONFIG[selectedPlan].yearlyPrice}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {selectedPlan === 'lifetime' 
                    ? '一次性付款，终身使用' 
                    : '按年付款'}
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3 bg-vermilion text-white rounded-xl font-serif hover:bg-vermilion-dark transition-colors"
                >
                  确认支付
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 bg-paper-dark text-ink rounded-xl font-serif hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
              </div>
              
              <p className="text-xs text-muted text-center mt-4">
                点击支付即表示同意服务条款
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮打赏按钮 */}
      <FloatingDonateButton onClick={() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }} />
    </PageTransition>
  );
}
