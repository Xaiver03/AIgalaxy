'use client'

import React from 'react'
import Link from 'next/link'

export interface AgentCardItem {
  id: string
  name: string
  description: string
  tags: string[]
  manager: string
  guideUrl?: string
  homepage?: string
  icon?: string
  coverImage?: string | null
  themeColor?: string | null
}

interface AgentsCardGridProps {
  agents: AgentCardItem[]
}

const AgentsCardGrid: React.FC<AgentsCardGridProps> = ({ agents }) => {
  return (
    <div
      style={{
        position: 'relative',
        padding: '140px 24px 120px',
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: '16px',
        }}
      >
        {agents.map((agent) => {
          const color = agent.themeColor || '#6EE7F9'
          return (
            <div
              key={agent.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}
            >
              {/* 上部主体：左右各一半 */}
              <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {/* 左半：封面图片或渐变+emoji */}
                <div
                  style={{
                    width: '50%',
                    position: 'relative',
                    background: agent.coverImage
                      ? `center/cover no-repeat url(${agent.coverImage})`
                      : `linear-gradient(135deg, ${color}33, ${color}11)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {!agent.coverImage && (
                    <div
                      style={{
                        fontSize: 42,
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))',
                      }}
                    >
                      {agent.icon || '🤖'}
                    </div>
                  )}
                </div>

                {/* 右半：标题、简介、标签 */}
                <div
                  style={{
                    width: '50%',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    color: '#fff',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color }}>
                    {agent.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.4,
                      opacity: 0.9,
                      flex: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 4 as unknown as number,
                      WebkitBoxOrient: 'vertical' as unknown as any,
                    }}
                    title={agent.description}
                  >
                    {agent.description}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {agent.tags?.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 10,
                          padding: '2px 6px',
                          borderRadius: 8,
                          border: `1px solid ${color}55`,
                          background: `${color}1a`,
                          color,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 底部：操作按钮 */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  padding: 10,
                  background: 'rgba(0,0,0,0.55)'
                }}
              >
                <Link
                  href={agent.guideUrl || `/agents/${agent.id}`}
                  style={{
                    flex: 1,
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: `1px solid ${color}66`,
                    color,
                    background: 'rgba(255,255,255,0.06)'
                  }}
                >
                  📖 使用指南
                </Link>
                {agent.homepage && (
                  <a
                    href={agent.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontSize: 12,
                      padding: '6px 10px',
                      borderRadius: 8,
                      border: `1px solid ${color}`,
                      color: '#fff',
                      background: `linear-gradient(135deg, ${color}aa, ${color}66)`
                    }}
                  >
                    🌐 访问官网
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AgentsCardGrid

