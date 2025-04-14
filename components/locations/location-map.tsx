"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface LocationMapProps {
  coordinates: {
    lat: number
    lng: number
  }
  onMapClick?: (lat: number, lng: number) => void
}

export default function LocationMap({ coordinates, onMapClick }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
    })

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    // Añadir controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Añadir marcador inicial
    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current)

    // Manejar el evento de arrastrar el marcador
    if (marker.current && onMapClick) {
      marker.current.on("dragend", () => {
        const lngLat = marker.current?.getLngLat()
        if (lngLat) {
          onMapClick(lngLat.lat, lngLat.lng)
        }
      })
    }

    // Manejar el evento de clic en el mapa
    if (onMapClick) {
      map.current.on("click", (e) => {
        if (marker.current) {
          marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat])
        }
        onMapClick(e.lngLat.lat, e.lngLat.lng)
      })
    }

    return () => {
      map.current?.remove()
    }
  }, [])

  // Actualizar la posición del marcador cuando cambian las coordenadas
  useEffect(() => {
    if (!mapLoaded || !map.current || !marker.current) return

    marker.current.setLngLat([coordinates.lng, coordinates.lat])
    map.current.flyTo({
      center: [coordinates.lng, coordinates.lat],
      essential: true,
    })
  }, [coordinates, mapLoaded])

  return <div ref={mapContainer} className="w-full h-full" />
}

