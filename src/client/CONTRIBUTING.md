# Contributing to UpKeep  

Thank you for your interest in contributing! 🎉 This project is open source, and contributions are welcome. Whether you're fixing a bug, adding a feature, or improving documentation, your help is greatly appreciated.  

## 📜 Table of Contents  
- [How to Contribute](#how-to-contribute)  
- [Development Setup](#development-setup)  
- [Coding Guidelines](#coding-guidelines)  
- [Commit Message Guidelines](#commit-message-guidelines)  
- [Submitting a Pull Request](#submitting-a-pull-request)  
- [Reporting Issues](#reporting-issues)  
- [Feature Requests](#feature-requests)  
- [Code of Conduct](#code-of-conduct)  

---

## 🚀 How to Contribute  

1. **Fork the repository**: Click the "Fork" button at the top of this repository.  
2. **Clone your fork**:  
   ```sh
   git clone https://github.com/phorgemakerspace/upkeep
   cd upkeep
   ```  
3. **Create a new branch** for your changes:  
   ```sh
   git checkout -b feature-or-bugfix-name
   ```  
4. **Make your changes** and test them locally.  
5. **Commit your changes** with a descriptive message.  
6. **Push your branch** to GitHub:  
   ```sh
   git push origin feature-or-bugfix-name
   ```  
7. **Open a Pull Request (PR)** from your branch to the `main` branch.  
8. **Wait for review** and make necessary changes if requested.  

---

## 🛠️ Development Setup  

### Prerequisites  
Ensure you have the following installed:  
- **Node.js & npm** (or yarn)  
- **Docker** (optional, for containerized development)  

### Setup Instructions  
1. Install dependencies:  
   ```sh
   npm install
   ```  
2. Configure your `.env` file based on `.env.example`.  
3. Run the database migrations:  
   ```sh
   npm run migrate
   ```  
4. Start the development server:  
   ```sh
   npm run dev
   ```  

---

## 📝 Coding Guidelines  

### General Guidelines  
✅ Write clean, readable, and maintainable code.  
✅ Follow the **DRY (Don't Repeat Yourself)** and **KISS (Keep It Simple, Stupid)** principles.  
✅ Document your code where necessary using comments.  

### Code Formatting  
- Use **Prettier** for consistent formatting:  
- Use **ESLint** to check for linting issues:  

---

## ✅ Commit Message Guidelines  

Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:  

**Format:**  
```
type(scope): short description
```
**Examples:**  
- `feat(dashboard): add real-time machine status updates`  
- `fix(api): resolve machine log pagination bug`  
- `docs(readme): update installation instructions`  

**Types:**  
- `feat`: New feature  
- `fix`: Bug fix  
- `docs`: Documentation update  
- `style`: Formatting, no code changes  
- `refactor`: Code restructuring  
- `test`: Adding or updating tests  
- `chore`: Maintenance tasks  

---

## 🔥 Submitting a Pull Request  

1. Ensure your changes follow the coding guidelines.  
2. Test your code before submitting
3. Describe your changes clearly in the PR description.  
4. Link any related issues (e.g., `Closes #12`).  
5. Wait for review and respond to feedback.  

---

## 🐞 Reporting Issues  

If you find a bug, **please open an issue** and include:  
- Steps to reproduce the bug  
- Expected behavior  
- Screenshots (if applicable)  
- Environment details (browser, OS, etc.)  

### **Before submitting, check if the issue already exists!**  

---

## 🌟 Feature Requests  

Have an idea for a new feature? Open an issue with:  
- A **clear description** of the feature  
- How it would **benefit users**  
- Any potential implementation details  

---

## ⚖️ Code of Conduct  

Please be respectful and professional in all interactions.  

---

## 🙌 Thanks for Contributing!  

Your contributions make this project better! If you have any questions, feel free to open an issue or contact us. 🚀  

---