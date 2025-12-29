# LankaDeal.lk

An AI-powered e-commerce platform that revolutionizes online shopping in Sri Lanka by making product discovery and price comparison effortless.

## Overview

LankaDeal.lk solves the common frustration of spending hours searching for products and comparing prices across multiple websites. Our platform uses an intelligent AI chatbot assistant to help users quickly find the best-quality products at the lowest prices, all in one place.

## Key Features

- **AI Chatbot Assistant**: Conversational interface powered by Google Generative AI that understands your needs and recommends products based on your preferences and budget
- **Smart Price Comparison**: Automatically compares prices across multiple vendors to ensure you get the best deal
- **Quality-Focused Search**: Filters and ranks products by quality ratings alongside price considerations
- **Intuitive Product Discovery**: Find what you need faster with AI-powered search and recommendations
- **Real-time Updates**: Stay informed with the latest prices and product availability
- **Interactive Data Visualization**: Product analytics and price trends with Recharts
- **Modern UI/UX**: Smooth animations and swipeable product galleries using Swiper

## Tech Stack

### Frontend
- **React 19.2.2**: Modern UI with the latest React features
- **React Router DOM**: Client-side routing and navigation
- **Redux Toolkit**: Centralized state management
- **Material UI 7**: Comprehensive component library with icons
- **Tailwind CSS 3**: Utility-first styling framework
- **Lucide React**: Beautiful, consistent icons
- **Swiper**: Touch-enabled slider for product galleries
- **Recharts**: Responsive chart library for data visualization

### Backend & Services
- **Firebase 12**: Authentication, Firestore Database, Cloud Storage, and Hosting
- **Google Generative AI**: AI chatbot and intelligent product recommendations

### Additional Tools
- **React Toastify**: Elegant toast notifications
- **Emotion**: CSS-in-JS styling for Material UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google AI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lankadeal.lk.git
cd lankadeal.lk
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

4. Start the development server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode at http://localhost:3000
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
myapp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── redux/          # Redux store, slices, and actions
│   ├── services/       # Firebase and API configurations
│   ├── utils/          # Helper functions and utilities
│   ├── hooks/          # Custom React hooks
│   ├── App.js          # Main application component
│   └── index.js        # Application entry point
├── public/             # Static assets
├── package.json        # Project dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.2 | Core UI library |
| @mui/material | ^7.3.6 | Material Design components |
| firebase | ^12.7.0 | Backend services |
| @google/genai | ^1.34.0 | AI chatbot functionality |
| @reduxjs/toolkit | ^2.11.2 | State management |
| tailwindcss | ^3.4.19 | Utility-first CSS |
| recharts | ^3.6.0 | Data visualization |
| swiper | ^12.0.3 | Touch sliders |

## Features in Detail

### AI-Powered Chat Assistant
The chatbot uses Google's Generative AI to provide intelligent product recommendations, answer queries, and guide users through their shopping journey.

### Price Comparison Engine
Automatically aggregates and compares prices from multiple sources, displaying the best deals with quality considerations.

### Responsive Design
Built mobile-first with Tailwind CSS and Material UI, ensuring a seamless experience across all devices.

### Real-time Data
Firebase Firestore enables real-time price updates and inventory tracking.

## Testing

Run the test suite with:
```bash
npm test
```

The project uses:
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **Testing Library User Event**: User interaction simulation

## Building for Production

1. Create an optimized production build:
```bash
npm run build
```

2. The build folder will contain optimized static files ready for deployment.

3. Deploy to Firebase Hosting:
```bash
firebase deploy
```

## Browser Support

### Production
- \>0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Last Chrome version
- Last Firefox version
- Last Safari version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/lankadeal.lk](https://github.com/yourusername/lankadeal.lk)

## Acknowledgments

- Google Generative AI for powerful AI capabilities
- Material UI and Tailwind CSS for excellent design systems
- Firebase for reliable backend infrastructure
- The open-source community for amazing tools and libraries

---

**Made with ❤️ for Sri Lankan shoppers**
