# 3D Avatar Controller

A real-time 3D avatar controller with facial tracking and gender selection functionality built with React, Three.js, and MediaPipe.

## 🌟 Features

- **Real-time Face Tracking**: Uses MediaPipe for real-time facial expression and head movement tracking
- **Gender Selection**: Choose between Male and Female avatars with different 3D models
- **Dynamic Avatar**: High-quality 3D avatars from Ready Player Me with ARKit morphTargets
- **Interactive Controls**: Drag to reposition avatar, toggle tracking, adjust lighting
- **Webcam Integration**: Live webcam feed for face tracking
- **Responsive Design**: Modern, minimalistic UI with mechanical 3D effects
- **Real-time Telemetry**: Live display of tracking data and performance metrics

## 🚀 Live Demo

Visit the live application: [https://shahnab.github.io/3Davatarcontroller/](https://shahnab.github.io/3Davatarcontroller/)

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper components for React Three Fiber
- **MediaPipe** - Face tracking and detection
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **Ready Player Me** - 3D avatar models

## 🏃‍♂️ Running Locally

### Prerequisites

- Node.js (18 or higher)
- npm or yarn
- A webcam for face tracking functionality

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shahnab/3Davatarcontroller.git
cd 3Davatarcontroller
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

5. Allow webcam permissions when prompted for face tracking to work

## 🎮 Usage

1. **Webcam Setup**: Allow browser access to your webcam when prompted
2. **Gender Selection**: Use the gender selector buttons on the left to choose between Male/Female avatars
3. **Face Tracking**: Move your head and make facial expressions to see the avatar respond in real-time
4. **Avatar Interaction**: Click and drag the avatar to reposition it in 3D space
5. **Controls**: Use the right panel to:
   - Toggle face tracking on/off
   - Toggle avatar animation playback
   - Adjust lighting settings (position, color, intensity)
6. **Telemetry**: Monitor real-time tracking data in the telemetry panel

## 🎨 Avatar Models

- **Male Avatar**: Professional male character with business attire
- **Female Avatar**: Professional female character with business attire
- Both models support full ARKit facial expressions and head movements

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Webcam access and WebGL support are required for full functionality.

## 🔧 Build and Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

The project is configured to automatically deploy to GitHub Pages when pushing to the main branch via GitHub Actions.

## 🌐 GitHub Pages Configuration

The project is configured for GitHub Pages deployment with:
- Base URL set to `/3Davatarcontroller/`
- Static assets properly configured in the `public` folder
- Automatic deployment via GitHub Actions
- Manual deployment option via `npm run deploy`

## 📄 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Avatar.tsx      # 3D avatar component
│   │   ├── Controls.tsx    # Control panel
│   │   ├── GenderSelector.tsx # Gender selection UI
│   │   ├── Telemetry.tsx   # Data display
│   │   ├── ThreeScene.tsx  # 3D scene setup
│   │   └── WebcamView.tsx  # Webcam integration
│   ├── hooks/              # Custom React hooks
│   │   └── useFaceTracking.ts
│   ├── services/           # External service integrations
│   │   └── geminiService.ts
│   ├── types.ts           # TypeScript type definitions
│   └── App.tsx            # Main application component
├── public/
│   └── image/             # Avatar preview images
├── .github/
│   └── workflows/         # GitHub Actions
└── dist/                  # Built application (generated)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Ready Player Me](https://readyplayer.me/) for 3D avatar models
- [MediaPipe](https://mediapipe.dev/) for face tracking technology
- [Three.js](https://threejs.org/) for 3D graphics
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration

## 📧 Contact

Project Link: [https://github.com/Shahnab/3Davatarcontroller](https://github.com/Shahnab/3Davatarcontroller)

---

Made with ❤️ by [Shahnab](https://github.com/Shahnab)