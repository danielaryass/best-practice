/**
 * Generate PDF documentation from markdown files
 *
 * Usage: node scripts/generate-docs-pdf.js
 */

const fs = require('fs');
const path = require('path');

// Check if md-to-pdf is available
try {
  const { mdToPdf } = require('md-to-pdf');

  const files = [
    {
      input: 'DEVELOPER_ONBOARDING.md',
      output: 'docs/DEVELOPER_ONBOARDING.pdf',
      title: 'Developer Onboarding Guide'
    },
    {
      input: 'RBAC.md',
      output: 'docs/RBAC_GUIDE.pdf',
      title: 'RBAC Guide'
    },
    {
      input: 'FOLDER_STRUCTURE.md',
      output: 'docs/FOLDER_STRUCTURE.pdf',
      title: 'Folder Structure Guide'
    }
  ];

  // Create docs directory if it doesn't exist
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  async function generatePDFs() {
    console.log('🔄 Generating PDF documentation...\n');

    for (const file of files) {
      try {
        const inputPath = path.join(__dirname, '..', file.input);
        const outputPath = path.join(__dirname, '..', file.output);

        console.log(`📄 Converting ${file.input}...`);

        const pdf = await mdToPdf(
          { path: inputPath },
          {
            dest: outputPath,
            pdf_options: {
              format: 'A4',
              margin: {
                top: '20mm',
                bottom: '20mm',
                left: '20mm',
                right: '20mm'
              },
              displayHeaderFooter: true,
              headerTemplate: '<div></div>',
              footerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%;">
                  <span class="pageNumber"></span> / <span class="totalPages"></span>
                </div>
              `
            }
          }
        );

        if (pdf) {
          console.log(`✅ ${file.title} generated: ${file.output}\n`);
        }
      } catch (error) {
        console.error(`❌ Error generating ${file.title}:`, error.message);
      }
    }

    console.log('✨ PDF generation complete!\n');
    console.log('📁 PDFs saved in: docs/\n');
  }

  generatePDFs().catch(console.error);

} catch (error) {
  console.error('\n❌ md-to-pdf package not found.');
  console.log('\n📦 Please install it first:');
  console.log('   npm install -D md-to-pdf\n');
  console.log('💡 Alternatively, see HOW_TO_GENERATE_PDF.md for other methods.\n');
  process.exit(1);
}
