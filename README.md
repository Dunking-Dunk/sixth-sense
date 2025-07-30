<h1 align="center">🦯 Sixth Sense: Personal Companion for the Visually Impaired</h1>

<p align="center">
  Empowering navigation, communication, and environmental awareness through AI and hardware integration.
</p>

---

## 🛠️ Technology Arsenal

### 📱 Frontend

| Framework     | Platform      | Icon |
|--------------|---------------|------|
| React Native | Android / iOS | <img width="20" src="https://img.icons8.com/office/16/react.png" alt="React Native" /> |

---

### 🔙 Backend

| Framework | Usage                     |
|----------|---------------------------|
| Firebase | Infrastructure & Security |

---

### 🧠 AI Models

| Model              | Purpose                 |
|-------------------|-------------------------|
| Gemini            | Conversational assistant |
| Gemini Vision Pro | Image understanding      |
| YOLOv8            | Object detection         |
| OpenCV            | Face recognition         |
| EasyOCR           | Image text extraction    |

---

### 💻 Programming Languages

<img width="48" src="https://img.icons8.com/fluency/48/python.png" alt="Python" />&nbsp;&nbsp;&nbsp;
<img width="48" src="https://img.icons8.com/color/48/javascript--v1.png" alt="JavaScript" />

---

### 🔌 Hardware Components

- Raspberry Pi 5
- Microphone
- Webcam
- Power Bank (20000 mAh)
- GPS Module
- Gyroscope Sensor

---

## ✨ Features

- ✅ Environmental Awareness  
- ✅ AI Assistant  
- ✅ Navigation System  
- ✅ Live Location Tracking  
- ✅ Alert & Warning System  
- ✅ Voice Messaging  
- ✅ Caregiver App  
- ✅ Face Recognition  

---

## 🧍‍♂️ Face Recognition

Uses OpenCV to detect faces. Once a face is detected:
- Calculates the distance from the camera.
- If the distance is **below a safe threshold**, a **warning** is triggered.
- Guides the user to a safer route.

---

## 🚨 Fall Detection

By analyzing **gyroscope sensor data** from Raspberry Pi 5:
- Trained model detects falls.
- Alerts can be sent to caregivers through the app.

---

## 🧳 Object Detection

- Uses YOLOv8 to detect nearby objects with confidence scores.
- After detection, calculates object distance using **color segmentation** and **depth estimation**.
- If too close, a **text warning** and **voice prompt** are activated.

---

## 🗣️ Speech and Text Conversion

The main Python script handles:
- Speech-to-text and text-to-speech functionalities.
- Integration with **Gemini** and **Gemini Vision Pro** for intelligent conversations.
- Assists with day-to-day questions, reading out warnings, and navigating surroundings.

---

## 📲 Project Name: Sixth Sense [Caretaker App]

A cross-platform React Native mobile application paired with a Raspberry Pi–powered AI hardware setup.

---

## 🚀 Getting Started

### 📦 Prerequisites

Make sure the following are installed:
- Node.js  
- npm  
- Python 3

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Kishorecoder96/sixth-sense.git
```
```bash
cd Mobile_app
```
2.Install dependencies:
```bash
npm install
npm start
```
---
For python code :
```python
pip install -r requirments.txt
```
```python
python main.py
```
Note: Make sure to add the 'faces' folder in the directory inorder to recognize the faces.


##### STATUS
95 % of prototype is ready and fully functional .we need to improve on navigation and increase the features  for navigation
