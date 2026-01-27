"use client";

// Used https://github.com/achingachris/openstreetmap-nextjs as a starting point.

import React, { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'

const Map = () => {
    // Default to University of Bristol for time being.
    const [center, setCenter] = useState({ lat: 51.456157, lng: -2.602882 })
    const [zoom, setZoom] = useState(7)

    return (
        <>
        <div className='container'>
            <div className='row'>
            <div className='col'>
                <div className='container'>
                <MapContainer center={center} zoom={zoom} style={{ height: "512px", width: "512px"}}>
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                </MapContainer>
                </div>
            </div>
            </div>
        </div>
        </>
    )
    }

export default Map