# How to Generate PDF Documentation

You have a comprehensive markdown documentation file (`DEVELOPER_ONBOARDING.md`) that you can convert to PDF using several methods.

## Method 1: Using VS Code Extension (Recommended)

1. **Install Extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Markdown PDF" by yzane
   - Click Install

2. **Generate PDF:**
   - Open `DEVELOPER_ONBOARDING.md`
   - Right-click in the editor
   - Select "Markdown PDF: Export (pdf)"
   - PDF will be generated in the same folder

## Method 2: Using Online Tools

### Option A: Markdown to PDF (Free, No Account)

1. Visit: https://www.markdowntopdf.com/
2. Upload `DEVELOPER_ONBOARDING.md`
3. Click "Convert to PDF"
4. Download the generated PDF

### Option B: CloudConvert (Free, Better Formatting)

1. Visit: https://cloudconvert.com/md-to-pdf
2. Upload `DEVELOPER_ONBOARDING.md`
3. Click "Convert"
4. Download the PDF

### Option C: Dillinger (Online Editor)

1. Visit: https://dillinger.io/
2. Import `DEVELOPER_ONBOARDING.md`
3. Click "Export as" → "PDF"

## Method 3: Using Pandoc (Command Line)

1. **Install Pandoc:**
   - Windows: Download from https://pandoc.org/installing.html
   - Mac: `brew install pandoc`
   - Linux: `sudo apt-get install pandoc`

2. **Install LaTeX (for PDF generation):**
   - Windows: Install MiKTeX from https://miktex.org/
   - Mac: `brew install --cask mactex`
   - Linux: `sudo apt-get install texlive-latex-base`

3. **Generate PDF:**
   ```bash
   pandoc DEVELOPER_ONBOARDING.md -o DEVELOPER_ONBOARDING.pdf --pdf-engine=xelatex -V geometry:margin=1in
   ```

## Method 4: Using Chrome/Edge Browser

1. **Open in Browser:**
   - Install VS Code extension "Markdown Preview Enhanced"
   - Or paste markdown content into https://markdownlivepreview.com/

2. **Print to PDF:**
   - Press Ctrl+P (or Cmd+P on Mac)
   - Select "Save as PDF" as printer
   - Adjust settings (margins, orientation)
   - Click "Save"

## Method 5: Using Node.js Script

Create a file `generate-pdf.js`:

```javascript
const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');

(async () => {
  const pdf = await mdToPdf(
    { path: 'DEVELOPER_ONBOARDING.md' },
    {
      dest: 'DEVELOPER_ONBOARDING.pdf',
      pdf_options: {
        format: 'A4',
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        }
      }
    }
  );

  if (pdf) {
    console.log('PDF generated successfully!');
  }
})();
```

Then run:
```bash
npm install md-to-pdf
node generate-pdf.js
```

## Method 6: Using GitHub (If you have a repo)

1. Push markdown file to GitHub
2. GitHub automatically renders markdown
3. Use browser's "Print to PDF" on the rendered page

## Recommended Method

For best results, use **Method 1 (VS Code Extension)** or **Method 3 (Pandoc)** as they:
- Preserve formatting
- Handle code blocks well
- Support table of contents
- Professional output

## Custom Styling (Optional)

If using Pandoc, you can add custom CSS:

1. Create `style.css`:
```css
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

h1 {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 0.3em;
}

code {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
}

pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}
```

2. Generate with style:
```bash
pandoc DEVELOPER_ONBOARDING.md -o DEVELOPER_ONBOARDING.pdf --css=style.css --pdf-engine=xelatex
```

## Troubleshooting

**Issue: Tables not rendering properly**
- Use Pandoc with `--pdf-engine=xelatex`
- Or use online tools like CloudConvert

**Issue: Code blocks cut off**
- Adjust page margins
- Use landscape orientation for wide code

**Issue: Images missing**
- Ensure image paths are correct
- Use absolute paths if needed

**Issue: Syntax highlighting missing**
- Use Pandoc with `--highlight-style=tango`
- Or use VS Code extension

## Quick Command (Recommended)

If you have Pandoc installed:

```bash
pandoc DEVELOPER_ONBOARDING.md -o DEVELOPER_ONBOARDING.pdf --pdf-engine=xelatex -V geometry:margin=1in --toc --highlight-style=tango
```

This command:
- Converts to PDF
- Adds 1-inch margins
- Includes table of contents
- Adds syntax highlighting

---

Choose the method that works best for your setup!
