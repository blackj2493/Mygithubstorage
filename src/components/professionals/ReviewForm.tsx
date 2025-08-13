'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Star, Send, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  professionalId: number
  professionalName: string
  services: Array<{ id: number; name: string }>
  onSubmit?: (reviewData: any) => void
  onCancel?: () => void
}

export default function ReviewForm({ 
  professionalId, 
  professionalName, 
  services, 
  onSubmit, 
  onCancel 
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    review_text: '',
    service_type: '',
    project_value: '',
    would_recommend: true,
    reviewer_name: '',
    reviewer_email: '',
    reviewer_phone: ''
  })
  
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Please provide a title for your review'
    }
    if (!formData.review_text.trim()) {
      newErrors.review_text = 'Please write your review'
    }
    if (formData.review_text.length < 20) {
      newErrors.review_text = 'Review must be at least 20 characters long'
    }
    if (!formData.service_type) {
      newErrors.service_type = 'Please select the service you received'
    }
    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Please provide your name'
    }
    if (!formData.reviewer_email.trim()) {
      newErrors.reviewer_email = 'Please provide your email'
    }
    if (formData.reviewer_email && !/\S+@\S+\.\S+/.test(formData.reviewer_email)) {
      newErrors.reviewer_email = 'Please provide a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const reviewData = {
        professional_id: professionalId,
        ...formData,
        project_value: formData.project_value ? parseFloat(formData.project_value) : null
      }
      
      // TODO: Replace with actual API call
      console.log('Submitting review:', reviewData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSubmit) {
        onSubmit(reviewData)
      }
      
      // Reset form
      setFormData({
        rating: 0,
        title: '',
        review_text: '',
        service_type: '',
        project_value: '',
        would_recommend: true,
        reviewer_name: '',
        reviewer_email: '',
        reviewer_phone: ''
      })
      
      alert('Review submitted successfully! It will be published after verification.')
      
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isActive = starValue <= (hoveredRating || formData.rating)
      
      return (
        <button
          key={i}
          type="button"
          className={cn(
            "p-1 transition-colors duration-150",
            isActive ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
          )}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setFormData(prev => ({ ...prev, rating: starValue }))}
        >
          <Star className={cn("h-8 w-8", isActive && "fill-current")} />
        </button>
      )
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <span>Write a Review for {professionalName}</span>
        </CardTitle>
        <CardDescription>
          Share your experience to help other property owners make informed decisions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Overall Rating *</Label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="ml-3 text-sm text-gray-600">
                {formData.rating > 0 && (
                  <>
                    {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                    {formData.rating === 5 && ' - Excellent!'}
                    {formData.rating === 4 && ' - Very Good'}
                    {formData.rating === 3 && ' - Good'}
                    {formData.rating === 2 && ' - Fair'}
                    {formData.rating === 1 && ' - Poor'}
                  </>
                )}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.rating}</span>
              </p>
            )}
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service_type">Service Received *</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the service you received" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_type && (
              <p className="text-sm text-red-600">{errors.service_type}</p>
            )}
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              placeholder="Summarize your experience in a few words"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              maxLength={100}
            />
            <div className="flex justify-between text-sm text-gray-500">
              {errors.title && <span className="text-red-600">{errors.title}</span>}
              <span className="ml-auto">{formData.title.length}/100</span>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review_text">Your Review *</Label>
            <Textarea
              id="review_text"
              placeholder="Tell others about your experience. What did you like? How was the communication? Would you hire them again?"
              value={formData.review_text}
              onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
              rows={6}
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-gray-500">
              {errors.review_text && <span className="text-red-600">{errors.review_text}</span>}
              <span className="ml-auto">{formData.review_text.length}/1000</span>
            </div>
          </div>

          {/* Project Value */}
          <div className="space-y-2">
            <Label htmlFor="project_value">Project Value (Optional)</Label>
            <Input
              id="project_value"
              type="number"
              placeholder="1500"
              value={formData.project_value}
              onChange={(e) => setFormData(prev => ({ ...prev, project_value: e.target.value }))}
            />
            <p className="text-sm text-gray-500">
              Help others understand the scope of your project
            </p>
          </div>

          {/* Would Recommend */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="would_recommend"
              checked={formData.would_recommend}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, would_recommend: checked as boolean }))
              }
            />
            <Label htmlFor="would_recommend" className="text-sm">
              I would recommend this professional to others
            </Label>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewer_name">Your Name *</Label>
                <Input
                  id="reviewer_name"
                  placeholder="John Smith"
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewer_name: e.target.value }))}
                />
                {errors.reviewer_name && (
                  <p className="text-sm text-red-600">{errors.reviewer_name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviewer_email">Your Email *</Label>
                <Input
                  id="reviewer_email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.reviewer_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewer_email: e.target.value }))}
                />
                {errors.reviewer_email && (
                  <p className="text-sm text-red-600">{errors.reviewer_email}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="reviewer_phone">Your Phone (Optional)</Label>
              <Input
                id="reviewer_phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.reviewer_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewer_phone: e.target.value }))}
              />
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              Your contact information will not be displayed publicly and will only be used for verification purposes.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
