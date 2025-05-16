# 🎓 Vidyalankar Event Management Platform

A comprehensive event management system tailored for educational institutions, built to streamline event planning, participation, and engagement across students, faculty, and administrators.

---

## ✅ Completed Features

### 🔐 **Authentication System**
- **Role-based user registration** (Student / Faculty)
- **Secure login** with session management
- **Protected routes** based on user roles
- **Mock authentication** support for development/testing

### 📅 **Event Management**
- **Faculty event creation** interface
- **Admin approval** workflow for new events
- **Public event registration** system
- **Event listing** with dynamic filters and search
- **Individual event detail and registration** pages
- **QR code ticket generation** for participants

### 👤 **User Dashboards**
- **Student Dashboard**: View and manage registered events
- **Faculty Dashboard**: Create, manage, and monitor events
- **Admin Dashboard**: Approve events and oversee system activities
- **Integrated analytics** and reporting features

### 📝 **Content Management System (CMS)**
- **Article creation** with rich text editing
- **Category and tag** management
- **Drafting, editing, and publishing** workflows
- **Clean content** presentation across devices

### 💬 **Forum System**
- **Topic creation** and threaded replies
- **Organized discussions** by categories
- **Tagging** support for better discoverability
- **Mark answers as solutions** for easy reference

### 💎 **UI/UX Features**
- **Fully responsive design** for all devices
- **Dark mode** support
- **Graceful loading states** and error handling
- **Interactive charts** and data visualizations
- **Clean, modern**, user-friendly interface

### 🗄️ **Database & Backend**
- Built with **Supabase** for scalable backend
- **Row Level Security (RLS)** policies
- Structured schema with:
  - `user_profiles`
  - `events` & `event_registrations`
  - `forum_topics`, `forum_replies`
  - `cms_articles`, `cms_categories`

---

## ⏳ Pending / Missing Features

### 🔔 **Notifications System**
- **Real-time updates** for event changes
- **Email notification** system
- **Push notifications** support

### 💳 **Payment Integration**
- **Event ticket payment** system
- **Viewable payment history**
- **Refund processing** module

### 🚀 **Advanced Features**
- **Attendance tracking** via QR codes
- **Certificate auto-generation**
- **Bulk user import** (CSV, etc.)
- **Exportable advanced reports**

### 🌐 **Social Features**
- **Extended user profiles** with social links
- **Direct messaging** between users
- **Social sharing** for events and articles
- **Following and connection** system

### 🔧 **Additional Enhancements**
- **Calendar sync** with Google & Outlook
- **Cross-platform mobile app**
- **Offline-first support**
- **Multi-language** internationalization
- **Advanced search** with multiple filters

---

## 🏗️ Tech Stack

- **Frontend**: React / Next.js
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI Library**: TailwindCSS
- **Auth**: Supabase Auth
- **Other Tools**: QR Code Generator, Chart.js / Recharts

---

## 🚧 Development Setup

```bash

# Install dependencies
npm install

# Run the app
npm run dev
