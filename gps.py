import serial
import string
import pynmea2

ser = serial.Serial('/dev/ttyAMA0', 115200, timeout=0.5)
dataout = pynmea2.NMEAStreamReader()

while(True):
	ser.write(('AT+CGPSOUT=32\r\n').encode())
	ser.readline()
	ser.readline()
	data = ser.readline().decode('ISO-8859-1')
	if data[0:6] == "$GPRMC":
		newmsg = pynmea2.parse(data)
		lat = newmsg.latitude
		lng = newmsg.longitude
		gps = "Latitude=" + str(lat) + "and Longitude=" + str(lng)
		print(lat,lng) 