/**
 * Utility to generate 1:1 square images from community posts for social media sharing
 * Includes "Writers Corner" watermark styled consistently with the vintage UI theme
 */

export interface PostImageData {
  title: string
  content: string
  authorName: string
  exerciseTitle?: string
  topicTitle?: string
  date: string
}

// CSS color variables from the app
const COLORS = {
  parchment: 'hsl(43, 74%, 94%)',  // Background
  ink: 'hsl(25, 25%, 15%)',         // Primary text
  sepia: 'hsl(37, 45%, 85%)',       // Secondary background
  rust: 'hsl(16, 85%, 55%)',        // Accent
  forest: 'hsl(145, 25%, 35%)',     // Secondary text
  gold: 'hsl(45, 85%, 65%)',        // Highlight
}

/**
 * Wraps text to fit within a specified width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

/**
 * Generates a 1:1 square image (1080x1080) from post data
 * Returns a data URL of the generated image
 */
export function generatePostImage(data: PostImageData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const size = 1080 // Instagram recommended size
      const padding = 80
      const contentWidth = size - padding * 2

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Background - parchment color
      ctx.fillStyle = COLORS.parchment
      ctx.fillRect(0, 0, size, size)

      // Add subtle paper texture effect
      ctx.fillStyle = 'rgba(120, 119, 98, 0.03)'
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * size
        const y = Math.random() * size
        const radius = Math.random() * 100 + 50
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Border - vintage card style
      ctx.strokeStyle = COLORS.ink
      ctx.lineWidth = 4
      ctx.strokeRect(padding / 2, padding / 2, size - padding, size - padding)

      // Inner decorative border
      ctx.strokeStyle = COLORS.sepia
      ctx.lineWidth = 2
      ctx.strokeRect(padding / 2 + 12, padding / 2 + 12, size - padding - 24, size - padding - 24)

      let yPosition = padding + 20

      // Title
      ctx.fillStyle = COLORS.ink
      ctx.font = 'bold 48px "Courier Prime", Courier, monospace'
      ctx.textAlign = 'left'
      
      const titleLines = wrapText(ctx, data.title || 'Exercise Response', contentWidth)
      for (const line of titleLines.slice(0, 2)) {
        ctx.fillText(line, padding, yPosition + 48)
        yPosition += 56
      }
      yPosition += 20

      // Author badge
      ctx.fillStyle = COLORS.rust
      ctx.font = '600 28px "Courier Prime", Courier, monospace'
      ctx.fillText(`✦ ${data.authorName}`, padding, yPosition)
      yPosition += 40

      // Topic/Exercise info
      if (data.topicTitle || data.exerciseTitle) {
        ctx.fillStyle = COLORS.forest
        ctx.font = 'italic 24px "Crimson Text", Georgia, serif'
        const exerciseInfo = data.topicTitle 
          ? `${data.topicTitle}${data.exerciseTitle ? ` — ${data.exerciseTitle}` : ''}`
          : data.exerciseTitle
        if (exerciseInfo) {
          const infoLines = wrapText(ctx, exerciseInfo, contentWidth)
          ctx.fillText(infoLines[0], padding, yPosition)
          yPosition += 36
        }
      }

      // Divider line
      yPosition += 10
      ctx.strokeStyle = COLORS.gold
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(padding, yPosition)
      ctx.lineTo(padding + 200, yPosition)
      ctx.stroke()
      yPosition += 40

      // Content
      ctx.fillStyle = COLORS.ink
      ctx.font = '32px "Crimson Text", Georgia, serif'
      
      // Calculate available space for content (leave room for watermark)
      const maxContentY = size - 180 // Reserve space for watermark
      const lineHeight = 44
      const contentLines = wrapText(ctx, data.content, contentWidth)
      
      let linesDrawn = 0
      for (const line of contentLines) {
        if (yPosition + lineHeight > maxContentY) {
          // Add ellipsis if content is truncated
          if (linesDrawn > 0) {
            ctx.fillText('...', padding, yPosition)
          }
          break
        }
        ctx.fillText(line, padding, yPosition + 32)
        yPosition += lineHeight
        linesDrawn++
      }

      // Date (bottom left area)
      ctx.fillStyle = COLORS.forest
      ctx.font = '22px "Crimson Text", Georgia, serif'
      ctx.fillText(data.date, padding, size - 100)

      // Watermark - "Writers Corner" with vintage styling
      const watermarkY = size - padding / 2 - 20
      
      // Decorative line above watermark
      ctx.strokeStyle = COLORS.ink
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(size - 380, watermarkY - 30)
      ctx.lineTo(size - padding, watermarkY - 30)
      ctx.stroke()

      // Writers Corner text
      ctx.fillStyle = COLORS.ink
      ctx.font = 'bold 32px "Courier Prime", Courier, monospace'
      ctx.textAlign = 'right'
      ctx.fillText('Writers Corner', size - padding, watermarkY)

      // Small decorative quill/pen icon using text
      ctx.font = '24px serif'
      ctx.fillText('✎', size - 355, watermarkY)

      // Small tagline
      ctx.fillStyle = COLORS.forest
      ctx.font = 'italic 18px "Crimson Text", Georgia, serif'
      ctx.fillText('Share your story', size - padding, watermarkY + 24)

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      resolve(dataUrl)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Downloads the generated image
 */
export async function downloadPostAsImage(
  data: PostImageData,
  filename?: string
): Promise<void> {
  try {
    const dataUrl = await generatePostImage(data)
    
    const link = document.createElement('a')
    link.download = filename || `writers-corner-${Date.now()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading post image:', error)
    throw error
  }
}
