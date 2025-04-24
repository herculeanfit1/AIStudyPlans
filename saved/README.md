# SchedulEd Landing Page

This repository contains the landing page for SchedulEd, an AI-powered study plan generator that creates personalized learning paths tailored to individual learning styles.

## Overview

The landing page is designed to:
- Showcase the key features and benefits of SchedulEd
- Collect waitlist signups from interested users
- Provide information about how the product works

## Technical Details

The landing page is built with:
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Font Awesome icons

## Running Locally

Since this is a static HTML page, you can run it locally using any of these methods:

### Method 1: Open directly in a browser
Simply open the `index.html` file in any modern web browser.

### Method 2: Using a local server

If you have Python installed:
```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then open `http://localhost:8000` in your browser.

If you have Node.js installed:
```bash
# Using npx
npx serve

# Or install serve globally first
npm install -g serve
serve
```

Then open the URL shown in the terminal (usually `http://localhost:5000`).

## Project Structure

```
.
├── index.html          # The landing page
├── docs/               # Documentation
│   └── promptlog.md    # Log of prompts and interactions
└── README.md           # This file
```

## Next Steps

- Connect the waitlist form to a backend service to store email addresses
- Add real images and content specific to SchedulEd
- Implement analytics to track conversion rates
- Conduct A/B testing to optimize conversion rates 