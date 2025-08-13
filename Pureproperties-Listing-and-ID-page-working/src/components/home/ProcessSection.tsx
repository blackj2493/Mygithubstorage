// components/home/ProcessSection.tsx
import { ArrowRight } from 'lucide-react';

export const ProcessSection = () => (
  <div className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {[
          { title: "Create Account", desc: "Sign up in minutes" },
          { title: "List or Search", desc: "Browse or post properties" },
          { title: "Connect", desc: "Chat with buyers/sellers" },
          { title: "Close Deal", desc: "Secure transaction process" }
        ].map((step, i) => (
          <div key={i} className="relative text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {i + 1}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
            {i < 3 && (
              <ArrowRight className="hidden md:block absolute top-6 -right-4 text-blue-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);