import React from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';


const createAircraftIcon = (heading = 0) =>
  L.divIcon({
    html: `
      <div style="
        font-size:24px;
        transform: rotate(${heading}deg);
      ">
        ✈️
      </div>
    `,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });



export function LiveFlightMap({
  flights = []
}) {


  return (

    <MapContainer

      center={[
        20,
        0
      ]}

      zoom={2}

      style={{
        height:'500px',
        width:'100%',
        borderRadius:'var(--radius-md)'
      }}

    >


      <TileLayer

        attribution="OpenStreetMap"

        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

      />



      {
        flights.map((flight)=>{


          const lat =
            flight.position?.latitude;


          const lng =
            flight.position?.longitude;



          if(
            lat == null ||
            lng == null
          ){
            return null;
          }



          return (

            <Marker

              key={
                flight.id ||
                flight.icao24
              }


              position={[
                lat,
                lng
              ]}


              icon={createAircraftIcon(flight.heading ||0)}

            >


              <Popup>

                <strong>
                  {
                    flight.flightNumber ||
                    flight.callsign ||
                    'Unknown Flight'
                  }
                </strong>


                <br/>


                Altitude:
                {' '}
                {
                  flight.altitude ||
                  '--'
                }
                ft


                <br/>


                Speed:
                {' '}
                {
                  flight.speed ||
                  '--'
                }
                kt


                <br/>


                Heading:
                {' '}
                {
                  flight.heading ||
                  '--'
                }


              </Popup>


            </Marker>

          );


        })

      }


    </MapContainer>

  );

}