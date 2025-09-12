@echo off
echo === Starting WebRTC Livestream Test ===
echo.
echo 1. Starting signaling server (enhanced version with better logging)
echo.
start cmd /k "node signaling-server-enhanced.js"
echo.
echo 2. The Next.js app should already be running on port 3000
echo.
echo 3. Testing instructions:
echo   a. Open http://localhost:3000/preview in one browser window
echo   b. Click "Start Streaming" button
echo   c. Copy the stream link
echo   d. Open the stream link in another browser window/tab
echo   e. Check the signaling server console for connection logs
echo.
echo 4. Debugging tips:
echo   - Look for console logs in both browser windows (F12 to open DevTools)
echo   - Watch the signaling server terminal for connection details
echo   - Verify that both broadcaster and viewer are connecting properly
echo.
echo Press any key to exit this window...
pause > nul