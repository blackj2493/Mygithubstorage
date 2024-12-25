// components/home/CallToAction.tsx
import Link from 'next/link';

export const CallToAction = () => (
  <div className="py-20 bg-blue-900 text-white">
    <div className="max-w-4xl mx-auto text-center px-4">
      <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
      <p className="text-xl mb-8">Join thousands of satisfied customers who've found their perfect home</p>
      <Link href="/signup" className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
        Create Your Account
      </Link>
    </div>
  </div>
);