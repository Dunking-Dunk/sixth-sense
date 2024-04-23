import requests
from geopy import distance

accessToken = 'pk.eyJ1IjoiaHVyc3VuIiwiYSI6ImNsc3Q2N2FocjFvbGIyaXBzbWM2Z2w1NGMifQ.tlgUONgceoguAL2oKuqgdQ'
#coords [lng, lat]
test_user = [80.1923155341089, 13.087384660288127, ]
test_loc = [ 80.1612290030796, 13.081351234586313,]

#first when it is called by caregiver set this user_steo_navigation true
user_step_navigation = True
#if user tells stop navigation
user_step_navigation = False

class NavigateUser:
    def __init__(self, accessToken):
        self.accessToken = accessToken
        self.user_step_navigation = False

    #user calls for navigation by giving location name eg: 'Navigate Mogappair east grace market'
    def setupNavigation(self, address, user_coord):
        address_coords_res=requests.get(f"https://api.mapbox.com/search/geocode/v6/forward?q={address}&country=IND&access_token={self.accessToken}")
        address_coords = address_coords_res.json()['features'][0]['geometry']['coordinates']

        #now take the address coord and feed it into the direction call
        #provide the coordinates of the user location then address coords
        #coords [lng, lat]
        user_coord = [80.18801000365521,13.087568483845535 ]
        res = requests.get(f"https://api.mapbox.com/directions/v5/mapbox/walking/{user_coord[0]}%2C{user_coord[1]}%3B{address_coords[0]}%2C{address_coords[1]}?alternatives=false&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token={self.accessToken}")

        if (res.status_code == 200):
            self.user_step_navigation = True
        else:
            self.user_step_navigation = False
            print('cant find the address call the command again')
        
   
        data = res.json()
        self.prev_dist = 0
        routes = data['routes']
        self.total_distance = data['routes'][0]['distance'] 
        self.steps = routes[0]['legs'][0]['steps']
        
    
    def stopNavigation(self):
        self.user_step_navigation = False
        print('navigation is stopped')

    #call this inside while loop
    def navigate(self, user_coords):
        if (self.user_step_navigation == True and len(self.steps) > 0):
            #call text to text speech model
            print(self.steps[0]['maneuver']['instruction'])
            total_distance = self.steps[0]['distance']
            loc = self.steps[0]['maneuver']['location']
            dist = distance.distance((loc[1], loc[0]), (user_coords[1], user_coords[0])).meters
            # for step in self.steps:
            #     print(step['maneuver'])
            #     loc = step['maneuver']['location']
            #     dist = distance.distance((loc[1], loc[0]), (user_coords[1], user_coords[0])).meters
            #     if (dist < 50):
            #         print(step['maneuver']['instruction'])
            #         self.steps.pop(0)
            #         if (self.steps.length <= 1):
            #             print('You have reached your destination')
            #             self.user_step_navigation = True
            #     if (dist >  (self.prev_dist + 100)):
            #             print('going in the wrong direction')
            #     self.prev_dist = dist
                
                
nav = NavigateUser(accessToken)
nav.setupNavigation('mogappair chennai', test_user)
nav.navigate(test_user)