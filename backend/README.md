# Excel Mock Interviewer Backend

This is the backend component of the Excel Mock Interviewer application. It is responsible for handling the logic related to mock interviews, including candidate evaluation and data management.

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **app.js**: Entry point of the backend application.
  - **controllers/**: Contains the logic for handling requests and responses.
    - **interviewController.js**: Controller for managing interview-related operations.
  - **routes/**: Defines the API routes for the application.
    - **interviewRoutes.js**: Routes for interview-related endpoints.
  - **models/**: Contains the data models used in the application.
    - **interviewModel.js**: Model representing the interview data.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd excel-mock-interviewer/backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

## Usage

- The backend API can be accessed at `http://localhost:3000/api/interviews`.
- Use the defined routes to create, read, update, and delete interview records.

## Testing

- Ensure to write tests for your controllers and models to maintain code quality.
- Use a testing framework like Jest or Mocha for unit and integration tests.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.