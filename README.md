# Bun Nuoc Co Le – Frontend (Vanilla)

## Overview

This frontend project was built for Bun Nuoc Co Le restaurant during its early operational phase.
The goal is to provide a simple website that allows customers to easily access restaurant information on the internet.

## Objectives

* Build a basic website for brand presence
* Display menu and pricing clearly
* Ensure a simple and user-friendly experience
* Optimize performance for deployment on free cloud platforms

## Development Criteria

* Clean and user-friendly interface
* Fast loading performance (lightweight)
* Responsive design (compatible with mobile and desktop)
* No framework dependency (pure HTML, CSS, JavaScript)
* Clear separation between frontend and backend (RESTful API)
* Compliant with basic website content regulations

## Demo

* Frontend: https://bunnuoccole.netlify.app/
* Backend (Golang API): https://github.com/letan-165/family-restaurant-golang

## Tech Stack

* HTML, CSS, JavaScript (Vanilla)
* Bootstrap (UI framework)
* Cloudinary (cloud media storage and image hosting)
* Netlify (deployment)

## Architecture

* Frontend consumes APIs from the backend (Golang)
* Communication via RESTful API
* Uses Cloudinary for image storage and delivery
* Caches menu data on the client side using localStorage to reduce latency and unnecessary API requests
* Fully separates client and server
