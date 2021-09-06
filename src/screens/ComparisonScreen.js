import React, { Component } from 'react';
import { Container, Header, Grid, Search } from 'semantic-ui-react';

export default class ComparisonScreen extends Component {
  constructor() {
    super();
    this.state = {
      cityValue: '',
      cities1: [],
      cities2: [],
      errorMessage: null,
    };
  }

  onChangeCity1 = (e) => {
    this.setState({
      cityValue: e.target.value,
    });
    this.search(e.target.value);
  };

  onChangeCity2 = (e) => {
    this.setState({
      cityValue: e.target.value,
    });
    this.search2(e.target.value);
  };

  componentDidMount() {
      this.search();
      this.search2();
  }

  search = (searchInput = this.onChangeCity1) => {
    if (searchInput !== "") {
    const url = `https://docs.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&radius=1000&city=${searchInput}&order_by=lastUpdated&dumpRaw=false`;
    fetch(url)
      .then(results => {
        const responseData = results.json();

        if (!results.ok) {
          const error = (responseData && responseData.message) || results.statusText;
          return Promise.reject(error);
        }
        return responseData;
      })
      .then((data) => {
          let cities = data.results.map((cit) => {
              return(
                <Header>
                  <p key={cit.country}> Country: {cit.country}</p>
                  <p key={cit.city}> City: {cit.city}</p>
                  <p key={cit.measurements}>
                    { cit.measurements.map((measurementData) => {
                        return (
                            <p>
                                <p key={measurementData.parameter}> Parameter: {measurementData.parameter}</p>
                                <p key={measurementData.value}> Value (Unit): {measurementData.value} {measurementData.unit}</p>
                                <p key={measurementData.lastUpdated}> Last Updated: {measurementData.lastUpdated}</p>
                            </p>
                        )
                    }) }
                  </p>
                </Header>
              )
          })
        this.setState({ cities1: cities });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.log("Search1" + error);
      });
    } else {
      return;
    }
  }

  search2 = (searchInput = this.onChangeCity2) => {
    if (searchInput !== "") {
    const url = `https://docs.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&radius=1000&city=${searchInput}&order_by=lastUpdated&dumpRaw=false`;
    fetch(url)
      .then(results => {
        return results.json();
      })
      .then((data) => {
          let cities = data.results.map((cit) => {
              return(
                <Header>
                  <p key={cit.country}> Country: {cit.country}</p>
                  <p key={cit.city}> City: {cit.city}</p>
                  <p key={cit.measurements}>
                    { cit.measurements.map((measurementData) => {
                        return (
                            <p>
                                <p key={measurementData.parameter}> Parameter: {measurementData.parameter}</p>
                                <p key={measurementData.value}> Value (Unit): {measurementData.value} {measurementData.unit}</p>
                                <p key={measurementData.lastUpdated}> Last Updated: {measurementData.lastUpdated}</p>
                            </p>
                        )
                    }) }
                  </p>
                </Header>
              )
          })
        this.setState({ cities2: cities });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.log("Search2" + error);
      });
    } else {
      return;
    }
  }

  render() {
    return (
      <Container className="App">
        <Header as="h1" className="App-header">
          Air Quality Assessment Tool
        </Header>
        <Header as="h3" className="App-header">
          Search for two cities to compare the air quality
        </Header>
        <Grid style={styles.gridStyle}>
          <Grid.Row columns={2} style={styles.gridRowStyle}>
            <Grid.Column width={8} style={styles.gridColumnStyle}>
              <Search
                className="Search"
                placeholder="Search city..."
                icon={{ name: 'search', link: true }}
                style={styles.search}
                onSearchChange={this.onChangeCity1}
              />
              <p style={styles.displayStyle}>{this.state.cities1}</p>
            </Grid.Column>
            <Grid.Column width={8} style={styles.gridColumnStyle}>
              <Search
                className="Search"
                placeholder="Search city..."
                icon={{ name: 'search', link: true }}
                style={styles.search}
                onSearchChange={this.onChangeCity2}
              />
              <p style={styles.displayStyle}>{this.state.cities2}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const styles = {
    gridStyle: {
      'padding': '25px'
    },
    gridRowStyle: {
        'display': 'flex'
    },
    gridColumnStyle: {
        'alignItems': 'center'
    },
    search: {
        'padding': '10px',
        'display': 'flex',
        'flexDirection': 'column',
    },
    displayStyle: {
        'padding': '20px',
    }
};