# SIXTH SENSE

A Personal companion device for blind people to help them for navigation,communication and environmental awareness

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
<img width="48" height="48" src="https://img.icons8.com/fluency/48/python.png" alt="python"/>

##### Hardware

- Raspberry Pi 5
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

using gyroscope sensor we get the data from pi 5 and using the model we process the data. we know that our  user is fallen or not


---
##### Obect Detection
It checks for all the objects that are visible is the camera and displays the name of the object which are saved in YOLO V8, along with the probability.


---
Once a object is detected it uses the color of the object to measure the distance between the object and the camera and if the distance is less than the given safe distance then it warns the person by displaying a warning text and directs them to take a different direction.





---

This is the main python file which include all the speech to text converting functions which helps in reading out the warnings and texts from all the above mentioned files.And also with the help of Gemini and Gemini Vision Pro the blind person is able to have a full fledged human like conversation and at the same time fulfilling their day to day needs and requirements.
















