# Project Overview: CardioNova

## Public-Facing Website

### `/` (Home Page)
- **Hero Section:** Main promotional banner.
- **Why Choose Us:** Highlights key advantages (Experience, Quality, Innovation).
- **Featured Services:** Showcases main services like cardiological consultations, electrocardiograms, and echocardiograms.
- **Our Commitment:** Section detailing the company's commitment to health.
- **Call to Action:** Prompts users to schedule an appointment.

### `/servicios` (Services Page)
- **Main Services:** Detailed descriptions of primary services (consultations, EKGs, echocardiograms) with benefits and prices.
- **Additional Services:** Lists other available tests like stress tests, Holter monitoring, and ambulatory blood pressure monitoring.
- **Specialized Treatments:** Information on interventional cardiology and electrophysiology.
- **Prevention Packages:** Offers different health check-up packages (Basic, Complete, Premium).
- **Testimonials:** Section with patient reviews.

### `/nosotros` (About Us Page)
- **Introduction:** General information about the clinic.
- **Mission and Vision:** The company's mission and vision statements.
- **Our History:** A timeline of the company's milestones.
- **Medical Team:** A carousel showcasing the doctors and their specializations.
- **Our Values:** Highlights the core values of the clinic (Excellence, Commitment, Innovation).

### `/contacto` (Contact Page)
- **Contact Form:** Allows users to send messages or schedule appointments.
- **Contact Information:** Displays address, phone numbers, email, and business hours.
- **Map:** Location of the clinic.

## Medical Professional Area (`/acceso-medicos`)

### `/acceso-medicos` (Login Page)
- **Login Form:** Secure access for authorized personnel (Admins, Doctors, Secretaries).

### `/acceso-medicos/dashboard` (Dashboard)
- **Welcome Page:** Main dashboard for authenticated users.
- **User Information:** Displays details of the logged-in user.
- **Role-Based Access:**
    - **Admin:** Access to User Management, Clinical Histories, and Reports.
    - **Secretary:** Access to Appointment Management, Patient Information, and read-only Clinical Histories.
    - **Doctor:** Access to Appointment Management, full access to create/edit their Clinical Histories, and Patient Lists.

### `/acceso-medicos/dashboard/historia-clinica` (Clinical History)
- **Functionality:** Allows for the creation, viewing, and editing of patient clinical histories.
- **Access:**
    - **Doctors:** Can create new histories and manage those associated with them.
    - **Admins:** Can view all clinical histories in the system.

### `/acceso-medicos/dashboard/usuarios` (User Management)
- **Functionality:** (Admin only) Interface for creating, viewing, and editing system users.

### `/acceso-medicos/dashboard/reportes` (Reports)
- **Functionality:** (Admin only) Displays statistics and reports for the medical center, such as the total number of users and active doctors.
