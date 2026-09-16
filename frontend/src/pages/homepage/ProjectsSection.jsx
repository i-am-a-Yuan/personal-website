import { motion } from 'framer-motion'
import { Rocket, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectCard from '../../components/ProjectCard'

export default function ProjectsSection({ projects, t }) {
  if (projects.length === 0) return null

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              {t('home.projects.badge')}
            </span>
            <h2 className="section-title mb-0">{t('home.projects.title')}</h2>
          </div>
          <Link to="/projects" className="group flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium mt-4 md:mt-0">
            <span>{t('home.sections.viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.slice(0, 2).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="perspective-1000"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
