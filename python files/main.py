import PIL
import spacy
from PIL import Image
import google.generativeai as genai
import cv2
import easyocr
import time
import torch
import torch.hub
from omegaconf import OmegaConf
from pydub import AudioSegment
import simpleaudio as sa
import os
from cvzone.FaceMeshModule import FaceMeshDetector
import cvzone
import math
import requests
import time
import logging
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torch
import pyaudio
import numpy as np
import face_recognition
from ultralytics import YOLO
import multiprocessing
import requests
from haversine import haversine, Unit
import serial
import time
import string
import pynmea2
from mpu6050 import mpu6050
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime

torch.hub.download_url_to_file('https://raw.githubusercontent.com/snakers4/silero-models/master/models.yml',
                               'latest_silero_models.yml',
                               progress=False)

models = OmegaConf.load('latest_silero_models.yml')

language = 'en'
model_id = 'v3_en'
device = torch.device('cpu')

model, example_text = torch.hub.load(repo_or_dir='snakers4/silero-models',
                                     model='silero_tts',
                                     language=language,
                                     speaker=model_id)
model.to(device)

sample_rate = 8000
speaker = 'en_110'
put_accent = True
put_yo = True

logging.basicConfig(level=logging.INFO, format='%(asctime)-15s %(levelname)s %(message)s')
logging.info("wav2vec_microphone.main()")

model_name = "jonatasgrosman/wav2vec2-large-xlsr-53-english"
device = "cuda" if torch.cuda.is_available() else 'cpu'

model1 = Wav2Vec2ForCTC.from_pretrained(model_name).to(device)
processor = Wav2Vec2Processor.from_pretrained(model_name)

sampling_rate = 16000
record_time_in_seconds = 10
number_of_samples = round(record_time_in_seconds * sampling_rate)

genai.configure(api_key='#Enter the API Key')

nlp = spacy.load('en_core_web_sm')

# Face Recognition
known_face_encodings = []
known_face_names = []

directory = 'faces/'
for filename in os.listdir(directory):
    name = filename[:-4]
    known_face_names.append(name)
    image = face_recognition.load_image_file(f"{directory}{filename}")
    encodings = face_recognition.face_encodings(image)[0]
    known_face_encodings.append(encodings)

face_locations = []
face_encodings = []
face_names = []

prev_frame_time = 0
new_frame_time = 0

dist = 0
focal = 450
pixels = 30
width = 4

kernel = np.ones((3, 3), 'uint8')
font = cv2.FONT_HERSHEY_SIMPLEX
org = (0, 20)
fontScale = 0.6
color = (0, 0, 255)
thickness = 2

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

model = YOLO("../Yolo-Weights/yolov8n.pt")

classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
              "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
              "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
              "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
              "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
              "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
              "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
              "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
              "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
              "teddy bear", "hair drier", "toothbrush"]

def get_dist(rectange_params, image):
    pixels = rectange_params[1][0]
    print(pixels)
    dist = (width * focal) / pixels

    if dist < 60:
        tts("Warning !!!")

    image = cv2.putText(image, 'Distance from Camera in CM :', org, font,
                        1, color, 2, cv2.LINE_AA)

    image = cv2.putText(image, str(dist), (110, 50), font,
                        fontScale, color, 1, cv2.LINE_AA)

    return image

