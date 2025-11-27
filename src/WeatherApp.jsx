import { useState } from 'react'
import './WheaterApp.css'

export const WeatherApp = () => {

    const [city, setCity] = useState('')
    const [weatherData, setWeatherData] = useState(null)
    const [error, setError] = useState('')

    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = 'YOUR_API_KEY_HERE'
    const difKelvin = 273.15

    const fetchWeatherData = async () => {
        try {
            setError('') // Limpiar error previo
            const response = await fetch(`${urlBase}?q=${city}&appid=${API_KEY}&lang=es`)
            const data = await response.json()
            
            if (response.ok) {
                setWeatherData(data)
            } else {
                // Manejar errores de la API
                if (response.status === 404) {
                    setError('Ciudad no encontrada. Verifica el nombre e intenta nuevamente.')
                } else if (response.status === 400) {
                    setError('Solicitud inválida. Ingresa un nombre de ciudad válido.')
                } else {
                    setError('Error al obtener datos del clima. Intenta más tarde.')
                }
                setWeatherData(null)
            }
        } catch (error) {
            console.error('Ha habido un error: ', error)
            setError('Error de conexión. Verifica tu conexión a internet.')
            setWeatherData(null)
        }
    }

    const handleCityChange = (event) => {
        setCity(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (city.trim()) {
            fetchWeatherData()
        } else {
            setError('Por favor ingresa el nombre de una ciudad.')
        }
    }

    return (
        <div className="container">
            <h1>Aplicación de Clima</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ingresa una ciudad"
                    value={city}
                    onChange={handleCityChange}
                />
                <button type="submit">Buscar</button>
            </form>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {weatherData && (
                <div>
                    <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                    <p>Temperatura actual: {Math.floor(weatherData.main.temp - difKelvin)}ºC</p>
                    <p>La condición meteorológica actual: {weatherData.weather[0].description}</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                    />
                </div>
            )}
        </div>
    )
}