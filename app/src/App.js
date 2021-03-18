import React, { useState } from 'react';
import Moment from 'moment';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function App() {
  const [InputCity, setInputCity] = useState("");
  const [InputCountry, setInputCountry] = useState("");
  const [WeatherData, setWeatherData] = useState(null);
  const [SearchHistory, setSearchHistory] = useState([]);
  // GetWeather("Singapore", "Singapore");
  return (
    <>
      <Container className="py-3">
        <Row>
          <Col className="border-bottom">
            <h2>Today's Weather</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form className="py-3" inline onSubmit={onSubmitSearch}>
              <Form.Label htmlFor="formInputCity" srOnly>City</Form.Label>
              <Form.Control
                required
                className="mb-2 mr-2"
                id="formInputCity"
                placeholder="City"
                value={InputCity}
                onChange={e => setInputCity(e.target.value)}
                />
              <Form.Label htmlFor="formInputCountry" srOnly>Country</Form.Label>
              <Form.Control
                required
                className="mb-2 mr-2"
                id="formInputCountry"
                placeholder="Country"
                value={InputCountry}
                onChange={e => setInputCountry(e.target.value)}
              />
              <Button type="submit" className="mb-2 mr-2">Search</Button>
              <Button type="button" className="mb-2 mr-2" onClick={()=>{ setInputCity(""); setInputCountry(""); }}>Clear</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            { (WeatherData) ?
              // city, country, weather, desc, temp, hum, datetime
              <div>
                <span className="text-muted">{WeatherData.city}, {WeatherData.country}</span>
                <h1>{WeatherData.weather}</h1>
                <table>
                  <tbody>
                    <tr>
                      <td className="text-muted" width="120">Description:</td>
                      <td>{WeatherData.desc}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Temperature:</td>
                      <td>{WeatherData.temp}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Humidity:</td>
                      <td>{WeatherData.hum}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Time:</td>
                      <td>{Moment(WeatherData.datetime).format('YYYY-MM-DD hh:mm:ss A')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              : // else
              <p>No results found.</p>
            }
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="border-bottom">
            <h3>Search History</h3>
          </Col>
        </Row>
        <Row className="py-3">
          <Col>
            { (SearchHistory) ?
              [...SearchHistory].reverse().map((history, index)=> { return(
                <div key={index} className="d-inline-block w-100 py-2 mb-1 border-bottom">
                  <p className="float-left">{index+1}. {history.city}, {history.country}</p>
                  <div className="float-right">
                    {Moment(history.datetime).format('hh:mm:ss A')}
                    <Button type="button" className="btn-secondary rounded-circle ml-2" onClick={()=>{ viewSearchHistory(history) }}><i className="bi bi-search"></i></Button>
                    <Button type="button" className="btn-secondary rounded-circle ml-2" onClick={()=>{ deleteSearchHistory(index) }}><i className="bi bi-trash"></i></Button>
                  </div>
                </div>
              )})
              :
              <p>-empty-</p>
            }
          </Col>
        </Row>
      </Container>
    </>
  );

  // GET Weather.
  function GetWeather (City, Country) {
    console.log("Fetching Weather in "+City+" "+Country);
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+(City+','+Country)+'&appid=8042cb88f0b49b34adf3ea08fc61aceb')
    .then(response => response.json())
    .then(data => {
      var timeNow = new Date();
      var objWeather = {
        city: data.name,
        country: data.sys.country,
        weather: data.weather[0].main,
        desc: data.weather[0].description,
        temp: data.main.temp_min + "~" + data.main.temp_max,
        hum: data.main.humidity + "%",
        datetime: timeNow
      }
      console.log(objWeather);
      setWeatherData(objWeather);
      addSearchHistory(objWeather);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  // Search Form Handler
  function onSubmitSearch (e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log(InputCity, InputCountry);
    GetWeather(InputCity, InputCountry);
  }
  // Search Weather History
  // Add History Handler
  function addSearchHistory(obj) {
    setSearchHistory(SearchHistory.concat(obj));
  }
  function deleteSearchHistory(index) {
    setSearchHistory(SearchHistory.slice(index, 1));
  }
  function viewSearchHistory(obj) {
    console.log(obj);
    setWeatherData(obj);
    setInputCity(""); setInputCountry("");
  }
} // ENDOF APP
export default App;
