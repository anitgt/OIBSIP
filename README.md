# 🍕 Pizzeria E-commerce & Inventory Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application transformed into a premium pizza e-commerce experience with integrated Razorpay payments and an advanced Admin Inventory Management system.

## 🎯 Objective
The primary goal was to evolve a basic Pizzeria website into a functional, production-ready platform where users can customize pizzas, pay securely, and track their orders, while admins can manage ingredients and monitor the entire business lifecycle.

## 🚀 Steps Performed

### 1. E-commerce Foundation
*   **Global Cart System:** Implemented `CartContext` to manage items across regular and custom pizza builder pages.
*   **Realistic Pricing:** Transitioned from placeholder dollar values to realistic Indian Rupee (INR) pricing and removed non-pizza items.
*   **Premium UI/UX:** Applied a full Glassmorphism design system across all pages (Dashboard, Login, Cart, Custom Builder).

### 2. Payment Integration
*   **Razorpay Integration:** Built a secure end-to-end payment flow using the Razorpay API.
*   **Signature Verification:** Implemented cryptographic signature verification on the backend to ensure payment security.

### 3. Admin & Inventory Management
*   **Inventory Tracking:** Created a dedicated system for tracking stock levels of Bases, Sauces, Cheeses, Veggies, and Meats.
*   **Automated Deductions:** Integrated logic to automatically decrement stock levels upon successful payment.
*   **Low Stock Alerts:** Implemented an automated email notification system (Nodemailer) that alerts the admin when any ingredient falls below the threshold of 20 units.

### 4. Order Lifecycle Management
*   **Status Tracking:** Added professional order statuses: `Order Received`, `In the Kitchen`, `Sent to Delivery`, and `Delivered`.
*   **Admin Dashboard:** Built a management panel for admins to update order statuses in real-time.
*   **User Tracking:** Created a "My Orders" page with real-time polling so users can watch their pizza's progress.

## 🛠️ Tools & Technologies Used
*   **Frontend:** React.js, React Router, Axios, CSS3 (Custom Glassmorphism).
*   **Backend:** Node.js, Express.js, JWT (Authentication).
*   **Database:** MongoDB with Mongoose ODM.
*   **Payments:** Razorpay API & SDK.
*   **Email:** Nodemailer with Gmail/SMTP integration.
*   **Design:** Custom CSS variables, linear gradients, and micro-animations.

## 📊 Outcome
The result is a high-performance, visually stunning Pizzeria application that bridges the gap between customers and kitchen staff.
*   **Customers** enjoy a seamless builder-to-checkout experience with live tracking.
*   **Admins** have total oversight of stock levels and order fulfillment, backed by automated alerts that prevent inventory shortages.

---
*Developed as part of the OIBSIP task enhancement.*
