# SIXTH SENSE
![sixth logo (1)](https://github.com/Kishorecoder96/sixth-sense/assets/115532083/d05649f2-fa63-424c-80c3-c491bc632fa7)


A Personal companion device for blind people to help them for navigation,communication and environmental awareness

##### PROJECT ARCHITECTURE
![Sixth sense](https://github.com/Kishorecoder96/sixth-sense/assets/115532083/4424170b-c36f-4bd9-8f3f-0736811866b7)

### TECHNOLOGY ARSENAL

##### FRONTEND
---
| Framework | Platform |
|------ |------- |
| React Native | Android/ios | <img width="16" height="16" src="https://img.icons8.com/office/16/react.png" alt="react"/> |


---
##### BACKEND
---
| Framework | Usage |
|------ |------- |
|Firebase | Infrastructure and security|

##### AI 
---
| MODELS | PURPOSE |
|----- |----- |
| Gemini | for answering questions |
| Gemini Vision pro | for describe the image |
| yolo |for object detection |
| OpenCV | for face recognition |
| Easy OCR | for extract images

##### Programming Languages
<img width="48" height="48" src="https://img.icons8.com/fluency/48/python.png" alt="python"/><img width="48" height="48" src="https://img.icons8.com/color/48/javascript--v1.png" alt="javascript--v1"/>

##### Hardware

- Raspberry pi 5
- Microphone
- Webcam
- Power Bank (20000 mah)
- GPS Module
- Gyroscope sensor

#### Features
- Enviromental Awarness
- AI Assistant
- Navigation System
- Live Location Tracking
- Alert System
- Voice Messaging
- Caregiver App
- Face Recognition



---
##### Face Recognition
Searches for faces and once detected it measures the distance between the particular face and the camera.If the distance is less than the given safe distance it warns the person by displaying a warning text and directs them to take a different path.


---
##### Fall Detection

Utilizing the gyroscope sensor data obtained from Pi 5, we process the information using our model to determine whether the user has fallen or not.


---
##### Obect Detection
It checks for all the objects that are visible is the camera and displays the name of the object which are saved in YOLO V8, along with the probability.


---
Once a object is detected it uses the color of the object to measure the distance between the object and the camera and if the distance is less than the given safe distance then it warns the person by displaying a warning text and directs them to take a different direction.





---

This is the main python file which include all the speech to text converting functions which helps in reading out the warnings and texts from all the above mentioned files.And also with the help of Gemini and Gemini Vision Pro the blind person is able to have a full fledged human like conversation and at the same time fulfilling their day to day needs and requirements
# Project Name

This is a React Native project for sixth sense [caretaker app].

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm 

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
for python code :
```python
pip install -r requirments.txt
```
```python
python main.py
```


##### STATUS
95 % of prototype is ready and fully functional .we need to improve on navigation and increase the features  for navigation
