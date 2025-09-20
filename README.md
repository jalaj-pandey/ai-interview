# Excel Mock Interviewer Application

## Overview
The Excel Mock Interviewer application is designed to facilitate mock interviews using Excel-based evaluation methods. This project consists of a backend service that handles the evaluation logic and a frontend interface for users to interact with the application.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
The backend is built using Python and includes the following components:
- **src/app.py**: Entry point of the backend application, initializing the app and configurations.
- **src/controllers/interviewController.js**: Contains the logic for handling interview-related requests.
- **src/routes/interviewRoutes.js**: Defines the routes for the interview endpoints.
- **src/models/interviewModel.js**: Contains the data models used in the application.
- **requirements.txt**: Lists the Python dependencies required for the backend application.
- **Dockerfile**: Instructions to build a Docker image for the backend application.

### Frontend
The frontend is built using React and includes the following components:
- **src/App.jsx**: Main App component serving as the root of the application.
- **src/components/Interviewer.jsx**: Component for the interviewer interface.
- **src/pages/Home.jsx**: Home page component for the application.
- **public/index.html**: Main HTML file serving as the entry point for the React app.
- **src/index.js**: Entry point for the React application, rendering the main App component.
- **src/styles.css**: CSS styles for the frontend application.

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd excel-mock-interviewer
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Run the backend application:
     ```
     python src/app.py
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```
     cd frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the frontend application:
     ```
     npm start
     ```

## Usage
- Access the frontend application in your browser at `http://localhost:3000`.
- Use the interface to conduct mock interviews and evaluate candidates based on their responses.

## Documentation
For detailed design specifications and architecture, refer to the `docs/design.md` file. Sample transcripts of mock interviews can be found in `docs/sample_transcripts.md`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.