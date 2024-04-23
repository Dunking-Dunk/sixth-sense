
from _future_ import print_function

import sys, time, logging

PORT = '/dev/ttyAMA0'
BAUDRATE = 115200
NUMBER = '8056201341'
PIN = None # SIM card PIN (if any)

from gsmmodem.modem import GsmModem
from gsmmodem.exceptions import InterruptedException, CommandError

def main():
    print('Initializing modem...')
    #logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
    global modem
    modem = GsmModem(PORT, BAUDRATE, incomingCallCallbackFunc=handleIncomingCall)
    modem.connect(PIN)
    print('Waiting for network coverage...')
    modem.waitForNetworkCoverage(30)
    sendSms()

def handleIncomingCall(call):
    if call.ringCount == 1:
        print('Incoming call from:', call.number)
    elif call.ringCount >= 2:
        if call.dtmfSupport:
            print('Answering call and playing some DTMF tones...')
            call.answer()
            # Wait for a bit - some older modems struggle to send DTMF tone immediately after answering a call
            time.sleep(2.0)
            try:
                call.sendDtmfTone('9515999955951')
            except InterruptedException as e:
                # Call was ended during playback
                print('DTMF playback interrupted: {0} ({1} Error {2})'.format(e, e.cause.type, e.cause.code))
            finally:
                if call.answered:
                    print('Hanging up call.')
                    call.hangup()
        else:
            print('Modem has no DTMF support - hanging up call.')
            call.hangup()
    else:
        print(' Call from {0} is still ringing...'.format(call.number))

def call():
    if NUMBER == None or NUMBER == '00000':
        print('Error: Please change the NUMBER variable\'s value before running this example.')
        sys.exit(1)
    print('Dialing number: {0}'.format(NUMBER))
    call = modem.dial(NUMBER)
    print('Waiting for call to be answered/rejected')
    wasAnswered = False
    while call.active:
        if call.answered:
            wasAnswered = True
            print('Call has been answered; waiting a while...')
            # Wait for a bit - some older modems struggle to send DTMF tone immediately after answering a call
            time.sleep(3.0)
            print('Playing DTMF tones...')
            try:
                if call.active: # Call could have been ended by remote party while we waited in the time.sleep() call
                    call.sendDtmfTone('9515999955951')
            except InterruptedException as e:
                # Call was ended during playback
                print('DTMF playback interrupted: {0} ({1} Error {2})'.format(e, e.cause.type, e.cause.code))
            except CommandError as e:
                print('DTMF playback failed: {0}'.format(e))
            finally:
                if call.active: # Call is still active
                    print('Hanging up call...')
                    call.hangup()
                else: # Call is no longer active (remote party ended it)
                    print('Call has been ended by remote party')
        else:
            # Wait a bit and check again
            time.sleep(0.5)
    if not wasAnswered:
        print('Call was not answered by remote party')
    print('Done.')
    modem.close()
        
def sendSms():
    response = modem.sendSms("+918056201341", "hello this is cool", True)
    if type(response) == SentSms:
        print('SMS Delivered.')
    else:
        print('SMS Could not be sent')
    modem.close()

if __name__ == '__main__':
    main()