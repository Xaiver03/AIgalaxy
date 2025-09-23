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
    <div style={{ position: 'relative' }}>
      {/* 卡片网格 - 布局和间距由父页面管理 */}
      <AgentsCardGrid agents={normalizedAgents} />

      {loading && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', color: '#fff', opacity: 0.7 }}>加载中...</div>
      )}
    </div>
  )
}

export default ProductCards
