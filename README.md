# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6d4febd5-09cb-4e77-b565-65496c3f6a1d

## **Product Requirements Document (PRD)**  
### **TL;DR**  
A standalone mobile and web app that scans users' email for subscriptions, helps them unsubscribe from unwanted emails, cancel paid subscriptions, and provides renewal reminders to prevent surprise charges.  

---

## **Goals**  

### **Business Goals**  
- Build a scalable subscription management platform with high retention.  
- Monetize through a freemium model with premium automation features.  
- Differentiate from existing services by focusing on **automation** and **privacy-first design**.  

### **User Goals**  
- Reduce email clutter by unsubscribing from marketing emails.  
- Easily track and cancel unwanted paid subscriptions.  
- Get reminders before auto-renewals to avoid unwanted charges.  

### **Non-Goals**  
- Manually handling cancellations—users will be directed to service providers where automation isn’t possible.  
- Acting as a financial management tool beyond subscriptions.  

---

## **User Stories**  

1. **Subscription Detection**  
   - *As a user, I want to see a list of all my email sign-ups and subscriptions so I can review what I’m paying for.*  
   - *As a user, I want subscriptions categorized (free, paid, newsletters) so I can decide which to keep or remove.*  

2. **Unsubscribe & Cancelation**  
   - *As a user, I want to one-click unsubscribe from marketing emails without leaving the app.*  
   - *As a user, I want to cancel paid subscriptions directly from the app (if possible) or get clear instructions on how to do so.*  

3. **Renewal Reminders**  
   - *As a user, I want notifications before a paid subscription renews so I can decide if I still need it.*  
   - *As a user, I want a dashboard showing upcoming subscription renewals so I can plan my spending.*  

4. **Privacy & Security**  
   - *As a user, I want my email data to be securely processed without storing unnecessary information.*  
   - *As a user, I want to control what data the app accesses and remove my data anytime.*  

---

## **User Experience (UX)**  

### **Step-by-Step Flow**  

1. **Sign Up & Email Sync**  
   - User connects Gmail, Outlook, or another email provider.  
   - App requests read-only access to scan for subscription-related emails.  

2. **Dashboard & Subscription Overview**  
   - The app lists all detected subscriptions.  
   - Uses AI to categorize them as **Paid, Free, Newsletters**.  
   - Provides a **total monthly spending** estimate for paid subscriptions.  

3. **One-Click Actions**  
   - Users can **unsubscribe** from emails instantly.  
   - If a paid service allows easy cancelation, the app handles it directly.  
   - Otherwise, it provides **step-by-step instructions** for cancelation.  

4. **Renewal Alerts & Smart Suggestions**  
   - The app notifies users **X days before** a renewal charge.  
   - Suggests cheaper alternatives or ways to downgrade a plan.  

5. **Privacy & Settings**  
   - Users can revoke email access anytime.  
   - Data is encrypted, and only necessary metadata is stored.  

---

## **Success Metrics**  

- **% of emails successfully unsubscribed through the app.**  
- **% of paid subscriptions canceled through the app.**  
- **Retention rate (users returning monthly to check their subscriptions).**  
- **Conversion rate from free to premium users.**  

---

## **Technical Considerations**  

- **OAuth Authentication**: Securely connect to Gmail, Outlook, and other email providers.  
- **Email Parsing AI**: Use NLP to detect subscription-related emails and classify them accurately.  
- **Automation for Unsubscribing**: Leverage standard unsubscribe links but also explore APIs for direct cancelation (where possible).  
- **Push Notifications**: Reminders before renewal dates.  
- **End-to-End Encryption**: Protect user email data.  

---

## **Monetization Strategy**  

1. **Freemium Model**  
   - Free: Email scanning + subscription list.  
   - Paid: Automated cancelations, advanced AI suggestions, premium reminders.  

2. **Affiliate Partnerships**  
   - Suggest alternatives (e.g., cancel HBO Max → recommend a cheaper streaming service).  

3. **One-Time Fee for "Deep Clean"**  
   - A single payment for a **one-time full subscription audit** with personalized recommendations.  

---

## **Final Thoughts**  

This app solves a real pain point—people **forget what they’re subscribed to** and **overpay for services they don’t use**. If executed well, it can gain strong traction.  


## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6d4febd5-09cb-4e77-b565-65496c3f6a1d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6d4febd5-09cb-4e77-b565-65496c3f6a1d) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
