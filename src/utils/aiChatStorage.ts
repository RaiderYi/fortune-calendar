// ==========================================
// AI 对话历史存储工具
// 支持历史记录、收藏、搜索
// ==========================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  baziContext?: {
    dayMaster?: string;
    date?: string;
  };
}

export interface BookmarkedAnswer {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  timestamp: number;
  tags?: string[];
  note?: string;
}

const SESSIONS_KEY = 'ai_chat_sessions';
const BOOKMARKS_KEY = 'ai_chat_bookmarks';
const MAX_SESSIONS = 50;
const MAX_MESSAGES_PER_SESSION = 100;

// ==================== Session 管理 ====================

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取所有对话会话
 */
export function getAllSessions(): ChatSession[] {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    const sessions = JSON.parse(data) as ChatSession[];
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('获取对话历史失败:', error);
    return [];
  }
}

/**
 * 获取单个会话
 */
export function getSession(sessionId: string): ChatSession | null {
  const sessions = getAllSessions();
  return sessions.find(s => s.id === sessionId) || null;
}

/**
 * 创建新会话
 */
export function createSession(baziContext?: ChatSession['baziContext']): ChatSession {
  const session: ChatSession = {
    id: generateId(),
    title: '新对话',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    baziContext,
  };

  const sessions = getAllSessions();
  sessions.unshift(session);

  // 限制最大会话数
  const trimmed = sessions.slice(0, MAX_SESSIONS);
  
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('创建会话失败:', error);
  }

  return session;
}

/**
 * 更新会话
 */
export function updateSession(sessionId: string, updates: Partial<ChatSession>): ChatSession | null {
  const sessions = getAllSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  
  if (index === -1) return null;

  sessions[index] = {
    ...sessions[index],
    ...updates,
    updatedAt: Date.now(),
  };

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('更新会话失败:', error);
  }

  return sessions[index];
}

/**
 * 添加消息到会话
 */
export function addMessage(
  sessionId: string,
  role: ChatMessage['role'],
  content: string
): ChatMessage | null {
  const sessions = getAllSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) return null;

  const message: ChatMessage = {
    id: generateId(),
    role,
    content,
    timestamp: Date.now(),
  };

  session.messages.push(message);
  
  // 限制每个会话的消息数
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION);
  }

  // 自动生成标题（使用第一条用户消息）
  if (session.title === '新对话' && role === 'user') {
    session.title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
  }

  session.updatedAt = Date.now();

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('添加消息失败:', error);
  }

  return message;
}

/**
 * 删除会话
 */
export function deleteSession(sessionId: string): boolean {
  const sessions = getAllSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  
  if (filtered.length === sessions.length) return false;

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除会话失败:', error);
    return false;
  }
}

/**
 * 清空所有会话
 */
export function clearAllSessions(): void {
  try {
    localStorage.removeItem(SESSIONS_KEY);
  } catch (error) {
    console.error('清空会话失败:', error);
  }
}

// ==================== 收藏管理 ====================

/**
 * 获取所有收藏
 */
export function getAllBookmarks(): BookmarkedAnswer[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (!data) return [];
    const bookmarks = JSON.parse(data) as BookmarkedAnswer[];
    return bookmarks.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('获取收藏失败:', error);
    return [];
  }
}

/**
 * 收藏回答
 */
export function bookmarkAnswer(
  sessionId: string,
  question: string,
  answer: string,
  tags?: string[],
  note?: string
): BookmarkedAnswer {
  const bookmark: BookmarkedAnswer = {
    id: generateId(),
    sessionId,
    question,
    answer,
    timestamp: Date.now(),
    tags,
    note,
  };

  const bookmarks = getAllBookmarks();
  bookmarks.unshift(bookmark);

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('收藏失败:', error);
  }

  return bookmark;
}

/**
 * 取消收藏
 */
export function removeBookmark(bookmarkId: string): boolean {
  const bookmarks = getAllBookmarks();
  const filtered = bookmarks.filter(b => b.id !== bookmarkId);
  
  if (filtered.length === bookmarks.length) return false;

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('取消收藏失败:', error);
    return false;
  }
}

/**
 * 更新收藏备注
 */
export function updateBookmarkNote(bookmarkId: string, note: string): boolean {
  const bookmarks = getAllBookmarks();
  const bookmark = bookmarks.find(b => b.id === bookmarkId);
  
  if (!bookmark) return false;

  bookmark.note = note;

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('更新收藏失败:', error);
    return false;
  }
}

/**
 * 检查回答是否已收藏
 */
export function isBookmarked(sessionId: string, answer: string): boolean {
  const bookmarks = getAllBookmarks();
  return bookmarks.some(b => b.sessionId === sessionId && b.answer === answer);
}

/**
 * 清空所有收藏
 */
export function clearAllBookmarks(): void {
  try {
    localStorage.removeItem(BOOKMARKS_KEY);
  } catch (error) {
    console.error('清空收藏失败:', error);
  }
}

// ==================== 搜索功能 ====================

/**
 * 搜索对话历史
 */
export function searchSessions(keyword: string): ChatSession[] {
  if (!keyword.trim()) return getAllSessions();
  
  const lowerKeyword = keyword.toLowerCase();
  const sessions = getAllSessions();
  
  return sessions.filter(session => {
    // 搜索标题
    if (session.title.toLowerCase().includes(lowerKeyword)) return true;
    
    // 搜索消息内容
    return session.messages.some(msg => 
      msg.content.toLowerCase().includes(lowerKeyword)
    );
  });
}

/**
 * 搜索收藏
 */
export function searchBookmarks(keyword: string): BookmarkedAnswer[] {
  if (!keyword.trim()) return getAllBookmarks();
  
  const lowerKeyword = keyword.toLowerCase();
  const bookmarks = getAllBookmarks();
  
  return bookmarks.filter(bookmark => 
    bookmark.question.toLowerCase().includes(lowerKeyword) ||
    bookmark.answer.toLowerCase().includes(lowerKeyword) ||
    bookmark.note?.toLowerCase().includes(lowerKeyword) ||
    bookmark.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
}

// ==================== 统计信息 ====================

/**
 * 获取对话统计
 */
export function getChatStats(): {
  totalSessions: number;
  totalMessages: number;
  totalBookmarks: number;
  avgMessagesPerSession: number;
} {
  const sessions = getAllSessions();
  const bookmarks = getAllBookmarks();
  
  const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
  
  return {
    totalSessions: sessions.length,
    totalMessages,
    totalBookmarks: bookmarks.length,
    avgMessagesPerSession: sessions.length > 0 
      ? Math.round(totalMessages / sessions.length) 
      : 0,
  };
}

// ==================== 导出/导入 ====================

/**
 * 导出所有对话数据
 */
export function exportChatData(): string {
  const sessions = getAllSessions();
  const bookmarks = getAllBookmarks();
  
  return JSON.stringify({ sessions, bookmarks }, null, 2);
}

/**
 * 导入对话数据
 */
export function importChatData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.sessions && Array.isArray(data.sessions)) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(data.sessions));
    }
    
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
    }
    
    return true;
  } catch (error) {
    console.error('导入数据失败:', error);
    return false;
  }
}
