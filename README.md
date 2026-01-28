# Research Generator

A powerful research paper generation application built with React, TypeScript, and Google Gemini AI.

## 🚀 Running Methods

You can run the application in three different ways:

1. **Locally** - For development
2. **With Docker** - For deployment and production
3. **With Tauri** - As a desktop application

---

## 📋 Prerequisites

### For Everyone:

- Node.js (version 18 or newer)
- npm or yarn

### Additional Requirements:

- **Docker**: Docker and Docker Compose
- **Tauri**: Rust and appropriate development environment for your system

---

## 💻 Local Development

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

### Step 3: Open Application

Open your browser at: `http://localhost:3000`

### Other Commands:

```bash
# Build project for production
npm run build

# Preview built version
npm run preview

# Build and run in one command
npm start
```

---

## 🐳 Running with Docker (Production)

### Easiest Method - Docker Compose:

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up --build -d

# Stop
docker-compose down
```

### Manual Method - Docker Directly:

```bash
# Build image
docker build -t research-generator .

# Run container
docker run -p 3000:3000 research-generator
```

### Accessing Application:

- **Local**: http://localhost:3000
- **Network**: http://your-server-ip:3000

---

## 🖥️ Running with Tauri (Desktop Application)

### Install Tauri Requirements:

**Windows:**

```bash
# Install Visual Studio Build Tools
# Install Rust from https://rustup.rs/
```

**macOS:**

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Linux:**

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install system requirements
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

### Running Tauri Application:

**Development Mode:**

```bash
npm run tauri dev
```

**Build Application:**

```bash
# Build for current system
npm run tauri build

# Build for all systems
npm run tauri build -- --target all
```

**Built Application Files:**

- **Windows**: `src-tauri/target/release/bundle/msi/`
- **macOS**: `src-tauri/target/release/bundle/macos/`
- **Linux**: `src-tauri/target/release/bundle/deb/`

---

## 🔑 API Key Setup

### For All Methods:

1. Open the application
2. Click on the settings icon (gear in top right)
3. Enter your Google Gemini API key
4. Save the key

**Getting an API Key:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in the application

---

## 📁 Project Structure

```
├── components/          # React components
├── services/           # API services
├── hooks/              # Custom React Hooks
├── src-tauri/          # Desktop app code
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── types.ts           # TypeScript definitions
```

---

## 🛠️ Technologies Used

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Dark Mode
- **AI**: Google Gemini API
- **Desktop**: Tauri + Rust
- **Containerization**: Docker + Docker Compose

---

## 🔧 Troubleshooting

### Common Issues:

**Port 3000 is busy:**

```bash
# Change port in vite.config.ts
server: {
  port: 3001, // or any other port
}
```

**Docker Issues:**

```bash
# Clean old containers
docker system prune -a

# Rebuild image
docker-compose build --no-cache
```

**Tauri Issues:**

```bash
# Update dependencies
npm update

# Clean and rebuild
npm run tauri build -- --clean
```

---

## 📊 Quick Summary

| Method     | Usage       | Command                     |
| ---------- | ----------- | --------------------------- |
| **Local**  | Development | `npm run dev`               |
| **Docker** | Production  | `docker-compose up --build` |
| **Tauri**  | Desktop     | `npm run tauri dev`         |

---

## 🎯 Choose Your Method

- **Local**: Best for development and modification
- **Docker**: Best for deployment and servers
- **Tauri**: Best for standalone desktop application

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.
