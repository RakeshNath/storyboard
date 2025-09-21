# StoryBoard - Professional Storyboard Writing Portal

A comprehensive web portal for storyboard writing with professional tools, themes, and screenplay management capabilities.

## 🎬 Overview

StoryBoard is a modern, full-featured web application designed for professional storyboard writing and screenplay management. It provides an intuitive interface with customizable themes, character management, scene organization, and real-time collaboration features.

## ✨ Features

### 🎨 Theme System
- **6 Professional Themes**: Minimalist, Professional, Classic, Film Noir, Indie Spirit, Cyberpunk
- **Dynamic Theme Switching**: Real-time theme changes with persistent user preferences
- **Theme-Specific Logos**: Custom logos that adapt to each theme
- **Responsive Design**: Themes work seamlessly across all screen sizes

### 📝 Screenplay Management
- **Scene Organization**: Create, edit, and manage multiple scenes
- **Character Management**: Add, edit, and track character usage across scenes
- **Dialogue System**: Advanced dialogue management with character autocomplete
- **Action Blocks**: Structured action and description management
- **Real-time Counters**: Track character usage in dialogue and scenes

### 🎭 Character System
- **Character Database**: Comprehensive character management with descriptions
- **Usage Tracking**: Real-time counters showing dialogue lines and scene appearances
- **Smart Deletion**: Characters can only be deleted when not in use
- **Autocomplete Integration**: Seamless character selection in dialogue

### 📊 Analytics & Tracking
- **Scene Counters**: Track scene and subscene counts for each storyboard
- **Character Usage**: Monitor character appearances across the screenplay
- **Theme Persistence**: User preferences saved across sessions

### 🛠️ Developer Features
- **Modern Tech Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Component Library**: Radix UI components with custom styling
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Performance Optimized**: Fast loading and smooth interactions

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **pnpm** 8.0+)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd storyboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Login Credentials
- **Email**: `testmail@testmail.com`
- **Password**: `testmail123`

## 🛠️ Available Scripts

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Quick Setup Scripts
```bash
# Setup and start (macOS/Linux)
./start.sh

# Setup and start (Windows)
start.bat

# Alternative quick start
npm run quickstart
```

## 📁 Project Structure

```
storyboard/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Authentication page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── sections/         # Page sections
│   │   ├── home-content.tsx
│   │   ├── profile-content.tsx
│   │   ├── storyboards-content.tsx
│   │   ├── themes-content.tsx
│   │   ├── screenplay-editor.tsx
│   │   └── playground-content.tsx
│   ├── ui/              # UI components (Radix UI)
│   └── dashboard-layout.tsx
├── lib/                 # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── storyboard.ts    # Storyboard data management
│   ├── theme.ts         # Theme utilities
│   └── utils.ts         # General utilities
├── hooks/               # Custom React hooks
├── public/              # Static assets
│   ├── images/          # Application images
│   └── logos/           # Theme-specific logos
└── styles/              # Additional stylesheets
```

## 🎨 Theme System

### Available Themes

1. **Minimalist** - Clean, simple design with neutral colors
2. **Professional** - Business-focused theme with blue accents
3. **Classic** - Traditional design with warm tones
4. **Film Noir** - Dark, dramatic theme for cinematic projects
5. **Indie Spirit** - Creative theme with artistic flair
6. **Cyberpunk** - Futuristic theme with neon accents

### Theme Features
- **Dynamic CSS Variables**: Themes use CSS custom properties for easy customization
- **Persistent Preferences**: User theme choices are saved and restored
- **Logo Integration**: Each theme has a custom logo that adapts to the color scheme
- **Component Styling**: All UI components automatically adapt to the selected theme

## 📝 Screenplay Editor

### Scene Management
- **Scene List**: Left sidebar with all scenes
- **Scene Editor**: Main editing area for scene content
- **Character Integration**: Right panel for character management

### Character Features
- **Character Database**: Comprehensive character management
- **Usage Tracking**: Real-time counters for dialogue and scene appearances
- **Smart Autocomplete**: Character selection in dialogue fields
- **Protected Deletion**: Characters can only be deleted when not in use

### Dialogue System
- **Character Autocomplete**: Type to search and select characters
- **Drag & Drop**: Reorder dialogue and action blocks
- **Real-time Updates**: Changes reflect immediately in character counters

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:

```env
# Optional: Custom configuration
NEXT_PUBLIC_APP_NAME=StoryBoard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Tailwind Configuration
The project uses Tailwind CSS with custom configuration in `tailwind.config.js`. All theme colors are defined as CSS custom properties.

### TypeScript Configuration
TypeScript is configured with strict mode enabled. All components are fully typed for better development experience.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- **TypeScript**: All code must be properly typed
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting is handled automatically
- **Component Structure**: Use functional components with hooks

## 📚 Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🔒 Security

### Authentication
- **Client-side Authentication**: Simple localStorage-based auth for demo purposes
- **Session Management**: User sessions persist across browser sessions
- **Theme Persistence**: User preferences are securely stored

### Data Storage
- **Local Storage**: All data is stored locally in the browser
- **No External Dependencies**: No third-party data storage services
- **Privacy First**: User data never leaves their device

## 🐛 Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Theme Not Applying
- Clear browser cache and reload
- Check browser console for errors
- Ensure CSS custom properties are supported

#### Character Counters Not Updating
- Refresh the page to reset state
- Check that dialogue items are properly saved
- Verify character names match exactly

### Performance Issues
- Use browser dev tools to profile performance
- Check for memory leaks in component state
- Optimize large lists with virtualization if needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Next.js Team** for the amazing React framework

## 📞 Support

For support, feature requests, or bug reports:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review the documentation for common problems

---

**Happy Storyboarding! 🎬✨**