import { motion } from 'framer-motion'
import { PenTool, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArticleCard from '../../components/ArticleCard'

export default function ArticlesSection({ articles, t }) {
  if (articles.length === 0) return null

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm font-medium mb-4">
              <PenTool className="w-4 h-4 mr-2" />
              {t('home.articles.badge')}
            </span>
            <h2 className="section-title mb-0">{t('home.articles.title')}</h2>
          </div>
          <Link to="/blog" className="group flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium mt-4 md:mt-0">
            <span>{t('home.sections.viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
