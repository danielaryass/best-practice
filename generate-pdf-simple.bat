@echo off
echo ========================================
echo    PDF Documentation Generator
echo ========================================
echo.

echo Opening documentation in browser...
echo You can then save as PDF using Ctrl+P
echo.

:: Open markdown preview websites
start https://markdownlivepreview.com/
start https://www.markdowntopdf.com/

echo.
echo Instructions:
echo.
echo Method 1 - markdownlivepreview.com:
echo   1. Copy content from DEVELOPER_ONBOARDING.md
echo   2. Paste into the website
echo   3. Press Ctrl+P
echo   4. Select "Save as PDF"
echo   5. Save as "DEVELOPER_ONBOARDING.pdf"
echo.
echo Method 2 - markdowntopdf.com:
echo   1. Click "Choose File"
echo   2. Select DEVELOPER_ONBOARDING.md
echo   3. Click "Convert to PDF"
echo   4. Download the PDF
echo.
echo ========================================
pause
