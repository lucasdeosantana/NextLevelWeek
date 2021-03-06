import { LeafletMouseEvent } from "leaflet";
import React, { useEffect, useState } from 'react';
import { Map, Marker, TileLayer } from "react-leaflet";
import api from '../../services/api';
import { prospsMapsI } from "../../interfaces/appInterfaces";

const Maps: React.FC<prospsMapsI> = ({setCity, ufCity, setLatLon}) => {

  const [initialPosition, setInitialPosition] = useState<[number, number]>([-11.3206707,-51.0105178])
  const [positionSelected, setpositionSelected] = useState<[number, number]>([0,0])
  
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position=>{
        const { latitude, longitude} = position.coords        
        setInitialPosition([latitude, longitude])
    })
  },[])

  useEffect(() => {
    if(ufCity.city===""){
      return;
    }
    api.get(`uf/${ufCity.uf}/city/${ufCity.city}`).then(
      response => {
        setInitialPosition([response.data.latitude, response.data.longitude])
      }
    )
  }, [ufCity])

  function handleSelectPosition(event:LeafletMouseEvent){
    const latitude  = event.latlng.lat
    const longitude = event.latlng.lng
    setpositionSelected([ latitude, longitude])
    if(setLatLon){
      setLatLon([latitude,longitude])
    }
  }
  return (
    <Map center={initialPosition} zoom={15} onclick={handleSelectPosition}>
        <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <Marker position={positionSelected} />
    </Map>
  )
}

export default Maps;