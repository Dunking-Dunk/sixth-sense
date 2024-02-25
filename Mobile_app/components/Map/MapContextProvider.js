import { createContext, useState } from 'react'


export const MapContext = createContext(undefined)

const MapContextProvider = ({ children }) => {
  const [map, setMap] = useState(undefined)

  return <MapContext.Provider value={{ map, setMap }}>{children}</MapContext.Provider>
}

export default MapContextProvider
