# React Bottom Sheet with Spring Motion

A React application featuring a bottom sheet component with multiple screen snap points and spring motion animations. Built without external animation libraries, this component demonstrates advanced React patterns and custom animation implementations.

![React Bottom Sheet Demo](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)
---
![React Bottom Sheet Demo](./images/CloseSheet.png)
---
![React Bottom Sheet Demo](./images/HalfOpenSheet.png)
---
![React Bottom Sheet Demo](./images/FullOpenSheet.png)
## 🚀 Features

- ✅ **Three Snap Points**: Closed, half-open, and fully open positions
- ✅ **Custom Spring Animations**: Smooth spring motion without external libraries
- ✅ **Intelligent Gesture Recognition**: Velocity-based snapping for natural interactions
- ✅ **Cross-Platform Support**: Mouse and touch event handling
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Accessibility**: Keyboard navigation and ARIA support
- ✅ **Performance Optimized**: 60fps animations using requestAnimationFrame
- ✅ **TypeScript Ready**: Easy to convert to TypeScript
- ✅ **Zero Dependencies**: No external animation libraries required

## 🎯 Demo

### Interactive Elements
- **Drag Handle**: Click and drag the handle to move the sheet
- **Control Buttons**: Programmatically control sheet position
- **Gesture Support**: Natural swipe gestures with velocity detection
- **Keyboard Navigation**: Press Escape to close, Enter/Space on handle to cycle states
- **Backdrop Click**: Click outside to close the sheet

