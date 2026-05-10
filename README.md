# Finarc 
**Finarc** is a high-performance financial analysis dashboard and portfolio tracking platform. Built with a bold **Brutalist Design System**, it provides investors with deep insights into market data, financial statements, and real-time portfolio performance.


## ✨ Features

- **📊 Financial Analytics**: Comprehensive views for Income Statements, Balance Sheets, and Cash Flow.
- **💼 Portfolio Management**: Real-time tracking of holdings, cost basis, and profit/loss metrics.
- **👤 Secure Authentication**: Robust JWT-based identity system for personalized portfolio tracking.
- **💬 Social Interaction**: Commenting system for individual stock analysis and community insights.
---

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET 8 Web API
- **Language**: C#
- **Database**: PostgreSQL (Entity Framework Core)
- **Identity**: ASP.NET Core Identity + JWT
- **External API**: Financial Modeling Prep (FMP)

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Custom Brutalist Theme)
- **State/Forms**: React Hook Form + Yup
- **Routing**: React Router
- **Notifications**: React Toastify

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [FMP API Key](https://site.financialmodelingprep.com/developer/docs/)

### 1. Backend Setup
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Configure your `appsettings.json` or use User Secrets:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=stealth_db;Username=postgres;Password=yourpassword"
     },
     "FMPKey": "your_api_key_here",
     "JWT": {
       "Issuer": "http://localhost:5246",
       "Audience": "http://localhost:5246",
       "SigningKey": "your_ultra_secure_secret_key"
     }
   }
   ```
3. Run migrations and start the server:
   ```bash
   dotnet ef database update
   dotnet run
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5246/api/
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

## 🏛️ Architecture

The project follows a decoupled client-server architecture:
- **`api/`**: Clean Architecture inspired backend with Repository Pattern, Service Layer, and DTOs.
- **`frontend/`**: Component-based React architecture with custom hooks and a centralized API service layer.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

