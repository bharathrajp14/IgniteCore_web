'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
  dark?: boolean;
}

export function Section({ title, children, id, dark = false }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className={`py-20 md:py-32 px-6 ${dark ? 'bg-slate-950' : 'bg-white'}`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-4xl md:text-5xl font-bold mb-12 ${dark ? 'text-white' : 'text-slate-900'}`}
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}

export function ProblemGrid({ items }: { items: Array<{ title: string; description: string }> }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold text-red-600 mb-2">{item.title}</h3>
          <p className="text-gray-700">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function OpportunityStats({ stats }: { stats: Array<{ label: string; value: string; description: string }> }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 text-center border border-blue-100"
        >
          <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
          <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>
          <p className="text-xs text-gray-500">{stat.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function SolutionPillars({ pillars }: { pillars: Array<{ title: string; description: string; details: string }> }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {pillars.map((pillar, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.15 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-500 hover:shadow-xl transition-shadow"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-purple-600">{idx + 1}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
          <p className="text-gray-600 mb-4 font-medium">{pillar.description}</p>
          <p className="text-sm text-gray-500">{pillar.details}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function RevenueStreams({ streams }: { streams: Array<{ name: string; price: string; cycle: string; example: string; margin: string }> }) {
  return (
    <div className="space-y-6">
      {streams.map((stream, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900">{stream.name}</h3>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{stream.price}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Cycle</p>
              <p className="text-gray-700">{stream.cycle}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Example</p>
              <p className="text-gray-700">{stream.example}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Margin</p>
              <p className="text-green-600 font-bold">{stream.margin}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TractionHighlights({ highlights }: { highlights: Array<{ metric: string; description: string }> }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      {highlights.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 text-center border border-yellow-200"
        >
          <p className="text-3xl font-bold text-orange-600 mb-2">{item.metric}</p>
          <p className="text-xs text-gray-600">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function RoadmapPhases({ phases }: { phases: Array<{ quarter: string; goals: string[] }> }) {
  return (
    <div className="space-y-6">
      {phases.map((phase, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-6"
        >
          <h3 className="text-xl font-bold text-blue-600 mb-4">{phase.quarter}</h3>
          <ul className="space-y-2">
            {phase.goals.map((goal, goalIdx) => (
              <li key={goalIdx} className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">✓</span>
                <span className="text-gray-700">{goal}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

export function FinancialChart({ data }: { data: Array<{ month: string; arr: number; customers: number }> }) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Annual Recurring Revenue (ARR) Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6' }}
              formatter={(value: number | string) => `₹${(Number(value) / 100000).toFixed(1)}L`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="arr"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
              name="ARR"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #8b5cf6' }} />
            <Legend />
            <Bar dataKey="customers" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Active Clients" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