### Snap Points
1. **Closed** (85% from top): Only handle visible
2. **Half-Open** (50% from top): Partial content visible
3. **Fully Open** (10% from top): Complete content visible

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Component API](#component-api)
- [Technical Implementation](#technical-implementation)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/react-bottom-sheet.git
cd react-bottom-sheet
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🚀 Quick Start

### Basic Usage

```jsx
import React from 'react';
import BottomSheet from './components/BottomSheet';

function App() {
  return (
    <div className="App">
      <BottomSheet />
    </div>
  );
}

export default App;
```

### Custom Integration

The BottomSheet component is designed to be easily integrated into existing applications:

```jsx
// Example: Using BottomSheet in your existing app
import BottomSheet from './components/BottomSheet';

function MyApp() {
  return (
    <div>
      {/* Your existing content */}
      <main>
        <h1>My Application</h1>
        {/* Other components */}
      </main>
      
      {/* Bottom Sheet */}
      <BottomSheet />
    </div>
  );
}
```

## 📁 Project Structure

```
react-bottom-sheet/
├── public/
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # App icon
│   └── manifest.json           # PWA manifest
├── src/
│   ├── components/
│   │   └── BottomSheet.js      # Main bottom sheet component
│   ├── styles/
│   │   └── index.css           # Global styles and Tailwind imports
│   ├── App.js                  # Main application component
│   ├── App.css                 # Application styles
│   └── index.js                # React app entry point
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore rules
└── tailwind.config.js          # Tailwind CSS configuration
```

## 🔧 Component API

### Props (Future Enhancement)

The current implementation is a self-contained component, but it can be easily extended to accept props:

```jsx
// Future API design
<BottomSheet
  initialState="closed"          // 'closed' | 'half' | 'full'
  snapPoints={[10, 50, 85]}     // Custom snap points (percentages)
  springConfig={{                // Animation configuration
    tension: 280,
    friction: 30
  }}
  onStateChange={(state) => {    // State change callback
    console.log('New state:', state);
  }}
  backdrop={true}                // Show/hide backdrop
  closeOnBackdropClick={true}    // Close on backdrop click
>
  {/* Custom content */}
</BottomSheet>
```

### Current Configuration

The component currently uses these default settings:

```javascript
const snapPoints = {
  closed: 85,  // 85% from top
  half: 50,    // 50% from top  
  full: 10     // 10% from top
};

const animationDuration = 300; // milliseconds
const velocityThreshold = 0.5; // px/ms
```

## 🏗️ Technical Implementation

### Architecture Overview

The component follows modern React patterns and implements a custom animation system:

- **State Management**: React Hooks (useState, useRef, useEffect, useCallback)
- **Animation System**: Custom spring animations using requestAnimationFrame
- **Event Handling**: Unified mouse and touch event system
- **Performance**: Optimized with proper cleanup and memoization

### Key Technical Features

#### 1. Custom Spring Animation System

```javascript
// Easing function for spring-like motion
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
```

#### 2. Velocity-Based Gesture Recognition

```javascript
// Calculate velocity for natural gesture handling
const newVelocity = (clientY - lastMoveY) / timeDelta;
```

#### 3. Intelligent Snap Point Detection

```javascript
// Considers both position and velocity for snapping
const findNearestSnapPoint = (translateY, velocity) => {
  // Implementation considers drag direction and speed
};
```

### Performance Optimizations

1. **requestAnimationFrame**: Ensures 60fps animations
2. **useCallback**: Prevents unnecessary re-renders
3. **Event Cleanup**: Proper cleanup of event listeners
4. **Animation Cleanup**: Cancels animations on unmount
5. **Debounced Updates**: Optimized state updates during drag

## 🎨 Customization

### Styling

The component uses Tailwind CSS classes that can be easily customized:

```css
/* Custom handle styles */
.bottom-sheet-handle {
  @apply w-12 h-1.5 bg-gray-300 rounded-full transition-colors duration-200;
}

/* Custom button styles */
.control-button {
  @apply px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg;
}
```

### Snap Points

Modify the snap points by changing the `snapPoints` object:

```javascript
const snapPoints = {
  closed: 90,  // More closed
  half: 40,    // Higher half position
  full: 5      // More open
};
```

### Animation Settings

Customize the spring animation by modifying:

```javascript
const duration = 400;          // Slower animation
const springStrength = 2.0;    // Stronger spring effect
```

### Content Customization

Replace the demo content with your own:

```jsx
{/* Replace this section with your content */}
<div className="px-6 pb-6 h-full overflow-y-auto">
  <YourCustomContent />
</div>
```

## 🌐 Browser Support

### Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Browsers
- ✅ iOS Safari (iOS 12+)
- ✅ Chrome Mobile (Android 8+)
- ✅ Samsung Internet
- ✅ Firefox Mobile

### Feature Support
- **Touch Events**: Full support for touch gestures
- **Mouse Events**: Complete mouse interaction support
- **Keyboard Navigation**: Accessible keyboard controls
- **Responsive Design**: Adapts to all screen sizes

## ⚡ Performance

### Metrics
- **Animation FPS**: Consistent 60fps
- **Memory Usage**: Minimal memory footprint
- **CPU Usage**: Optimized for low CPU impact
- **Bundle Size**: Lightweight with no external dependencies

### Optimization Techniques
- Efficient event handling with proper cleanup
- Optimized React re-renders using useCallback
- Smart animation frame management
- Minimal DOM manipulations

### Performance Testing

```bash
# Run performance tests
npm run test

# Build for production
npm run build

# Analyze bundle size
npm run analyze
```

## 📋 Available Scripts

### Development

```bash
npm start          # Start development server
npm run dev        # Alternative development command
```

### Testing

```bash
npm test           # Run tests in watch mode
npm run test:ci    # Run tests once for CI
npm run coverage   # Generate test coverage report
```

### Building

```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

### Code Quality

```bash
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run type-check # TypeScript type checking (if applicable)
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Structure

```
src/
├── components/
│   ├── BottomSheet.js
│   └── __tests__/
│       ├── BottomSheet.test.js
│       └── BottomSheet.integration.test.js
└── utils/
    └── __tests__/
        └── animations.test.js
```

### Example Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import BottomSheet from '../BottomSheet';

test('should open bottom sheet when button is clicked', () => {
  render(<BottomSheet />);
  const openButton = screen.getByText('Half Open');
  fireEvent.click(openButton);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Animation Not Smooth
```javascript
// Ensure requestAnimationFrame is supported
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = window.setTimeout;
}
```

#### 2. Touch Events Not Working
```javascript
// Add passive: false for preventDefault
document.addEventListener('touchmove', handler, { passive: false });
```

#### 3. Styling Issues
```bash
# Ensure Tailwind CSS is properly installed
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Debug Mode

Add debug logging by modifying the component:

```javascript
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (message, data) => {
  if (DEBUG) {
    console.log(`[BottomSheet] ${message}`, data);
  }
};
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/yourusername/react-bottom-sheet.git
cd react-bottom-sheet
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes

- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
npm test
npm run lint
npm run build
```

### 5. Commit and Push

```bash
git commit -m 'Add some amazing feature'
git push origin feature/amazing-feature
```

### 6. Create Pull Request

- Provide a clear description of changes
- Include screenshots if applicable
- Link to related issues

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Maintain test coverage above 80%
- **Documentation**: Update README for new features
- **Performance**: Ensure changes don't impact performance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 React Bottom Sheet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---
### FAQ

**Q: Can I use this component in TypeScript?**
A: Yes! The component can be easily converted to TypeScript by adding type definitions.

**Q: How do I change the snap points?**
A: Modify the `snapPoints` object in the component to customize positions.

**Q: Can I disable the backdrop?**
A: Yes, you can modify the component to conditionally render the backdrop.

**Q: How do I add custom content?**
A: Replace the demo content in the sheet content area with your own components.

---

## 🚀 What's Next?

### Roadmap

- [ ] TypeScript support
- [ ] Multiple sheet support
- [ ] Custom spring configuration props
- [ ] Animation presets
- [ ] Storybook integration
- [ ] Performance monitoring
- [ ] Advanced gesture recognition

---

**Made with Intrest by the RohithB-AI-HUB**

⭐ Star this repository if you found it helpful!

[🔝 Back to Top](#react-bottom-sheet-with-spring-motion)