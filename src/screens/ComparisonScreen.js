import React, { Component } from 'react';
import { Container, Header, Grid, Search, Card } from 'semantic-ui-react';

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

  //input value from first search
  onChangeCity1 = (e) => {
    this.setState({
      cityValue: e.target.value,
    });
    this.search(e.target.value);
  };

  //input value from the second search
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

  //render card information returned from the api and display in in the grid (cities1)
  search = (searchInput = this.onChangeCity1) => {
    if (typeof searchInput === 'string' && searchInput !== "") {
    const url = `https://docs.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&radius=1000&city=${searchInput}&order_by=lastUpdated&dumpRaw=false`;
    fetch(url)
      .then(results => {
        //display any error and test if the code is not 200, i.e: 500 Internal Server Error
        if (!results.ok && results.status !== 200) {
          const error = results.status + results.statusText;
          throw Error(error);
        } else {
        return results.json();
        }
      })
      .then((data) => {
          let cities = data.results.map((cit) => {
              return(
                <Card style={styles.cardStyle}>
                  <div key={cit.country}> Country: {cit.country}</div>
                  <br/>
                  <div key={cit.city}> City: {cit.city}</div>
                  <br/>
                  <div key={cit.measurements}>
                    { cit.measurements.map((measurementData) => {
                        return (
                            <div>
                                <p key={measurementData.parameter}> Parameter: {measurementData.parameter}</p>
                                <p key={measurementData.value}> Value (Unit): {measurementData.value} {measurementData.unit}</p>
                                <p key={measurementData.lastUpdated}> Last Updated: {measurementData.lastUpdated}</p>
                            </div>
                        )
                    }) }
                  </div>
                </Card>
              )
          })
        this.setState({ cities1: cities });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.log("Search1" + error);
        alert(error);
      });
    } else {
      return;
    }
  }

  // render card information for second search bar to not display the returned api in the first grid as well (cities2)
  search2 = (searchInput = this.onChangeCity2) => {
    if (typeof searchInput === 'string' && searchInput !== "") {
    const url = `https://docs.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&radius=1000&city=${searchInput}&order_by=lastUpdated&dumpRaw=false`;
    fetch(url)
      .then(results => {
        //display any error and test if the code is not 200, i.e: 500 Internal Server Error
        if (!results.ok && results.status !== 200) {
          const error = results.status + results.statusText;
          throw Error(error);
        } else {
        return results.json();
        }
      })
      .then((data) => {
          let cities = data.results.map((info) => {
              return(
                <Card style={styles.cardStyle}>
                  <div key={info.country}> Country: {info.country}</div>
                  <br/>
                  <div key={info.city}> City: {info.city}</div>
                  <br/>
                  <div key={info.measurements}>
                    { info.measurements.map((measurementDataInfo) => {
                        return (
                            <div>
                                <p key={measurementDataInfo.parameter}> Parameter: {measurementDataInfo.parameter}</p>
                                <p key={measurementDataInfo.value}> Value (Unit): {measurementDataInfo.value} {measurementDataInfo.unit}</p>
                                <p key={measurementDataInfo.lastUpdated}> Last Updated: {measurementDataInfo.lastUpdated}</p>
                            </div>
                        )
                    }) }
                  </div>
                </Card>
              )
          })
        this.setState({ cities2: cities });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.log("Search2" + error);
        alert(error);
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
              <div style={styles.displayStyle}>{this.state.cities1}</div>
            </Grid.Column>
            <Grid.Column width={8} style={styles.gridColumnStyle}>
              <Search
                className="Search"
                placeholder="Search city..."
                icon={{ name: 'search', link: true }}
                style={styles.search}
                onSearchChange={this.onChangeCity2}
              />
              <div style={styles.displayStyle}>{this.state.cities2}</div>
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
    cardStyle: {
      'padding': '10px',
      'width': '580px',
      'boxShadow': '0 4px 8px 0 rgba(0,0,0,0.3)'
    },
    displayStyle: {
      'padding': '20px',
      'fontSize': '18px'
    }
};