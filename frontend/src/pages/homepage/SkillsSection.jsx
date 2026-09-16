import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

export default function SkillsSection({ skillCategories, t }) {
  if (Object.keys(skillCategories).length === 0) return null

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
            <Cpu className="w-4 h-4 mr-2" />
            {t('home.skills.badge')}
          </span>
          <h2 className="section-title">{t('home.skills.title')}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skillCategories).map(([category, categorySkills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="card-glass p-8"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                  index === 0 ? 'from-blue-500 to-cyan-500' :
                  index === 1 ? 'from-purple-500 to-pink-500' :
                  'from-amber-500 to-orange-500'
                } mr-3`} />
                {category}
              </h3>
              <div className="space-y-5">
                {categorySkills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">{skill.name}</span>
                      <span className="text-indigo-600 font-semibold">{skill.proficiency}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