def face_recognition(img):

    small_frame = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
    face_names = []
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        if any(matches):
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]
                face_names.append(name)

    for (top, right, bottom, left), name in zip(face_locations, face_names):
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        cv2.rectangle(img, (left, top), (right, bottom), (0, 0, 255), 2)

        cv2.rectangle(img, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(img, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        tts(name)

def navigation(lat, lng):
    res = requests.get('https://api.mapbox.com/directions/v5/mapbox/walking/-73.992499%2C40.758239%3B-73.932945%2C40.741502?alternatives=false&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token= # Enter your api key')

    data = res.json()
    routes = data['routes']
    steps = routes[0]['legs'][0]['steps']
    user_coords = [lat, lng]

    for step in steps:
        loc = step['maneuver']['location']
        dist = haversine((loc[1], loc[0]), (user_coords[1], user_coords[0]))
        dist_normal = round(dist, 3) * 1000
        if (dist_normal < 50):
            # print(step['maneuver']['instruction'])
            tts(step['maneuver']['instruction'])
            steps.pop(0)
            if (steps.length <= 1):
                #print('You have reached your destination')
                tts('You have reached your destination')

def notification():
    res = requests.post('https://app.nativenotify.com/api/indie/notification', json={
        "subID": "sub-id-1",
        "appId": 19745,
        "appToken": "iV4ceRtjBYygvWfLa5Bu3z",
        "title": "Alert!! Alert!!",
        "message": "Emergency"},
                        headers={"Content-Type": "application/json"}
                        );

    print(res)

def trigger_gemini_pro(question):
    models = genai.GenerativeModel('gemini-pro')
    response = models.generate_content(question)
    print(response.text)
    text = (response.text)
    text1 = text[:500]

    if text1:
        tts(text1)

    else:
        tts("Sorry, I can't answer this question")

def trigger_gemini_vision_pro(question, image_path=None):
    if image_path:
        image = PIL.Image.open(image_path)
        image_resized = image.resize((128, 128))

        models = genai.GenerativeModel('gemini-pro-vision')
        response = models.generate_content([question, image_resized])
        print(response.text)
        text_output = response.text

        if response:
            tts(text_output)

        else:
            tts("Sorry, I can't answer that question.")

def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en', 'hi'], gpu=False)
    image = cv2.imread(image_path)
    new_width = 800
    new_height = 600

    resized_image = cv2.resize(image, (new_width, new_height))
    result = reader.readtext(resized_image)

    text_concatenated = ''.join([item[1] for item in result])

    if len(text_concatenated) > 0:
        tts(text_concatenated)

    else:
        tts("Sorry, I can't answer that question.")

def capture():
    cam = cv2.VideoCapture(0)
    while True:
        success, frame = cam.read()
        cv2.imshow("Webcam", frame)

        cv2.imwrite("Image.png", frame)

        if cv2.waitKey(1):
            break

    cam.release()
    cv2.destroyAllWindows()

def stt(record_time_in_seconds):
    sampling_rate = 16000
    number_of_samples = round(record_time_in_seconds * sampling_rate)

    mic_stream = pyaudio.PyAudio().open(format=pyaudio.paInt16,
                                        channels=1,
                                        rate=sampling_rate,
                                        input=True,
                                        frames_per_buffer=number_of_samples)

    logging.info("Speak!")
    speech_arr = np.frombuffer(mic_stream.read(number_of_samples), dtype=np.int16)
    print(speech_arr)

    speech_tsr = torch.from_numpy(speech_arr)
    input_values = processor(speech_tsr, return_tensord="pt", sampling_rate=sampling_rate)["input_values"]
    input_tsr = torch.from_numpy(input_values[0]).to(device).unsqueeze(0)

    logits = model1(input_tsr)["logits"]
    predicted_ids = torch.argmax(logits, dim=-1)
    logging.info(f"type(predicted_ids) = {type(predicted_ids)}; predicted_ids.shape = {predicted_ids.shape}")

    transcription = processor.decode(predicted_ids[0]).lower()
    return transcription

def message():
    current_datetime = datetime.datetime.now()
    timestamp = current_datetime.timestamp()

    cred = credentials.Certificate("secret.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    secret = 'Wret'
    collection = db.collection('visionUser').document('Wert').collection('messages')

    # user_input = stt()
    res = collection.add({
        # "message": user_input,
        "timestamp": timestamp
    })

def tts(texts):
    audio = model.apply_tts(text=texts, speaker=speaker, sample_rate=sample_rate, put_accent=put_accent, put_yo=put_yo)
    audio_np = audio.cpu().numpy()  # Convert tensor to numpy array
    audio_segment = AudioSegment(
        audio_np.tobytes(),
        frame_rate=sample_rate,
        sample_width=audio_np.dtype.itemsize,
        channels=1
    )
    play_obj = sa.play_buffer(audio_segment.raw_data,
                              num_channels=audio_segment.channels,
                              bytes_per_sample=audio_segment.sample_width,
                              sample_rate=audio_segment.frame_rate)
    play_obj.wait_done()

def map_question_to_function(question, image_path=None):
    doc = nlp(question)

    if ('text' in [token.lemma_ for token in doc] and image_path):
        return extract_text_from_image(image_path)
    elif image_path:
        return trigger_gemini_vision_pro(question, image_path)
    elif not image_path:
        return trigger_gemini_pro(question)

    else:
        tts("Sorry, I can't answer that question.")
        return None

def main():

    cred = credentials.Certificate("secret.json # Enter you .json file")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    secret = 'Wret'
    collection = db.collection('visionUser').document('Wert')  # create collection

    while True:
        port = "/dev/ttyAMA0"
        ser = serial.Serial(port, baudrate=9600, timeout=0.5)
        dataout = pynmea2.NMEAStreamReader()
        newdata = ser.readline().decode('ISO-8859-1')

        if newdata[0:6] == "$GPRMC":
            newmsg = pynmea2.parse(newdata)
            lat = newmsg.latitude
            lng = newmsg.longitude
            collection.update({
                "coords": firestore.GeoPoint(lat, lng)
            })
            gps = "Latitude=" + str(lat) + "and Longitude=" + str(lng)

    # Distance Measurement
    detector = FaceMeshDetector(maxFaces=1)
    while True:
        success, img = cap.read()
        img, faces = detector.findFaceMesh(img, draw=False)

        if faces:
            face = faces[0]
            pointLeft = face[145]
            pointRight = face[374]
            w, _ = detector.findDistance(pointLeft, pointRight)
            W = 6.3

            f = 840
            d = (W * f) / w
            print(d)

            if d < 60:
                tts("Warning !!!")

            cvzone.putTextRect(img, f'Depth: {int(d)}cm',
                               (face[10][0] - 100, face[10][1] - 50),
                               scale=2)

        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

        lower = np.array([37, 51, 24])
        upper = np.array([83, 104, 131])
        mask = cv2.inRange(hsv_img, lower, upper)

        d_img = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=5)

        cont, hei = cv2.findContours(d_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        cont = sorted(cont, key=cv2.contourArea, reverse=True)[:1]

        for cnt in cont:
            if (cv2.contourArea(cnt) > 100 and cv2.contourArea(cnt) < 306000):
                rect = cv2.minAreaRect(cnt)
                box = cv2.boxPoints(rect)
                box = np.int0(box)
                cv2.drawContours(img, [box], -1, (255, 0, 0), 3)

                img = get_dist(rect, img)

        cv2.imshow('Distance', img)
        cv2.waitKey(1)

    # Fall detection
    mpu = mpu6050(0x68)
    THRESHOLD = 10
    SAMPLING_RATE = 0.1

    while True:
        accel_data = mpu.get_accel_data()
        acceleration = [accel_data['x'], accel_data['y'], accel_data['z']]

        magnitude = math.sqrt(sum([a ** 2 for a in acceleration]))

        if magnitude < THRESHOLD:
            tts("Fall detected!")

        time.sleep(SAMPLING_RATE)

    n = 1

    tts("Hi,I am here to assist you")

    while True:
        image_path = None
        time.sleep(2)
        tts("listening")
        user_input = input(":")
        if "photo" in user_input.lower() or "image" in user_input.lower():
            capture()
            image_path = "Image.png"
            tts("photo captured")

            print(f"photo stored as photo{n}.jpg")
            time.sleep(2)
            n = n + 1

            tts("What would you like to do")

            user_input = input(":")
            response = map_question_to_function(user_input, image_path)
        elif "front of me" in user_input:
            # capture()
            image_path = input(":")
            tts("photo captured")
            user_input = "describe the image in short and accurate for blind assistant with emotions"

            response = trigger_gemini_vision_pro(user_input, image_path)

        elif "alert" in user_input.lower():
            notification()

        elif "message" in user_input.lower():
            message()

        elif "who" in user_input.lower():
            face_recognition(img)

        elif "vision map" in user_input.lower():
            navigation(lat, lng)
        else:
            response = trigger_gemini_pro(user_input)


if __name__ == "__main__":
    main()
