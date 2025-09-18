"use client"

import type React from "react"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowButton } from "./glow-button"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" })
        // Show success message
        alert(result.message || "Thank you for your message! We'll get back to you soon.")
      } else {
        alert(result.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card id="contact-form" className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">Send us a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-card-foreground">
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background text-foreground border-border focus:border-primary"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background text-foreground border-border focus:border-primary"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-card-foreground">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="bg-background text-foreground border-border focus:border-primary"
              placeholder="What's this about?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-card-foreground">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="bg-background text-foreground border-border focus:border-primary resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          <GlowButton type="submit" disabled={isSubmitting} className="w-full text-lg py-3">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </GlowButton>
        </form>
      </CardContent>
    </Card>
  )
}
