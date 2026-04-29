'use client';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Layers, Code2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Zap className="w-6 h-6 text-primary-300" />
          AppForge
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-primary-200 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-white text-primary-900 rounded-lg font-medium hover:bg-primary-50 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-700/50 rounded-full text-sm text-primary-200 mb-8 border border-primary-600">
          <Zap className="w-4 h-4" />
          Config → Working App in seconds
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Build Apps from
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-cyan-300"> JSON</span>
        </h1>

        <p className="text-xl text-primary-200 max-w-2xl mx-auto mb-10">
          AppForge turns your JSON configuration into a fully working web application — with forms, tables, APIs, and authentication — automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-lg px-8 py-3 bg-white text-primary-900 hover:bg-primary-50 rounded-xl justify-center">
            Start Building Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-8 py-3 text-white border-primary-500 hover:bg-primary-700 rounded-xl justify-center">
            View Demo
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            { icon: Code2, title: 'Config-Driven', desc: 'Define your entire app in JSON. Forms, tables, dashboards — all generated automatically.' },
            { icon: Shield, title: 'Auth Built-in', desc: 'Email/password and Google OAuth ready out of the box. User-scoped data access.' },
            { icon: Layers, title: 'Fully Extensible', desc: 'Add new component types without rewriting core logic. Built for change.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card bg-primary-800/50 border-primary-700 p-6 rounded-xl">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-primary-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Sample JSON */}
        <div className="mt-20 text-left max-w-2xl mx-auto">
          <p className="text-center text-primary-300 text-sm mb-4">Example config that generates a full CRM app:</p>
          <pre className="bg-gray-900 rounded-xl p-6 text-sm text-green-300 overflow-x-auto border border-gray-700">
{`{
  "name": "Customer CRM",
  "components": [
    {
      "type": "form",
      "title": "Add Customer",
      "collection": "customers",
      "fields": [
        { "name": "name", "type": "text", "required": true },
        { "name": "email", "type": "email", "required": true },
        { "name": "status", "type": "select",
          "options": ["Lead", "Active", "Churned"] }
      ]
    },
    {
      "type": "table",
      "title": "All Customers",
      "collection": "customers"
    }
  ]
}`}
          </pre>
        </div>
      </main>
    </div>
  );
}
