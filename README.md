# Spinneys ChatAssist: AI Chatbot Documentation

This repository contains the source code for Spinneys ChatAssist, a modern, production-grade AI chatbot built with Next.js, React, and Google's Genkit AI framework.

## 1. Project Overview

Spinneys ChatAssist is designed to provide a natural, intelligent, and multi-modal conversational experience for users of Spinneys Lebanon. It leverages advanced AI capabilities to understand user queries, maintain long-term context, and respond in both text and high-quality, multilingual speech.

---

## 2. Core Features

### Hybrid Conversational Memory

To provide a seamless and context-aware conversation, the chatbot uses a novel hybrid memory model. This approach overcomes the limitations of traditional chatbot memory strategies.

#### How It Works:

1.  **Short-Term Window:** The system keeps a "sliding window" of the last 6 recent messages. This ensures the AI has immediate, high-fidelity context for the current turn of the conversation.

2.  **Long-Term Summarization:** Once the conversation exceeds 12 messages, a specialized AI flow (`summarizeChatHistoryFlow`) is triggered. This flow "compresses" the older parts of the conversation into a concise, third-person summary.

3.  **Hybrid Payload:** For every new message, the AI receives a hybrid payload containing:
    *   The long-term summary (e.g., "The user has asked about store locations.").
    *   The short-term window of the last 6 messages.
    *   The user's brand-new query.

This "Compressive Memory" technique ensures the chatbot never loses context, while keeping API calls efficient and scalable for infinitely long conversations.

### Server-Side Voice Synthesis

The chatbot features robust, high-quality, and multilingual Text-to-Speech (TTS) capabilities for its responses.

#### How It Works:

1.  **Client-Side Trigger:** When a user clicks the "play audio" button, a request is sent to the server.

2.  **Server-Side Generation:** A Genkit flow (`textToSpeechFlow`) uses Google's advanced `gemini-2.5-flash-preview-tts` model to generate the audio. This model automatically detects the language (English or Arabic) and selects an appropriate, high-quality voice.

3.  **Universal Playback:** The server returns the audio as a standard `.wav` data URI, which is played back on the client using a standard HTML `<audio>` element. This architecture bypasses the inconsistencies of browser-based TTS APIs, ensuring every user hears the same premium voice.

---

## 3. System Architecture

The application is built on a modern, three-tiered architecture:

*   **Client (Next.js & React):** The user interface is built with React components and managed within a Next.js application. It handles user input (text and speech-to-text) and orchestrates communication with the backend via Next.js Server Actions.

*   **Server (Next.js & Genkit):** The backend logic resides within the Next.js server environment. It uses Google's **Genkit** framework to define and manage AI flows for chat responses, summarization, and TTS.

*   **AI Services (Google AI):** The server-side Genkit flows communicate with managed Google AI services, including the **Gemini model** for language understanding and the **TTS model** for voice generation.

---

## 4. Manual: Getting Started

### Prerequisites

*   Node.js (v20 or later)
*   An environment file with your Google AI API Key.

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

This project includes a Next.js web app for the chat interface and Genkit for the AI flows. You need to run both simultaneously in development.

1.  **Run the Genkit AI Flows:**
    Open a terminal and run the Genkit development server. This watches for changes in your AI flow files.
    ```bash
    npm run genkit:watch
    ```

2.  **Run the Next.js Web Application:**
    Open a second terminal and run the Next.js development server.
    ```bash
    npm run dev
    ```

3.  **Access the Chatbot:**
    Open your browser and navigate to `http://localhost:9002` to start interacting with Spinneys ChatAssist.
