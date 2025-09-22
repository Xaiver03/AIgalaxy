'use client'

import React from 'react'
import { StarField } from '@/components/StarField'
import AgentsCardGrid, { AgentCardItem } from '@/components/AgentsCardGrid'

interface AgentLike {
  id: string
  name: string
  description: string
  tags: string[] | string
  manager: string
  guideUrl?: string
  homepage?: string
  icon?: string
  enabled: boolean
  clickCount?: number
  coverImage?: string | null
  themeColor?: string | null
}

interface ProductCardsProps {
  agents: AgentLike[]
  loading?: boolean
  searchTerm: string
  selectedTag: string
  allTags: string[]
  onSearchChange: (v: string) => void
  onTagChange: (v: string) => void
}

const ProductCards: React.FC<ProductCardsProps> = ({
  agents,
  loading,
  searchTerm,
  selectedTag,
  allTags,
  onSearchChange,
  onTagChange
}) => {
  // 统一 tags 为数组
  const normalizedAgents: AgentCardItem[] = agents.map(a => ({
    ...a,
    tags: Array.isArray(a.tags) ? a.tags : (a.tags ? a.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
  }))

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 共享背景 */}
      <StarField />

      {/* 顶部工具栏：一行（标题 / 搜索 / 分类 / 数量）*/}
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 999,
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>🌌 奇绩AI星图</div>
        <input
          type="text"
          placeholder="搜索工具..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: 240,
            padding: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            color: '#fff'
          }}
        />
        <select
          value={selectedTag}
          onChange={(e) => onTagChange(e.target.value)}
          style={{
            width: 160,
            padding: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            color: '#fff'
          }}
        >
          <option value="all">全部分类</option>
          {allTags.map(tag => (
            <option key={tag} value={tag} style={{ color: 'black' }}>{tag}</option>
          ))}
        </select>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, whiteSpace: 'nowrap' }}>🗂️ {normalizedAgents.length} 个AI工具</div>
      </div>

      {/* 卡片网格 */}
      <AgentsCardGrid agents={normalizedAgents} />

      {loading && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', color: '#fff', opacity: 0.7 }}>加载中...</div>
      )}
    </div>
  )
}

export default ProductCards

