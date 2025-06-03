# Chat Overlay for OBS

This component provides a transparent chat overlay that can be integrated with OBS Studio or other streaming software. It allows streamers to display chat messages from multiple platforms on their stream with a clean, customizable interface.

## Features

- Transparent background for seamless integration with your stream
- Read-only mode (no input field) designed specifically for OBS Browser Source
- Automatically connects to the chat server as a guest
- Messages fade out gradually after a configurable time
- Shows platform icons and labels for different chat sources (Twitch, Kick, etc.)
- Color-coded messages based on the platform

## Two Integration Options

### Option 1: Using the Next.js App Route (Recommended)

This method uses your Next.js app to serve the overlay. This approach supports all your app's styling and is easier to maintain when you update your chat UI.

URL format:
```
https://yourdomain.com/overlay?username=YOUR_STREAMER_NAME
```

### Option 2: Using the Standalone HTML File

For simpler deployment without requiring your Next.js server to be running, you can use the standalone HTML file located at `public/obs-overlay.html`. This file includes a simplified version of the chat overlay that works independently.

URL format:
```
https://yourdomain.com/obs-overlay.html?username=YOUR_STREAMER_NAME
```

## Usage with OBS Studio

1. In OBS Studio:
   - Add a new "Browser Source"
   - Set the URL to your chosen overlay method with your streamer name as the username parameter
   - Set Width and Height appropriate for your stream layout (e.g., 400x600)
   - Enable "Shutdown source when not visible" for better performance
   - Click "OK" to add the source

2. Position the browser source as desired in your scene

## Configuration Options

Both overlay methods accept the following URL parameters:

- `username` (required): Your streamer username
- `max` (optional, default: 20): Maximum number of messages to display
- `fade` (optional, default: 60): Seconds before messages start to fade
- `duration` (optional, default: 300): Seconds before messages disappear completely

## Example URLs

Next.js App Route:
```
https://yourdomain.com/overlay?username=myStreamName&max=15&fade=30&duration=120
```

Standalone HTML:
```
https://yourdomain.com/obs-overlay.html?username=myStreamName&max=15&fade=30&duration=120
```

## Advanced Customization

### For the Next.js App Route:

1. Edit the `ChatOverlay.tsx` component to adjust styles
2. Modify the `ChatMessage.tsx` component to change how individual messages appear

### For the Standalone HTML:

1. Edit the CSS styles in the `obs-overlay.html` file
2. Modify the JavaScript code in the same file to customize behavior

## Troubleshooting

- If no messages appear, verify that:
  - Your streamer name is correct
  - Your chat server is running (`wss://chat.avie.live/chat/` is configured correctly) 
  - There is recent chat activity
  
- For transparency issues in OBS:
  - Ensure "Custom CSS" is not overriding the transparent background
  - Check that "Refresh browser when scene becomes active" is enabled

- If messages don't fade properly:
  - Try increasing the `fade` and `duration` parameters
  - Check your OBS browser source settings for any CSS that might interfere with opacity transitions 