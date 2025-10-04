# SaadhanaBoard

SadhanaBoard is a spiritual productivity and mindfulness application designed to help users track their spiritual practices, set intentions, and cultivate deeper awareness through gamified elements and cosmic themes.

## Features

- Track spiritual practices and habits
- Set intentions and goals
- Cosmic-themed UI with multiple spiritual themes
- Progress tracking and insights
- Community features and social sharing
- Meditation and mindfulness tools

## Theme System

SadhanaBoard includes a sophisticated theme system with 10+ spiritual themes:

1. **Default** - Clean, minimal theme
2. **Shiva** - Cosmic destroyer theme
3. **Mahakali** - Powerful goddess theme with animated 3D background
4. **Mystery** - Enigmatic dark theme
5. **Earth** - Grounding nature theme
6. **Water** - Flowing aquatic theme
7. **Fire** - Energetic flame theme
8. **Bhairava** - Fierce protector theme
9. **Serenity** - Peaceful light theme
10. **Ganesha** - Remover of obstacles theme

### Mahakali Theme

The Mahakali theme features a dynamic 3D animated background using Three.js. It requires specific assets to function properly:

- `mahakali-yantra.png` - The central yantra texture
- `Skull and Bone Turnaround.gif` - Theme icon

### Theme Asset Management

Theme assets are managed through a series of npm scripts:

```bash
# Ensure all theme assets are in place
npm run themes:ensure-assets

# Generate theme manifest
npm run themes:generate

# Copy theme icons from root icons/ directory
npm run themes:copy-icons

# Move and optimize assets
npm run assets:move

# Run all setup scripts (used in dev and build)
npm run dev:setup
```

### Troubleshooting Theme Issues

1. **Missing public/icons directory**: The `themes:ensure-assets` script will create this directory if missing.

2. **Mahakali theme background not rendering**: 
   - Check that `public/icons/mahakali-yantra.png` exists and is a valid image file
   - Run `npm run dev:setup` to ensure assets are properly copied
   - The system will use a procedural fallback if the texture fails to load

3. **Theme icons not loading**:
   - Run `npm run themes:copy-icons` to copy icons from the root `icons/` directory
   - Check that the source icons exist in the `icons/` directory

4. **Theme switching issues**:
   - Verify that all themes are properly registered in `src/themes/index.ts`
   - Check browser console for theme-related errors

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up theme assets: `npm run dev:setup`
4. Start the development server: `npm run dev`

## Building for Production

```bash
npm run build
```

This will run all asset preparation scripts and build the application.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

[License information would go here]
