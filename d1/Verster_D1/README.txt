Shutter - Photo Sharing Website
Deliverable 1

GitHub repository:
https://github.com/YOUR_USERNAME/YOUR_REPO

Test account:
Email: test@test.com
Password: test1234

Running with Docker Compose (recommended):
  docker-compose up --build

Frontend will be available at http://localhost:5173
Backend will be available at http://localhost:3001

Running each container manually:

Backend:
  cd backend
  docker build -t shutter-backend .
  docker run -p 3001:3001 shutter-backend

Frontend:
  cd frontend
  docker build -t shutter-frontend .
  docker run -p 5173:5173 -e VITE_API_URL=http://localhost:3001 shutter-frontend
