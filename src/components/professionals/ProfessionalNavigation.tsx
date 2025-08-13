'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, UserPlus, LayoutDashboard, Star, 
  Camera, Scale, Home, Calculator, Megaphone,
  Users, Award, TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PROFESSIONAL_SERVICES = [
  { id: 1, name: 'Photography', slug: 'photography', icon: Camera, color: 'text-blue-600' },
  { id: 2, name: 'Legal Services', slug: 'legal', icon: Scale, color: 'text-purple-600' },
  { id: 3, name: 'Home Staging', slug: 'staging', icon: Home, color: 'text-green-600' },
  { id: 4, name: 'Mortgage Broker', slug: 'mortgage', icon: Calculator, color: 'text-orange-600' },
  { id: 5, name: 'Social Media Marketing', slug: 'marketing', icon: Megaphone, color: 'text-pink-600' }
]

interface ProfessionalNavigationProps {
  className?: string
  showServiceIcons?: boolean
}

export default function ProfessionalNavigation({ 
  className, 
  showServiceIcons = false 
}: ProfessionalNavigationProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      href: '/professionals',
      label: 'Find Professionals',
      icon: Search,
      description: 'Search and discover verified professionals',
      active: pathname === '/professionals'
    },
    {
      href: '/professionals/register',
      label: 'Join as Professional',
      icon: UserPlus,
      description: 'Register your professional services',
      active: pathname === '/professionals/register'
    },
    {
      href: '/professionals/dashboard',
      label: 'Professional Dashboard',
      icon: LayoutDashboard,
      description: 'Manage your professional profile',
      active: pathname === '/professionals/dashboard',
      requiresAuth: true
    }
  ]

  return (
    <div className={cn("bg-white border-b", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/professionals" className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Professional Services</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      item.active
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/professionals/register">
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Network
              </Button>
            </Link>
            <Link href="/professionals">
              <Button size="sm">
                <Search className="h-4 w-4 mr-2" />
                Find Pros
              </Button>
            </Link>
          </div>
        </div>

        {/* Service Categories (Optional) */}
        {showServiceIcons && (
          <div className="border-t py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse by Service</h3>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Top Rated</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Fast Response</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {PROFESSIONAL_SERVICES.map((service) => {
                const Icon = service.icon
                return (
                  <Link
                    key={service.id}
                    href={`/professionals?service=${service.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={cn("p-2 rounded-lg bg-gray-100", service.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {service.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Find {service.name.toLowerCase()} professionals
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {navigationItems.slice(0, 2).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium",
                      item.active
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            
            {navigationItems.find(item => item.requiresAuth) && (
              <Link
                href="/professionals/dashboard"
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium",
                  pathname === '/professionals/dashboard'
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <LayoutDashboard className="h-3 w-3" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Breadcrumb component for professional pages
interface ProfessionalBreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    current?: boolean
  }>
  className?: string
}

export function ProfessionalBreadcrumb({ items, className }: ProfessionalBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-gray-500", className)}>
      <Link href="/" className="hover:text-gray-700">
        Home
      </Link>
      <span>/</span>
      <Link href="/professionals" className="hover:text-gray-700">
        Professionals
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span>/</span>
          {item.href && !item.current ? (
            <Link href={item.href} className="hover:text-gray-700">
              {item.label}
            </Link>
          ) : (
            <span className={cn(item.current && "text-gray-900 font-medium")}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Stats component for professional pages
interface ProfessionalStatsProps {
  stats: Array<{
    label: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    color?: string
  }>
  className?: string
}

export function ProfessionalStats({ stats, className }: ProfessionalStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg border p-4 text-center">
            <div className={cn("inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2", 
              stat.color || "bg-blue-100 text-blue-600"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}
