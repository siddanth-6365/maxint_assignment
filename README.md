# **Financial Spending & Anomaly Detection App**

This application predicts future spending based on past financial transactions and detects anomalies (unusual expenses) using machine learning models. It offers a user-friendly interface to view spending forecasts and identify irregularities in transactions.

## **Features**

- **Spending Forecast:** Uses past transactions to predict future spending trends, helping users plan their finances.
- **Anomaly Detection:** Identifies unusual transactions, such as large expenses or uncommon spending categories, to alert users.
- **Interactive Dashboard:** Provides a visual representation of spending trends and anomalies using charts and tables.

## **Tech Stack**

- **Frontend:** React (with Next.js), Chart.js for data visualization
- **Backend:** Node.js with Express
- **AI/ML Services:** Flask with Python (Prophet for forecasting and Isolation Forest for anomaly detection)
- **Database:** PostgreSQL
- **Containerization:** Docker and Docker Compose

## **Setup and Installation**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd financial-spending-app
   ```

2. **Environment Setup:**

   - Ensure you have Docker installed.
   - Create a `.env` file with your environment variables:
     ```bash
     DATABASE_URL=your_postgres_database_url
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_BACKEND_URL=your_backend_url
     ```

3. **Build and Run the Application:**
   ```bash
   docker-compose up --build
   ```

   This will start all services (frontend, backend, and AI service) with Docker Compose.

4. **Access the Application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **AI Service:** http://localhost:5001

## **Usage**

- **Spending Forecast:** Click on "Get Forecast" to view predicted spending trends for future months.
- **Anomaly Detection:** Click on "Detect Anomalies" to identify unusual transactions and spending patterns.

## **Machine Learning Models Used**

- **Prophet (Forecasting):** Used to predict future spending based on past transactions.
- **Isolation Forest (Anomaly Detection):** Used to detect irregularities in spending by identifying transactions that deviate from normal patterns.

## **Folder Structure**

- **frontend/**: Contains the React code for the user interface.
- **backend/**: Contains the Node.js code for the backend API.
- **ai/**: Contains the Flask service for machine learning models.
