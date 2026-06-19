const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const searchKeywords = [
  'image_url',
  'cover_url',
  'cover_thumb_url',
  'cover_card_url',
  'cover_detail_url',
  'avatar_url',
  'banner_url',
  'thumbnail_url',
  'getPublicUrl',
  'supabase.storage',
  'upload',
  'transform',
  '<img',
  '<picture',
  'backgroundImage',
  'background-image'
];

const srcDir = path.join(__dirname, '../src');
const auditDir = path.join(__dirname, '../docs/audits');

if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

let report = `# Media Audit Report

## 1. Image Keywords Usage in Codebase

`;

const filesWithImages = new Set();
const filesUploading = new Set();
const dbFields = new Set();
const potentialIssues = [];

const searchCmd = (keyword) => {
  try {
    const result = execSync(`findstr /S /I /M /C:"${keyword}" "${srcDir}\\*.jsx" "${srcDir}\\*.js"`, { encoding: 'utf-8' });
    return result.split('\n').filter(Boolean).map(p => p.trim());
  } catch (e) {
    return [];
  }
};

const keywordMap = {};

searchKeywords.forEach(keyword => {
  const files = searchCmd(keyword);
  keywordMap[keyword] = files;
  
  if (['<img', 'backgroundImage', 'background-image'].includes(keyword)) {
    files.forEach(f => filesWithImages.add(f));
  }
  if (['upload', 'supabase.storage'].includes(keyword)) {
    files.forEach(f => filesUploading.add(f));
  }
  if (['image_url', 'cover_url', 'avatar_url', 'banner_url', 'thumbnail_url'].includes(keyword)) {
    dbFields.add(keyword);
  }
  
  report += `### Keyword: \`${keyword}\`\n`;
  if (files.length > 0) {
    files.forEach(f => {
      const relPath = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');
      report += `- ${relPath}\n`;
    });
  } else {
    report += `*No matches found*\n`;
  }
  report += '\n';
});

report += `## 2. Summary of Findings

### Files Displaying Images (Potential components needing OptimizedImage)
${Array.from(filesWithImages).map(f => '- ' + path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/')).join('\n')}

### Files Uploading Images
${Array.from(filesUploading).map(f => '- ' + path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/')).join('\n')}

### DB Fields Used
${Array.from(dbFields).map(f => '- ' + f).join('\n')}

### Observations & Potential Issues
- **Large original images**: Used in PostDetail, feed, etc. wherever \`image_url\` or \`cover_url\` is used directly in \`<img>\` without variants.
- **Blank/blue empty images**: Caused by missing \`src\` handling, no fallback or loading skeleton, which is common in current \`<img>\` tags.
- **Overfetching**: Likely in feed queries where \`content\` or large text fields might be fetched alongside \`image_url\`.

`;

fs.writeFileSync(path.join(auditDir, 'media-audit.md'), report);
console.log('Audit generated at docs/audits/media-audit.md');
