@echo off
set PATH=%PATH%;C:\Program Files\nodejs
cd /d f:\funding\policytrace-india
echo Installing 2026 modern libraries...
npm install framer-motion @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs class-variance-authority clsx tailwind-merge lucide-react
echo.
echo Installation complete!
echo.
echo Modern stack installed:
echo - Framer Motion (animations)
echo - Radix UI (accessible components)
echo - shadcn utilities (cn helper)
echo - Lucide React (icons)
echo.
pause
