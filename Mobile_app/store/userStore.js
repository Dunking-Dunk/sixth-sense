import { create } from 'zustand'

const useUserStore = create((set) => ({
currentUser: null,
  setCurrentUser: (payload) => set((state) => ({ currentUser: payload })),
  userCoords: null,
  setUserCoords: (payload) => set((state) => ({userCoords: payload })),
  sixthSenseUser:null,
  setSixthSenseUser: (payload) => set((state) => ({...state, sixthSenseUser: payload})) 
}))

export default useUserStore