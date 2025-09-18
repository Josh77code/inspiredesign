import { NextRequest, NextResponse } from 'next/server'
import { contactsDB } from '@/lib/database'
import { EmailService } from '@/lib/email'

// POST /api/contact - Handle contact form submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, subject, message } = body
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to database
    const contact = contactsDB.create({
      name,
      email,
      subject,
      message,
      status: 'new'
    })

    // Send email notification to admin
    const emailSent = await EmailService.sendContactEmail({
      name,
      email,
      subject,
      message
    })

    if (!emailSent) {
      console.warn('Failed to send contact email notification')
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      data: contact
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get contact information (optional)
export async function GET() {
  try {
    const contactInfo = {
      email: 'hello@digitalart.com',
      phone: '+1 (555) 123-4567',
      address: '123 Creative Street, New York, NY 10001',
      businessHours: 'Mon - Fri: 9:00 AM - 6:00 PM EST',
      socialMedia: {
        twitter: 'https://twitter.com/digitalart',
        instagram: 'https://instagram.com/digitalart',
        linkedin: 'https://linkedin.com/company/digitalart'
      }
    }

    return NextResponse.json({
      success: true,
      data: contactInfo
    })
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact information' },
      { status: 500 }
    )
  }
}
