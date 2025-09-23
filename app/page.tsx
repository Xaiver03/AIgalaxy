'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ProductCards from '@/components/ProductCards'
import { StarField } from '@/components/StarField'

const GalaxyStarSystem = dynamic(() => import('@/components/GalaxyStarSystem'), {
  loading: () => <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: 'white'
  }}>🌌 加载星系中...</div>,
  ssr: false
})

const FeedbackButtons = dynamic(() => import('@/components/FeedbackButtons'), {
  loading: () => null,
  ssr: false
})

const Danmaku = dynamic(() => import('@/components/Danmaku'), {
  loading: () => null,
  ssr: false
})

interface Agent {
  id: string
  name: string
  description: string
  tags: string[] | string
  manager: string
  guideUrl?: string
  homepage?: string
  icon?: string
  coverImage?: string | null
  themeColor?: string | null
  enabled: boolean
  clickCount?: number
}

export default function Galaxy3DPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [danmakuInputVisible, setDanmakuInputVisible] = useState(false)
  const [danmakuPlaying, setDanmakuPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<'galaxy' | 'cards'>(() => {
    if (typeof window === 'undefined') return 'galaxy'
    return (localStorage.getItem('ai-galaxy-view') as 'galaxy' | 'cards') || 'galaxy'
  })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  useEffect(() => {
    // 持久化视图模式
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-galaxy-view', viewMode)
    }
  }, [viewMode])

  useEffect(() => {
    // 首次挂载后再读取一次，避免SSR导致的初始值不一致
    if (typeof window !== 'undefined') {
      const saved = (localStorage.getItem('ai-galaxy-view') as 'galaxy' | 'cards') || 'galaxy'
      if (saved !== viewMode) setViewMode(saved)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    let filtered = agents.filter(agent => agent.enabled)
    
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(agent.tags) && agent.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    }
    
    if (selectedTag !== 'all') {
      filtered = filtered.filter(agent => 
        Array.isArray(agent.tags) && agent.tags.includes(selectedTag)
      )
    }
    
    setFilteredAgents(filtered)
  }, [searchTerm, selectedTag, agents])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/agents?_=${Date.now()}` as any, { cache: 'no-store' as RequestCache })
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      setAgents(data.agents)
      
      const allTagsSet = new Set<string>()
      data.agents.forEach((agent: Agent) => {
        if (Array.isArray(agent.tags)) {
          agent.tags.forEach(tag => allTagsSet.add(tag))
        }
      })
      setAllTags(Array.from(allTagsSet))
    } catch (err) {
      console.error('Failed to load agents:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !hydrated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'rotate 2s linear infinite'
          }}>
            🌌
          </div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            正在初始化奇绩AI星系...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            准备观测星海中的奇绩AI智慧
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 银河系AI星图标题 - 仅在星系模式显示 */}
      {viewMode === 'galaxy' && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#e5e5e5',
            textShadow: `
              0 0 10px rgba(192, 192, 192, 0.8),
              0 0 20px rgba(192, 192, 192, 0.6),
              0 0 30px rgba(192, 192, 192, 0.4),
              0 0 40px rgba(192, 192, 192, 0.2)
            `,
            animation: 'glow 2s ease-in-out infinite alternate',
            letterSpacing: '2px',
            margin: 0,
            padding: 0
          }}>
            MiraclePlus AI Galaxy
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(192, 192, 192, 0.8)',
            margin: '8px 0 0 0',
            textShadow: '0 0 5px rgba(192, 192, 192, 0.5)'
          }}>
            探索奇绩AI的星海
          </p>
        </div>
      )}

      {/* CSS动画 - 增加脉冲效果 */}
      <style jsx global>{`
        @keyframes glow {
          from {
            text-shadow:
              0 0 10px rgba(192, 192, 192, 0.8),
              0 0 20px rgba(192, 192, 192, 0.6),
              0 0 30px rgba(192, 192, 192, 0.4),
              0 0 40px rgba(192, 192, 192, 0.2);
          }
          to {
            text-shadow:
              0 0 20px rgba(192, 192, 192, 1),
              0 0 30px rgba(192, 192, 192, 0.8),
              0 0 50px rgba(192, 192, 192, 0.6),
              0 0 70px rgba(192, 192, 192, 0.4);
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
          }
          50% {
            box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.3);
          }
        }
      `}</style>

      {/* 视图区域 */}
      {viewMode === 'galaxy' ? (
        <GalaxyStarSystem
          agents={filteredAgents.map(a => ({ ...a, themeColor: a.themeColor || undefined })) as any}
        />
      ) : (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          {/* 共享背景 - 卡片模式使用与星系模式一致的背景 */}
          <StarField />

          {/* 卡片模式标题 */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            paddingTop: '60px',
            paddingBottom: '16px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#e5e5e5',
              textShadow: `
                0 0 10px rgba(192, 192, 192, 0.8),
                0 0 20px rgba(192, 192, 192, 0.6),
                0 0 30px rgba(192, 192, 192, 0.4),
                0 0 40px rgba(192, 192, 192, 0.2)
              `,
              animation: 'glow 2s ease-in-out infinite alternate',
              letterSpacing: '2px',
              margin: 0,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              🚀 奇绩AI产品展示
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(192, 192, 192, 0.8)',
              margin: '8px 0 0 0',
              textShadow: '0 0 5px rgba(192, 192, 192, 0.5)'
            }}>
              探索最前沿的AI工具和应用
            </p>
          </div>

          {/* 卡片模式搜索工具栏 */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 999,
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔍 搜索产品
              </div>
              <input
                type="text"
                placeholder='搜索AI工具...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 240, padding: '8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '6px', color: 'white' }}
              />
              <div style={{ color: '#fff', fontSize: 12, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🏷️ 产品分类
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={{ width: 160, padding: '8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '6px', color: 'white' }}
              >
                <option value="all">全部分类</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag} style={{ color: 'black' }}>{tag}</option>
                ))}
              </select>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⭐ 找到 {filteredAgents.length} 个AI产品
              </div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: 2 }}>
                <button onClick={() => setViewMode('galaxy')} style={{ padding: '6px 10px', fontSize: 12, borderRadius: 999, border: 'none', cursor: 'pointer', color: '#ddd', background: 'transparent' }}>🪐</button>
                <button onClick={() => setViewMode('cards')} style={{ padding: '6px 10px', fontSize: 12, borderRadius: 999, border: 'none', cursor: 'pointer', color: '#111', background: '#fff' }}>🗂️</button>
              </div>
            </div>
          </div>

          <ProductCards
            agents={filteredAgents}
            loading={loading}
            searchTerm={searchTerm}
            selectedTag={selectedTag}
            allTags={allTags}
            onSearchChange={setSearchTerm}
            onTagChange={setSelectedTag}
          />
        </div>
      )}

      {/* 搜索和筛选控制（仅Galaxy模式：左侧面板）*/}
      {viewMode === 'galaxy' && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          fontSize: '14px',
          zIndex: 1200,
          minWidth: '200px',
          maxWidth: '220px'
        }}>
          <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>
            🌌 奇绩AI星图
          </div>
          {/* 视图切换（备选入口） */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: 2 }}>
            <button onClick={() => setViewMode('galaxy')} style={{ flex: 1, padding: '6px 8px', fontSize: 12, borderRadius: 999, border: 'none', cursor: 'pointer', color: '#111', background: '#fff' }}>🪐 星系</button>
            <button onClick={() => setViewMode('cards')} style={{ flex: 1, padding: '6px 8px', fontSize: 12, borderRadius: 999, border: 'none', cursor: 'pointer', color: '#ddd', background: 'transparent' }}>🗂️ 卡片</button>
          </div>
          <input
            type="text"
            placeholder='搜索星星...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '6px', color: 'white', boxSizing: 'border-box' }}
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '6px', color: 'white' }}
          >
            <option value="all">全部分类</option>
            {allTags.map(tag => (
              <option key={tag} value={tag} style={{ color: 'black' }}>{tag}</option>
            ))}
          </select>
          <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
            ⭐ {filteredAgents.length} 颗AI星星
          </div>
          
          {/* 弹幕控制区域 */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>💬 弹幕系统</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <button onClick={() => setDanmakuInputVisible(!danmakuInputVisible)} style={{ flex: 1, padding: '6px 8px', background: danmakuInputVisible ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer', transition: 'all 0.3s ease', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>{danmakuInputVisible ? '关闭输入' : '发送弹幕'}</button>
              <button onClick={() => setDanmakuPlaying(!danmakuPlaying)} style={{ flex: 1, padding: '6px 8px', background: danmakuPlaying ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer', transition: 'all 0.3s ease', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>{danmakuPlaying ? '停止播放' : '播放弹幕'}</button>
            </div>
          </div>
        </div>
      )}

      {/* 反馈按钮 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150
      }}>
        <FeedbackButtons />
      </div>

      {/* 作者信息 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        zIndex: 100,
        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <div style={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          创新活动产品组
        </div>
        <div style={{ 
          fontSize: '11px',
          opacity: 0.8
        }}>
          Made by Xaiver / 邓湘雷
        </div>
      </div>

      {/* 右下角视图切换 + 版权 */}
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
        <div
          style={{
            display: 'flex',
            background: viewMode === 'cards' ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.85)',
            border: viewMode === 'cards' ? '2px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            overflow: 'hidden',
            boxShadow: viewMode === 'cards' ? '0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)' : '0 8px 20px rgba(0,0,0,0.4)',
            animation: viewMode === 'cards' ? 'pulse 2s infinite' : 'none'
          }}
        >
          <button
            onClick={() => setViewMode('galaxy')}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              color: viewMode === 'galaxy' ? '#111' : '#ddd',
              background: viewMode === 'galaxy' ? '#fff' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: viewMode === 'galaxy' ? 'bold' : 'normal'
            }}
          >
            🪐 星系
          </button>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              color: viewMode === 'cards' ? '#111' : '#ddd',
              background: viewMode === 'cards' ? '#fff' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: viewMode === 'cards' ? 'bold' : 'normal'
            }}
          >
            🗂️ 卡片
          </button>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>⭐ MiraclePlus AI Galaxy Star System</div>
      </div>

      {/* 弹幕系统 */}
      <Danmaku 
        enabled={true} 
        showInput={danmakuInputVisible}
        isPlaying={danmakuPlaying}
        onShowInputChange={setDanmakuInputVisible}
        onPlayingChange={setDanmakuPlaying}
      />
    </div>
  )
}
