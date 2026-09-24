import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, PenTool, Briefcase, Github, Linkedin, Mail, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import ParticleBackground from '../../components/ParticleBackground'
import TypewriterText from '../../components/TypewriterText'

export default function HeroSection({ profile, typewriterTexts, t, mousePosition }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 粒子背景 */}
      <ParticleBackground />

      {/* 动态渐变背景 */}
      <div className="absolute inset-0 hero-gradient opacity-10" />

      {/* 装饰圆形 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl float-delay-1" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl float-delay-2" />

      {/* 鼠标跟随光效 */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full blur-3xl"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* 头像区域 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
          className="relative inline-block mb-8"
        >
          <div className="relative">
            {/* 外圈旋转装饰 */}
            <motion.div
              className="absolute inset-0 w-40 h-40 rounded-full border-2 border-dashed border-indigo-400/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            {/* 中圈反向旋转 */}
            <motion.div
              className="absolute inset-2 w-36 h-36 rounded-full border-2 border-dashed border-purple-400/50"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            {/* 头像容器 */}
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 hero-avatar-gradient rounded-full animate-gradient" />
              <div className="absolute inset-1 hero-avatar-gradient rounded-full flex items-center justify-center hero-avatar-glow" style={{ opacity: 0.9 }}>
                <span className="text-white font-bold text-5xl drop-shadow-lg">
                  {profile?.nickname?.charAt(0) || 'W'}
                </span>
              </div>
              {/* 状态指示器 */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border-4 border-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* 欢迎文字 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-medium text-lg mb-2" style={{ color: 'var(--theme-primary)' }}>
            {profile?.welcomeText || '👋 Hello, I\'m'}
          </p>
        </motion.div>

        {/* 名字 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span style={{
            background: 'var(--theme-gradient-text)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {profile?.nickname || 'Claw'}
          </span>
        </motion.h1>

        {/* 打字机效果 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 h-8"
        >
          <span className="text-gray-500">{t('home.hero.prefix')}</span>
          <span
            className="font-semibold mx-2"
            style={{
              background: 'var(--theme-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <TypewriterText texts={typewriterTexts} />
          </span>
        </motion.div>

        {/* 简介 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {profile?.bio || t('home.defaultBio')}
        </motion.p>

        {/* 社交链接和按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link to="/blog" className="btn-primary flex items-center space-x-2 group">
            <PenTool className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>{t('home.hero.readBlog')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/projects" className="btn-secondary flex items-center space-x-2 group">
            <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{t('home.hero.viewProjects')}</span>
          </Link>
        </motion.div>

        {/* 社交图标 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-6"
        >
          {[
            { icon: Github, href: profile?.github || 'https://github.com', label: 'GitHub' },
            // { icon: Linkedin, href: profile?.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
            { icon: Mail, href: profile?.emailPublic ? `mailto:${profile.emailPublic}` : 'mailto:hello@example.com', label: 'Email' },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 text-gray-600 hover:text-indigo-600 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
