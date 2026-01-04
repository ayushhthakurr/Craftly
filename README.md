# Craftly :- AI-Powered Website Generator

Craftly is an innovative web application that empowers users to create fully functional websites from natural language prompts. With real-time code editing, live previews, and a seamless user experience, Craftly makes web development accessible and efficient for everyone.

## 🚀 Features

- **AI Website Generation:** Create websites effortlessly from natural language prompts.
- **Real-Time Code Editing:** Modify generated code instantly with Monaco Editor.
- **Live Preview:** See your changes reflected in real-time.
- **File Management:** Organize your project with a built-in file explorer.
- **Build Process Visualization:** Understand the step-by-step creation of your website.
- **WebContainer Technology:** Enjoy instant previews directly in the browser.

## 🛠 Tech Stack

### Frontend:
- **React**: For building the user interface.
- **TypeScript**: Ensures type safety and scalability.
- **Tailwind CSS**: Provides modern styling and responsive design.
- **Monaco Editor**: Delivers a powerful in-browser code editing experience.
- **WebContainer API**: Enables in-browser development and live previews.

### Backend:
- **Node.js**: Powers the server-side logic.
- **Groq SDK**: Integrates the Large Language Model (LLM) for natural language understanding.

## 🏁 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ayushhthakurr/craftly.git
   cd craftly
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set Up Environment Variables**
   Create `.env` files in both `frontend` and `backend` directories:

   - Frontend `.env`
     ```
     REACT_APP_BACKEND_URL=http://localhost:3001
     ```

   - Backend `.env`
     ```
     PORT=3001
     GROQ_API_KEY=your_groq_api_key
     ```

4. **Start the Development Servers**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd ../frontend
   npm start
   ```

5. **Launch the Application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 🎮 Usage

1. Enter your website requirements in natural language on the home page.
2. Click **"Generate"** to create the website.
3. View and edit the generated code using the code editor.
4. Monitor real-time changes in the preview panel.
5. Use the file explorer to manage your project files.
6. Follow the step-by-step build process in the steps panel.

## 📐 System Architecture
![Craftly - System Design](https://github.com/user-attachments/assets/74a89093-16a2-4448-adc5-339e0d876e7d)

## 🤝 Contributing

Contributions are welcome! Here's how you can get involved:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙌 Acknowledgments

- **WebContainer API:** For enabling the in-browser development environment.
- **Monaco Editor:** For the code editing experience.
- **Groq SDK:** For seamless AI language model integration.

## 📬 Contact

Crafted with ❤️ by [Ayush Thakur](https://github.com/ayushhthakurr)
