'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Camera, Scale, Home, Calculator, Megaphone, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROFESSIONAL_SERVICES = [
  { id: 1, name: 'Photography', slug: 'photography', icon: Camera, description: 'Real estate photography services' },
  { id: 2, name: 'Legal Services', slug: 'legal', icon: Scale, description: 'Real estate lawyers for contracts and closing' },
  { id: 3, name: 'Home Staging', slug: 'staging', icon: Home, description: 'Professional home staging and interior design' },
  { id: 4, name: 'Mortgage Broker', slug: 'mortgage', icon: Calculator, description: 'Mortgage and financing consultation' },
  { id: 5, name: 'Social Media Marketing', slug: 'marketing', icon: Megaphone, description: 'Social media marketing for listings' }
]

const PRICE_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'per_sqft', label: 'Per Square Foot' },
  { value: 'custom', label: 'Custom Quote' }
]

interface RegistrationStep {
  id: number
  title: string
  description: string
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  { id: 1, title: 'Basic Information', description: 'Tell us about yourself and your business' },
  { id: 2, title: 'Services & Pricing', description: 'Select your services and set your rates' },
  { id: 3, title: 'Service Areas', description: 'Define where you provide services' },
  { id: 4, title: 'Profile & Portfolio', description: 'Complete your professional profile' },
  { id: 5, title: 'Verification', description: 'Upload documents for verification' }
]

