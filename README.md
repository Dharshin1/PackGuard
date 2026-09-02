# PackGuard: Automated Legal Metrology Compliance Inspection System

PackGuard is an automated inspection application built to enforce compliance with the Legal Metrology (Packaged Commodities) Rules, 2011 in India.

The primary purpose of PackGuard is to assist legal metrology enforcement officers and inspectors in evaluating packaged consumer commodities. Inspectors upload image panels of product packaging. The application pre-processes the image, extracts mandatory statutory declarations, runs deterministic compliance rule checks, flags potential non-compliance issues, displays visual evidence, and generates official downloadable PDF inspection reports.

## Core Features

- Product Image Upload: Drag and drop or select images of packaging display panels.
- Image Preprocessing: OpenCV contrast boost, grayscale conversion, and adaptive thresholding.
- Text Extraction: OCR pipeline to read printed text on package labels.
- Declaration Extraction: Automatic extraction of mandatory fields including Product Name, MRP, Net Quantity, Manufacturer details, Address with postal pincode, Date of Manufacture, and Consumer Care contact.
- Deterministic Rule Engine: Rule-based compliance evaluation under Legal Metrology Rules 2011 to classify products into Compliant, Requires Review, or Potential Non-Compliance.
- Evidence Viewer: Visual highlights and cropped regions for inspection review.
- Inspection History and Dashboard: Filterable logs and metric cards tracking past scans.
- Official PDF Report Generation: Downloadable inspection certificate built using Python ReportLab.

## Architecture Pipeline

Product Image -> OpenCV Preprocessing -> OCR Engine -> Declaration Extractor -> Rule Engine -> Status & Evidence -> PDF Report & Dashboard

## Technology Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router v7
- Backend: Python, FastAPI, Uvicorn
- Image Processing and OCR: OpenCV, PaddleOCR, Tesseract
- Database: MongoDB (with zero-config in-memory fallback)
- Report Generation: Python ReportLab

## Getting Started

### 1. Backend Setup

Change to the backend directory:
cd backend

Create virtual environment and install dependencies:
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

Run FastAPI server:
./venv/bin/python main.py

The backend API will run at http://localhost:8000.

### 2. Frontend Setup

From the project root directory, install dependencies and start Vite dev server:
npm install
npm run dev

The web interface will run at http://localhost:5173.

## Environment Variables (Optional)

Create a backend/.env file to connect external services:
MONGODB_URI=mongodb://localhost:27017
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

If these variables are omitted, PackGuard automatically operates using local static storage and in-memory database fallback.
