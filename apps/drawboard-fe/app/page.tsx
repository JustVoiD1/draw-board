'use client';
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button"
import { ArrowRight, Pencil, Users, Zap, Download, Lock, Layers } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Pencil className="h-6 w-6 text-slate-900 dark:text-white" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">DrawBoard</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href='/signin'>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href='/signup'>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Sketch, Collaborate,
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  Create Together
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                A powerful, intuitive whiteboard tool for visual collaboration.
                Draw diagrams, brainstorm ideas, and bring your team together in real-time.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={'/dashboard'}>
                  <Button size="lg" className="cursor-pointer text-base px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                    Start Drawing Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={'https://youtu.be/S3WJCJDDTps?si=-4eWEhdY8M_3fOnS'} target="_blank">
                <Button size="lg" variant="outline" className="cursor-pointer text-base px-8 py-6 border-2">
                  Watch Demo
                </Button>
                </Link>
              </div>
            </div>

            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <div className="h-32 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2 border-blue-200 dark:border-blue-800" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-32 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-32 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 transform rotate-6" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-32 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border-2 border-amber-200 dark:border-amber-800" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Everything you need to visualize ideas
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Powerful features designed for teams and individuals who think visually
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Lightning Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Built for speed with instant rendering and smooth drawing experience, even with complex diagrams.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Real-time Collaboration
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Work together seamlessly with your team. See changes instantly as they happen.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-6">
                  <Layers className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Rich Drawing Tools
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  From basic shapes to complex diagrams, we have all the tools you need to express your ideas.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-6">
                  <Download className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Export Anywhere
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Export your work as PNG, SVG, or JSON. Your creations, your way.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-lg flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Secure & Private
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your data is encrypted and secure. Private boards stay private, shared boards stay controlled.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-6">
                  <Pencil className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Hand-drawn Feel
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Beautiful hand-drawn style makes your diagrams feel natural and approachable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-12 sm:p-16 text-center shadow-2xl">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                Ready to start creating?
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of teams who trust DrawBoard for their visual collaboration needs.
              </p>
              <Link href={'/signup'}>
                <Button size="lg" className="text-base px-8 py-6 bg-white text-slate-900 hover:bg-slate-100">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Pencil className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">DrawBoard</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 DrawBoard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