export default function ProfessionalRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic info
    business_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    experience_years: '',
    license_number: '',
    website_url: '',
    
    // Services
    selected_services: [] as number[],
    service_details: {} as Record<number, {
      base_price: string
      price_type: string
      specializations: string[]
      years_experience: string
    }>,
    
    // Service areas
    postal_codes: [''],
    
    // Profile
    bio: '',
    profile_image: null as File | null,
    
    // Verification
    insurance_provider: '',
    insurance_policy: '',
    license_document: null as File | null
  })

  const progress = (currentStep / REGISTRATION_STEPS.length) * 100

  const handleServiceToggle = (serviceId: number) => {
    const isSelected = formData.selected_services.includes(serviceId)
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selected_services: prev.selected_services.filter(id => id !== serviceId),
        service_details: Object.fromEntries(
          Object.entries(prev.service_details).filter(([key]) => key !== serviceId.toString())
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        selected_services: [...prev.selected_services, serviceId],
        service_details: {
          ...prev.service_details,
          [serviceId]: {
            base_price: '',
            price_type: 'fixed',
            specializations: [],
            years_experience: ''
          }
        }
      }))
    }
  }

  const handleServiceDetailChange = (serviceId: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      service_details: {
        ...prev.service_details,
        [serviceId]: {
          ...prev.service_details[serviceId],
          [field]: value
        }
      }
    }))
  }

  const addPostalCode = () => {
    setFormData(prev => ({
      ...prev,
      postal_codes: [...prev.postal_codes, '']
    }))
  }

  const removePostalCode = (index: number) => {
    setFormData(prev => ({
      ...prev,
      postal_codes: prev.postal_codes.filter((_, i) => i !== index)
    }))
  }

  const updatePostalCode = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      postal_codes: prev.postal_codes.map((code, i) => i === index ? value : code)
    }))
  }

  const nextStep = () => {
    if (currentStep < REGISTRATION_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // TODO: Implement API call to register professional
    console.log('Registration data:', formData)
    alert('Registration submitted! You will receive a confirmation email shortly.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Professional Network
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with property owners and grow your business through our platform
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {REGISTRATION_STEPS.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {REGISTRATION_STEPS.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center text-center max-w-[120px]",
                step.id <= currentStep ? "text-blue-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2",
                  step.id < currentStep
                    ? "bg-blue-600 text-white"
                    : step.id === currentStep
                    ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                    : "bg-gray-200 text-gray-400"
                )}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="text-xs font-medium">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">
              {REGISTRATION_STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {REGISTRATION_STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name (Optional)</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience *</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                      placeholder="5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="license_number">License Number</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                      placeholder="License #123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Services & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Select Your Services</h3>
                  <p className="text-gray-600">Choose the services you provide and set your pricing</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROFESSIONAL_SERVICES.map((service) => {
                    const Icon = service.icon
                    const isSelected = formData.selected_services.includes(service.id)

                    return (
                      <div
                        key={service.id}
                        className={cn(
                          "border-2 rounded-lg p-4 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isSelected ? "bg-blue-100" : "bg-gray-100"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5",
                              isSelected ? "text-blue-600" : "text-gray-600"
                            )} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <p className="text-xs text-gray-600">{service.description}</p>
                          </div>
                          <Checkbox checked={isSelected} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Service Details */}
                {formData.selected_services.length > 0 && (
                  <div className="space-y-6 mt-8">
                    <h3 className="text-lg font-semibold">Service Details & Pricing</h3>
                    {formData.selected_services.map((serviceId) => {
                      const service = PROFESSIONAL_SERVICES.find(s => s.id === serviceId)
                      const details = formData.service_details[serviceId] || {}

                      return (
                        <Card key={serviceId} className="p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <service.icon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold">{service.name}</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Base Price</Label>
                              <Input
                                type="number"
                                placeholder="500"
                                value={details.base_price || ''}
                                onChange={(e) => handleServiceDetailChange(serviceId, 'base_price', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Price Type</Label>
                              <Select
                                value={details.price_type || 'fixed'}
                                onValueChange={(value) => handleServiceDetailChange(serviceId, 'price_type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {PRICE_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Years Experience</Label>
                              <Input
                                type="number"
                                placeholder="3"
                                value={details.years_experience || ''}
                                onChange={(e) => handleServiceDetailChange(serviceId, 'years_experience', e.target.value)}
                              />
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Service Areas */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Define Your Service Areas</h3>
                  <p className="text-gray-600">Add the postal codes where you provide services</p>
                </div>

                <div className="space-y-4">
                  {formData.postal_codes.map((code, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Input
                          placeholder="M5V 3A8"
                          value={code}
                          onChange={(e) => updatePostalCode(index, e.target.value.toUpperCase())}
                        />
                      </div>
                      {formData.postal_codes.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePostalCode(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addPostalCode}
                    className="w-full"
                  >
                    Add Another Postal Code
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Service Area Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Add all postal codes where you regularly provide services</li>
                    <li>• You can set travel fees for each area in your profile later</li>
                    <li>• Clients will find you when searching in these areas</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Profile & Portfolio */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-gray-600">Tell potential clients about your expertise</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about your experience, specializations, and what makes you unique..."
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={6}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile_image">Profile Photo</Label>
                    <Input
                      id="profile_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        profile_image: e.target.files?.[0] || null
                      }))}
                    />
                    <p className="text-sm text-gray-500">
                      Upload a professional headshot (recommended: 400x400px)
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Profile Tips</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Write a compelling bio that highlights your expertise</li>
                    <li>• Use a professional, high-quality profile photo</li>
                    <li>• Mention any specializations or unique services</li>
                    <li>• You can add portfolio items after registration</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 5: Verification */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Verification Documents</h3>
                  <p className="text-gray-600">Upload documents to verify your credentials</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_provider">Insurance Provider</Label>
                      <Input
                        id="insurance_provider"
                        placeholder="ABC Insurance Company"
                        value={formData.insurance_provider}
                        onChange={(e) => setFormData(prev => ({ ...prev, insurance_provider: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance_policy">Policy Number</Label>
                      <Input
                        id="insurance_policy"
                        placeholder="POL-123456789"
                        value={formData.insurance_policy}
                        onChange={(e) => setFormData(prev => ({ ...prev, insurance_policy: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_document">License/Certification Document</Label>
                    <Input
                      id="license_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        license_document: e.target.files?.[0] || null
                      }))}
                    />
                    <p className="text-sm text-gray-500">
                      Upload your professional license or certification (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Verification Process</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Documents will be reviewed within 2-3 business days</li>
                    <li>• Verified professionals get a badge on their profile</li>
                    <li>• You can start receiving leads immediately after registration</li>
                    <li>• Additional documents can be uploaded later from your dashboard</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Ready to Join?</h4>
                  <p className="text-sm text-blue-800">
                    By completing registration, you agree to our Terms of Service and Privacy Policy.
                    You'll receive an email confirmation and can start managing your profile immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep === REGISTRATION_STEPS.length ? (
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  Complete Registration
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
