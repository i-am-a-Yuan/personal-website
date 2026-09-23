import { useState, useEffect } from 'react'
import { Code, Coffee, PenTool, Rocket, Database, Globe, Star } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../i18n/translations'
import HeroSection from './homepage/HeroSection'
import StatsSection from './homepage/StatsSection'
import FeaturesSection from './homepage/FeaturesSection'
import SkillsSection from './homepage/SkillsSection'
import ArticlesSection from './homepage/ArticlesSection'
import ProjectsSection from './homepage/ProjectsSection'
import CtaSection from './homepage/CtaSection'

export default function HomePage() {
  const [articles, setArticles] = useState([])
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { language } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    // 使用真实后端 API
    fetch('/api/public/articles?page=0&size=3')
      .then(res => res.json())
      .then(data => setArticles(data.content || []))
      .catch(() => {
        // 如果后端不可用，使用 mock 数据
        import('../api/mockApi').then(module => {
          setArticles(module.default.getArticles().slice(0, 3))
        })
      })

    fetch('/api/public/projects/featured')
      .then(res => res.json())
      .then(data => setProjects(data || []))
      .catch(() => {
        import('../api/mockApi').then(module => {
          setProjects(module.default.getProjects().filter(p => p.featured))
        })
      })

    fetch('/api/public/skills')
      .then(res => res.json())
      .then(data => setSkills(data || []))
      .catch(() => {
        import('../api/mockApi').then(module => {
          setSkills(module.default.getSkills())
        })
      })

    // 获取统计数据
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {
        // 使用默认统计数据
      })

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 语言切换时重新获取 profile
  useEffect(() => {
    fetch(`/api/public/profile?lang=${language}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {
        import('../api/mockApi').then(module => {
          setProfile(module.default.getProfile(language))
        })
      })
  }, [language])

  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  // 职业标签：从 profile.tags 解析，或使用默认值
  const defaultTags = language === 'en'
    ? ['Full Stack Developer', 'Tech Enthusiast', 'Lifelong Learner', 'Open Source Contributor']
    : ['全栈开发者', '技术爱好者', '终身学习者', '开源贡献者']
  const typewriterTexts = profile?.tags
    ? profile.tags.split(',').map(t => t.trim()).filter(Boolean)
    : defaultTags

  // 统计数据：优先使用 API 数据
  const displayStats = [
    { icon: Coffee, value: stats?.coffeeCount || 1000, label: t('home.stats.coffee'), color: 'from-amber-500 to-orange-500' },
    { icon: Code, value: stats?.projectCount || 50, label: t('home.stats.projects'), color: 'from-indigo-500 to-purple-500' },
    { icon: PenTool, value: stats?.articleCount || 100, label: t('home.stats.articles'), color: 'from-pink-500 to-rose-500' },
    { icon: Star, value: stats?.starsCount || 1000, label: t('home.stats.stars'), color: 'from-yellow-500 to-amber-500' }
  ]

  const features = [
    {
      icon: Code,
      title: t('home.features.fullStack.title'),
      desc: t('home.features.fullStack.desc'),
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'blue'
    },
    {
      icon: Database,
      title: t('home.features.architecture.title'),
      desc: t('home.features.architecture.desc'),
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'purple'
    },
    {
      icon: Globe,
      title: t('home.features.writing.title'),
      desc: t('home.features.writing.desc'),
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'amber'
    },
    {
      icon: Rocket,
      title: t('home.features.innovation.title'),
      desc: t('home.features.innovation.desc'),
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'emerald'
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <HeroSection
        profile={profile}
        typewriterTexts={typewriterTexts}
        t={t}
        mousePosition={mousePosition}
      />

      {/* 统计数据 */}
      <StatsSection stats={displayStats} />

      {/* 特色功能 */}
      <FeaturesSection features={features} t={t} />

      {/* 技能展示 */}
      <SkillsSection skillCategories={skillCategories} t={t} />

      {/* 最新文章 */}
      <ArticlesSection articles={articles} t={t} />

      {/* 精选项目 */}
      <ProjectsSection projects={projects} t={t} />

      {/* CTA 区域 */}
      <CtaSection profile={profile} t={t} />
    </div>
  )
}