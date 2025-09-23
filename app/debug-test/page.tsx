'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [hydrated, setHydrated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    console.log('🚀 useEffect 执行开始')
    setHydrated(true)
    console.log('✅ hydrated 设置为 true')

    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        console.log('✅ 数据获取成功:', data.agents?.length, 'agents')
        setData(data)
        setLoading(false)
        console.log('✅ loading 设置为 false')
      })
      .catch(err => {
        console.error('❌ 数据获取失败:', err)
        setLoading(false)
      })
  }, [])

  console.log('🔍 当前状态:', { hydrated, loading, hasData: !!data })

  if (!hydrated) {
    return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      🌌 hydration检查中...
    </div>
  }

  if (loading) {
    return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      ⏳ 数据加载中...
    </div>
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>🎉 加载成功！</h1>
      <p>Agent数量: {data?.agents?.length || 0}</p>
      <pre>{JSON.stringify(data?.agents?.[0], null, 2)}</pre>
    </div>
  )
}