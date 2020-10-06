import { Card, ComboBox, ComboBoxItem, FlexBox, FlexBoxAlignItems, FlexBoxDirection, FlexBoxJustifyContent } from '@ui5/webcomponents-react'

import React, { useState, useEffect } from 'react';
import { LineChart } from '@ui5/webcomponents-react-charts/lib/LineChart';

function Body() {
    const [country, setInputCountry] = useState("world wide");
    const [flexDir, setFlexDir] = useState("Row");
    const [countries, setCountries] = useState([]);
    const [dataset, setDataset] = useState([]);
    const [deathset, setDeathsDataset] = useState([]);
    const [recoveredset, setRecoveredDataset] = useState([]),
        [totalCasesChartDataset, setTotalCasesChartDataset] = useState([]);

    const handleComboBoxChange = (oEvent) => {
        setInputCountry(oEvent.target.value);
    };
    const buildChartData = (data, casesType) => {
        let chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };
    const buildAllCasesTypeChartData = (data) => {
        let chartData = [];
        for (let date in data.cases) {
            let newDataPoint = {
                date: date,
                cases: data["cases"][date],
                deaths: data["deaths"][date],
                recovered: data["recovered"][date]
            };
            chartData.push(newDataPoint);
        }
        return chartData;
    };
    useEffect(() => {
        console.log(window.innerWidth);
        window.innerWidth < 768 ? setFlexDir("Column") : setFlexDir("Column");
        
        console.log(flexDir);
    }, []);
    useEffect(() => {
        const getCountriesData = async () => {
            fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso3,
                    }));
                    countries.push({ name: "world wide", value: "worldwide" })
                    setCountries(countries);
                });
        };

        getCountriesData();
    }, []);
    useEffect(() => {
        const getCountriesData = async () => {
            const url = country === "world wide" ? "https://disease.sh/v3/covid-19/historical/all?lastdays=15" : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=15`
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    let casesChartData = country === "world wide" ? buildChartData(data, "cases") : buildChartData(data.timeline, "cases"),
                        deathsChartData = country === "world wide" ? buildChartData(data, "deaths") : buildChartData(data.timeline, "deaths"),
                        recoveredChartData = country === "world wide" ? buildChartData(data, "recovered") : buildChartData(data.timeline, "recovered"),
                        totalCasesChartData = country === "world wide" ? buildAllCasesTypeChartData(data) : buildAllCasesTypeChartData(data.timeline)
                    setDataset(casesChartData);
                    setDeathsDataset(deathsChartData);
                    setRecoveredDataset(recoveredChartData);
                    setTotalCasesChartDataset(totalCasesChartData);
                });
        };

        getCountriesData();
    }, [country])
    return (

        <div>
            <FlexBox style={{ width: "100%", margin: "1.5rem 0rem" }}
                FlexBoxDirection={flexDir}
                justifyContent={FlexBoxJustifyContent.Center}
                alignItems={FlexBoxAlignItems.Center} >
                <ComboBox placeholder="world wide" value={country} onChange={handleComboBoxChange} style={{ width: '50%' }}>
                    {/*  <ComboBoxItem text={country}/> */}
                    {countries.map((country) => (<ComboBoxItem text={country.name} key={country.value} />))}
                </ComboBox>
            </FlexBox>
            <Card heading={`Total Cases - ${country}`}
                style={{ width: "90%", margin: "0rem 3.5rem" }}>
                <LineChart
                    dimensions={[{ accessor: "date" }]}
                    measures={[{ accessor: "cases", label: "cases" },
                    { accessor: "deaths", label: "deaths" },
                    { accessor: "recovered", label: "recovered" }
                    ]}
                    dataset={totalCasesChartDataset}
                />
            </Card>
            <FlexBox
                style={{ width: '100%', height: '100vh' }}

                justifyContent={FlexBoxJustifyContent.SpaceAround}
                alignItems={FlexBoxAlignItems.Center}>
                <Card heading={`New Cases - ${country}`}
                    style={{ width: "30%" }}>
                    <LineChart
                        dimensions={[{ accessor: "x" }]}
                        measures={[{ accessor: "y", label: "No.of New Cases" }]}
                        dataset={dataset}
                    />

                </Card>

                <Card heading={`Deaths - ${country}`}
                    style={{ width: "30%" }}>

                    <LineChart
                        dimensions={[{ accessor: "x" }]}
                        measures={[{ accessor: "y", color: 'red', label: "No.of New Deaths" }]}
                        dataset={deathset}
                    />

                </Card>

                <Card heading={`Recovered - ${country}`}
                    style={{ width: "30%" }}>

                    <LineChart
                        dimensions={[{ accessor: "x" }]}
                        measures={[{ accessor: "y", color: 'green', label: "No.of New Recovered" }]}
                        dataset={recoveredset}
                    />

                </Card>

            </FlexBox>

        </div>
    )
}

export default Body
