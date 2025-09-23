'use client'

import { useState, useEffect } from 'react'

export default function SimplePage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  console.log('🔍 SimplePage渲染 - loading:', loading)

  useEffect(() => {
    console.log('🚀 SimplePage useEffect执行！')

    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        console.log('✅ SimplePage 数据获取成功:', data.agents?.length)
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ SimplePage 数据获取失败:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <h1>🧪 简化测试页面</h1>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>🎉 简化测试成功！</h1>
      <p>Agent数量: {data?.agents?.length || 0}</p>
      <a href="/">返回主页</a>
    </div>
  )
}