import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/weather?city=${city}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching the weather data.');
    }
  }, [city]);

  useEffect(() => {
    if (!isTyping) {
      fetchWeatherData();
    }
  }, [city, isTyping, fetchWeatherData]);

  return (
    <Wrapper>
      <InputContainer>
        <Input type="text" value={city} onChange={(e) => { setIsTyping(true); setCity(e.target.value); }} onBlur={() => setIsTyping(false)} />
        <Button onClick={fetchWeatherData}>Fetch Weather Data</Button>
      </InputContainer>
      {weatherData && (
        <InfoList>
          <ListItem>{weatherData.name}</ListItem>
          <ListItem>{weatherData.weather[0].description}</ListItem>
          <ListItem>{weatherData.main.temp} degrees Fahrenheit</ListItem>
        </InfoList>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #f5f5f5;
  padding: 1rem;
  margin: 0 auto;
  max-width: 500px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Input = styled.input`
  width: 200px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const InfoList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
`;

const ListItem = styled.li`
  font-size: 1.2rem;
`;

export default Weather;