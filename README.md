# 🏢 Facility Finder

A modern, high-performance React Native application built with Expo for discovering and exploring facilities with their amenities. Features a sleek UI with dark mode support, real-time search, and efficient data management using SQLite.

---

## ✨ Features

- **🔍 Smart Search** - Real-time search with debouncing for facilities by name or amenities
- **📱 Cross-Platform** - Runs seamlessly on iOS, Android, and Web
- **🎨 Modern UI** - Beautiful, intuitive interface with smooth animations
- **🌙 Dark Mode** - Automatic theme switching based on system preferences
- **⚡ High Performance** - Optimized with FlashList and pagination for smooth scrolling
- **💾 Offline-First** - SQLite database for reliable local data storage
- **♿ Accessible** - Built with accessibility best practices
- **🔄 Pull to Refresh** - Easy data refresh with pull-down gesture
- **📄 Infinite Scroll** - Seamless pagination for large datasets

---

## 🛠 Tech Stack

### Core
- **React Native** 0.81.4 with **React** 19.1.0
- **Expo** ~54.0 (with new architecture enabled)
- **TypeScript** ~5.9.2 (strict mode)
- **Expo Router** ~6.0 for file-based routing

### Key Libraries
- **@shopify/flash-list** - High-performance list rendering
- **expo-sqlite** - Local database management

### Development
- **ESLint** with Expo config
- Typed routes enabled
- React Compiler experiments enabled

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **iOS Simulator** (macOS only) or **Android Studio** for mobile development
- **Expo Go** app (for quick testing on physical devices)

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd facility-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical device

---

## 📂 Project Structure

```
facility-finder/
├── app/                          # File-based routing (Expo Router)
│   ├── _layout.tsx              # Root layout with navigation
│   ├── index.tsx                # Home screen (facility list)
│   └── [id].tsx                 # Dynamic route for facility details
│
├── assets/                       # Static assets
│   ├── facilities.json          # Initial facility data
│   └── images/                  # App icons and images
│
├── components/                   # Reusable components
│   ├── themed-text.tsx          # Themed text component
│   ├── themed-view.tsx          # Themed view component
│   └── ui/                      # Additional UI components
│
├── constants/                    # App constants
│   └── theme.ts                 # Color themes and styling constants
│
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Theme detection hook
│   ├── use-database.tsx         # SQLite database hook
│   ├── use-debounce.ts          # Debounce utility hook
│   ├── use-facilities.ts        # Facilities data management
│   ├── use-facilities.types.ts  # Type definitions
│   └── use-theme-color.ts       # Theme color utilities
│
├── services/                     # Business logic and data layer
│   ├── database/                # Database operations
│   │   ├── config.ts            # DB configuration
│   │   ├── index.ts             # Main DB exports
│   │   ├── queries.ts           # SQL queries
│   │   └── seed.ts              # Database seeding
│   └── models/                  # Data models
│       └── facility.types.ts    # Facility type definitions
│
└── scripts/                      # Utility scripts
    └── reset-project.js         # Project reset script
```

---

## 🎯 Key Features Explained

### 1. **Smart Search with Debouncing**
The search functionality uses a custom debounce hook to optimize performance:
- 300ms delay before triggering search
- Searches both facility names and amenities
- Real-time results with loading states

### 2. **Efficient Pagination**
- Page size: 20 items
- Automatic loading when scrolling near the end
- Smart state management to prevent duplicate requests

### 3. **SQLite Database**
- Local-first architecture for instant access
- Efficient queries with proper indexing
- Full-text search capabilities
- Easy data seeding from JSON

### 4. **State Management**
- Reducer pattern for complex state logic
- Optimized re-renders with `React.memo` and `useCallback`

### 5. **Theme Support**
- Automatic detection of system theme
- Smooth transitions between light/dark modes
- Consistent color palette across the app

---

## 📜 Available Scripts

```bash
# Start the development server
npm start

# Run on specific platforms
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser

# Code quality
npm run lint         # Run ESLint

# Reset project (clean slate)
npm run reset-project
```

---

## 🎨 Development Guidelines

This project follows strict development standards to ensure code quality and maintainability:

### Code Style
- ✅ **Concise, type-safe TypeScript** - Strict mode enabled, no `any` types
- ✅ **Functional components** - Use hooks instead of class components
- ✅ **Modular architecture** - Feature-based organization
- ✅ **Optimized performance** - Memoization, efficient list rendering

### Naming Conventions
- `camelCase` for variables and functions: `isLoading`, `fetchData`
- `PascalCase` for components: `FacilityCard`, `SearchBar`
- `kebab-case` for folders: `user-profile`, `facility-details`

### Performance Best Practices
- Use `React.memo` for pure components
- Avoid inline functions in render paths
- Optimize FlatList/FlashList with proper props
- Implement proper `useCallback` and `useMemo` usage

### State Management
- ✅ Use reducers for complex state logic

---

## 🗄 Database Schema

### Facilities Table
```typescript
interface Facility {
  id: string;           // Unique identifier
  name: string;         // Facility name
  address: string;      // Physical address
  facilities: string[]; // Array of amenities
}
```

The database is automatically seeded from `assets/facilities.json` on first launch.

---

## 🔧 Configuration

### TypeScript
- Strict mode enabled
- No implicit any
- Typed routes with Expo Router

### Expo Config Highlights
- **New Architecture**: Enabled for better performance
- **Edge-to-Edge**: Modern Android UI
- **Typed Routes**: Type-safe navigation
- **React Compiler**: Experimental optimizations enabled

---

## 🚦 Performance Optimizations

1. **FlashList** instead of FlatList for 10x better performance
2. **Debounced search** to reduce unnecessary queries
3. **Pagination** to load data incrementally
4. **Memoized callbacks** to prevent unnecessary re-renders
5. **SQLite indexing** for fast queries
6. **React.memo** for static components
7. **Optimized images** with expo-image

---

## 🤝 Contributing

When contributing to this project, please adhere to the established coding conventions and guidelines outlined above. Key principles:

- Write clean, readable code first
- Follow TypeScript best practices
- Test on multiple platforms
- Maintain consistent styling
- Document complex logic

---

## 📝 License

Private project - All rights reserved

---

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

## 🐛 Troubleshooting

### Database Issues
If you encounter database problems, try resetting:
```bash
# Clear Expo cache
npx expo start -c
```

### Build Issues
```bash
# Clean install
rm -rf node_modules
npm install
```

### iOS Simulator Issues
```bash
# Reset iOS simulator
npx expo run:ios --clear
```

---

Built with ❤️ using Expo and React Native
