# ✅ Todo Summary Assistant

A full-stack application where users can create and manage personal to-do items, generate a summary of pending tasks using an actual LLM (Claude Sonnet 4 via AWS Bedrock), and send the summary to a Slack channel via Webhooks.

---

## 🚀 Features

- Create, update, delete, and list personal to-do items
- Generate a smart summary of all pending tasks using a real LLM
- Post the summary directly to a configured Slack channel
- Clear UI with success/failure notifications

---

---

## 🧪 Test User Credentials

You can use the following credentials to test the application without creating a new account:
Email: user@gmail.com
Password: user@123

> ⚠️ **Note**:
> These credentials are for testing/demo purposes only. Please do not store any personal or sensitive data under this account.

---

## 🛠️ Tech Stack

| Layer    | Tech Used                             |
| -------- | ------------------------------------- |
| Frontend | React (JavaScript, Tailwind CSS)      |
| Backend  | Node.js (Express.js)                  |
| Database | MongoDB Atlas                         |
| LLM      | Claude Sonnet 4 (via AWS Bedrock)     |
| Slack    | Incoming Webhooks                     |
| Hosting  | (Optional) Vercel / Render / Supabase |

---

## 📦 Project Structure

```
Todo Summary Assistant/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
├── README.md
```

---

## ⚙️ Setup Instructions

### 📁 Clone the Repository

```bash
git clone https://github.com/your-username/todo-summary-assistant.git
cd todo-summary-assistant
```

### 🧪 Backend Setup (`/backend`)

1. Go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=us-east-1  # Or your region
   ```
4. Start the server:
   ```bash
   npm start
   ```

---

## 📡 Backend API Endpoints

The backend exposes the following RESTful endpoints:

| Method | Endpoint     | Description                                   |
| ------ | ------------ | --------------------------------------------- |
| GET    | `/todos`     | Fetch all todos for the authenticated user    |
| POST   | `/todos`     | Add a new todo                                |
| DELETE | `/todos/:id` | Delete a specific todo by ID                  |
| POST   | `/summarize` | Summarize all pending todos and send to Slack |

> 🔐 All endpoints require user authentication.

### 💻 Frontend Setup (`/frontend`)

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

---

## 🔐 Environment Variables

### `/backend/.env.example`

```env
MONGO_URI=
SLACK_WEBHOOK_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

---

## 💬 Slack Setup Instructions

1. Go to: https://api.slack.com/messaging/webhooks
2. Click **"Create an Incoming Webhook"**
3. Select a channel and generate the Webhook URL
4. Copy the URL and paste it into your backend `.env` file under `SLACK_WEBHOOK_URL`

---

## 🤖 LLM Setup (Claude via AWS Bedrock)

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Enable **Amazon Bedrock** in your region (e.g., `us-east-1`)
3. Generate access keys from IAM (Access Key ID and Secret Access Key)
4. Ensure your IAM user has access to Bedrock's Claude Sonnet model
5. Use the following endpoint in your code:
   - Model: `anthropic.claude-3-sonnet-20240229-v1:0`
6. Add your credentials to `.env`

---

## 🧠 Architecture & Design Decisions

### Why Node.js (Express)?

- Lightweight and efficient for quick API prototyping
- Familiar ecosystem and easy integration with MongoDB

### Why React?

- Fast, component-driven UI
- Easy integration with REST APIs
- Great for managing dynamic todo states

### Why Claude via AWS Bedrock?

- Claude Sonnet 4 offers high-quality summarization
- AWS Bedrock provides reliable, scalable access to multiple LLMs
- Avoids using OpenAI if API quota is limited

### Slack Integration

- Slack Webhooks allow simple integration without needing OAuth
- Enables team communication and transparency

---

## ✅ Sample Workflow

1. User creates todos in the React app
2. Backend stores them in MongoDB
3. User clicks **"Summarize"**
4. Backend fetches incomplete todos, sends them to Claude Sonnet via AWS Bedrock
5. Summary is posted to the Slack channel using Webhook

---

## 📸 Screenshots (Optional)

Include screenshots here of:

- Todo list UI
- Summary generation
- Slack message output

---

## 📡 Live Demo (Optional)

- Frontend: [https://task-summary-assistant.vercel.app/](#)
- Backend: [https://task-summary-assistant.onrender.com](#)

---
