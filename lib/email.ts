// Simple email service simulation
// In production, you would integrate with services like SendGrid, Mailgun, or AWS SES

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  items: any[]
  totalAmount: number
}

export class EmailService {
  // Simulate sending email (in production, replace with actual email service)
  private static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Log email to console for development
      console.log('📧 Email sent:', {
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString()
      })
      
      // In production, you would use a real email service here:
      // await sendGrid.send(options)
      // await mailgun.send(options)
      // await ses.sendEmail(options)
      
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  // Send contact form email
  static async sendContactEmail(data: ContactEmailData): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This email was sent from the Inspire Design contact form.
        </p>
      </div>
    `

    const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

This email was sent from the Inspire Design contact form.
    `

    return await this.sendEmail({
      to: 'Inspire-designs@outlook.com', // Replace with your admin email
      subject: `Contact Form: ${data.subject}`,
      html,
      text
    })
  }

  // Send order confirmation email
  static async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.title}</strong><br>
          <small>by ${item.artist}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation - DigitalArt Marketplace</h2>
        <p>Dear ${data.customerName},</p>
        <p>Thank you for your purchase! Your order has been confirmed.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">
                Total Amount:
              </td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">
                $${data.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #2d5a2d;">Download Instructions</h4>
          <p>Your digital assets are ready for download! You can access them by:</p>
          <ol>
            <li>Logging into your account</li>
            <li>Going to "My Orders" section</li>
            <li>Clicking the download button for each item</li>
          </ol>
        </div>

        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The DigitalArt Marketplace Team</p>
      </div>
    `

    const text = `
Order Confirmation - DigitalArt Marketplace

Dear ${data.customerName},

Thank you for your purchase! Your order has been confirmed.

Order Details:
- Order ID: ${data.orderId}
- Order Date: ${new Date().toLocaleDateString()}

Items:
${data.items.map(item => `- ${item.title} by ${item.artist} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total Amount: $${data.totalAmount.toFixed(2)}

Download Instructions:
Your digital assets are ready for download! You can access them by:
1. Logging into your account
2. Going to "My Orders" section
3. Clicking the download button for each item

If you have any questions, please don't hesitate to contact us.

Best regards,
The DigitalArt Marketplace Team
    `

    return await this.sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderId}`,
      html,
      text
    })
  }

  // Send order status update email
  static async sendOrderStatusUpdate(
    customerEmail: string,
    orderId: string,
    status: string
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Your order status has been updated.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">${status.toUpperCase()}</span></p>
          <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p>You can track your order status in your account dashboard.</p>
        <p>Best regards,<br>The DigitalArt Marketplace Team</p>
      </div>
    `

    return await this.sendEmail({
      to: customerEmail,
      subject: `Order Status Update - ${orderId}`,
      html
    })
  }
}

// Export for use in API routes
export default EmailService
