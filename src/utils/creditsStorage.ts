// ==========================================
// 本地积分（Phase 5：与邀请/签到打通的前端基础层）
// 后续可同步到服务端 KV，key 建议 userId 维度
// ==========================================

const KEY = 'fc_credits_balance';
const DEFAULT = 200;
const TX_KEY = 'fc_credits_ledger_v1';

export function getCreditsBalance(): number {
  try {
    const v = localStorage.getItem(KEY);
    if (v == null) {
      localStorage.setItem(KEY, String(DEFAULT));
      return DEFAULT;
    }
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function setCreditsBalance(n: number) {
  localStorage.setItem(KEY, String(Math.max(0, n)));
  try {
    window.dispatchEvent(new CustomEvent('fc-credits-updated'));
  } catch {
    /* ignore */
  }
}

export function addCredits(delta: number, reason: string) {
  if (delta <= 0) return getCreditsBalance();
  const next = getCreditsBalance() + delta;
  setCreditsBalance(next);
  appendLedger('add', delta, reason);
  return next;
}

/** 扣减积分，余额不足返回 false */
export function trySpendCredits(cost: number, reason: string): boolean {
  if (cost <= 0) return true;
  const cur = getCreditsBalance();
  if (cur < cost) return false;
  setCreditsBalance(cur - cost);
  appendLedger('spend', cost, reason);
  return true;
}

interface LedgerRow {
  t: number;
  kind: 'add' | 'spend';
  amount: number;
  reason: string;
}

function appendLedger(kind: 'add' | 'spend', amount: number, reason: string) {
  try {
    const raw = localStorage.getItem(TX_KEY);
    const list: LedgerRow[] = raw ? JSON.parse(raw) : [];
    list.push({ t: Date.now(), kind, amount, reason });
    localStorage.setItem(TX_KEY, JSON.stringify(list.slice(-100)));
  } catch {
    /* ignore */
  }
}

/** 邀请成功等场景可调用 */
export function rewardInviteBonus() {
  return addCredits(100, 'invite_friend');
}
