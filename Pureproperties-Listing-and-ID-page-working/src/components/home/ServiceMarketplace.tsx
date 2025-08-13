// components/home/ServiceMarketplace.tsx
export const ServiceMarketplace = () => (
    <div className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Professional Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Photography", icon: "📸" },
            { title: "Legal", icon: "⚖️" },
            { title: "Home Inspection", icon: "🏠" },
            { title: "Mortgage", icon: "💰" }
          ].map((service, i) => (
            <div key={i} className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-semibold">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );