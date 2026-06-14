import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MarkdownContent from './src/components/common/MarkdownContent.jsx'

const testPayloads = [
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  "[click me](javascript:alert(1))",
  "![x](javascript:alert(1))"
]

const content = testPayloads.join('\n\n')

const html = renderToStaticMarkup(React.createElement(MarkdownContent, { content }))

console.log("--- XSS TEST RESULTS ---")
console.log(html)
if (html.includes('<script>') || html.includes('javascript:') || html.includes('onerror=')) {
  console.log("FAILED: XSS vulnerability found!")
  process.exit(1)
} else {
  console.log("PASSED: No XSS vulnerabilities found.")
}
