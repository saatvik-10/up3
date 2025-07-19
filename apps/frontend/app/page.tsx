import { Button } from '@/components/ui/button';
import {
  Shield,
  Zap,
  Globe,
  BarChart3,
  CheckCircle,
  Star,
  Bell,
  Lock,
  MoveRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden'>
      <section className='relative pt-20 pb-32'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10'></div>
        <div className='absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl'></div>
        <div className='absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl'></div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-8'>
              <Star className='w-4 h-4 text-yellow-400 mr-2' />
              <span className='text-sm font-medium text-blue-200'>
                Trusted worldwide
              </span>
            </div>

            <h1 className='text-5xl md:text-7xl font-bold leading-tight'>
              <span className='bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent'>
                Monitor Your
              </span>
              <br />
              <span className='bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'>
                Infrastructure
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-gray-300 max-w-xl mx-auto leading-relaxed'>
              Real-time uptime monitoring for your infrastructure. Get instant
              alerts when something goes down.
            </p>

            <Link href='/dashboard'>
              <Button className='mt-4 bg-transparent border-2 border-white text-white hover:bg-white/20 cursor-pointer'>
                <span className='flex items-center justify-center gap-2'>
                  Start Monitoring
                  <MoveRight className='w-4 h-4 animate-pulse' />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className='py-24 relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                Why Choose Up3?
              </span>
            </h2>
            <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
              Built specifically for Web3, with features that matter to
              blockchain developers
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: <Zap className='w-8 h-8' />,
                title: 'Lightning Fast',
                description:
                  'Monitor your endpoints every 60 seconds with sub-second response times',
                gradient: 'from-yellow-400 to-orange-500',
              },
              {
                icon: <Shield className='w-8 h-8' />,
                title: 'Robust & Reliable',
                description:
                  'Built for any infrastructure — websites, APIs, servers, and more',
                gradient: 'from-blue-400 to-cyan-500',
              },
              {
                icon: <Bell className='w-8 h-8' />,
                title: 'Smart Alerts',
                description: 'Get notified instantly if your service goes down',
                gradient: 'from-purple-400 to-pink-500',
              },
              {
                icon: <BarChart3 className='w-8 h-8' />,
                title: 'Analytics Dashboard',
                description:
                  'Beautiful charts and insights to understand your uptime patterns',
                gradient: 'from-green-400 to-emerald-500',
              },
              {
                icon: <Globe className='w-8 h-8' />,
                title: 'Global Monitoring',
                description:
                  'Check from multiple locations worldwide for accurate availability data',
                gradient: 'from-indigo-400 to-purple-500',
              },
              {
                icon: <Lock className='w-8 h-8' />,
                title: 'Enterprise Security',
                description:
                  'SOC 2 compliant with end-to-end encryption and audit logs',
                gradient: 'from-red-400 to-pink-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className='group p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105'
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold mb-4'>{feature.title}</h3>
                <p className='text-gray-400 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-24 relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10'></div>
        <div className='relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6'>
          <h2 className='text-4xl md:text-5xl font-bold'>
            <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              Ready to Start Monitoring?
            </span>
          </h2>
          <p className='text-xl text-gray-400'>
            Join thousands of Web3 teams who trust Up3 to keep their
            infrastructure running smoothly
          </p>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-400' />
              <span>Free forever plan</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-400' />
              <span>No credit card required</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-400' />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <footer className='py-12 border-t border-gray-800/50'>
        <div className='mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500'>
          <p>
            &copy; {new Date().getFullYear()} Up3. Built for the decentralized
            future.
          </p>
        </div>
      </footer>
    </div>
  );
}
