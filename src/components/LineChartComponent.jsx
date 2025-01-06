import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { decodeToken } from '../utils/decodeToken';
import { processChartData } from '../utils/processChartData';
import axios from 'axios';
import '../styles/lineChart.css';
import { Form, FloatingLabel, Col } from 'react-bootstrap';
import {getCurrentQuarterData}  from '../utils/getQuarterly'

const LineChartComponent = () => {
    const [data, setData] = useState([]);
    const [recruiterId, setRecruiterId] = useState('');
    const [filterOption, setFilterOption] = useState('');  // State for filter option
    const [zone,setZone]  = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken && decodedToken.name) {
                setRecruiterId(decodedToken.userId);
            }
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
            const data = response.data;
            const flattenedData = data.map(candidate => ({
                ...candidate.common,
                ...candidate.infosys,
                ...candidate.jobDetails,
                ...candidate.wipro1,
                ...candidate.wipro2,
                ...candidate.accenture,
                _id: candidate._id,
            }));

            const recruiterData = flattenedData.filter((item) => item.recruiterId === recruiterId.toString());
            const QuarterlyData = getCurrentQuarterData(recruiterData);

            const joinedData = QuarterlyData.filter(item => item.joinedStatus === "joined");
            const  joinedValueData = joinedData.reduce((sum, item) => sum + +(item.billValue || 0), 0);
            const shortlistedData = QuarterlyData.filter(item => 
              item.interviewFinalStatus === "shortlisted" && item.joinedStatus !== "joined" && item.joinedStatus !== "dropped"
            );

            // Apply date filter based on filterOption
            const filteredData = applyDateFilter(recruiterData);
           
            const resultData = processChartData(filteredData);
            setData(resultData);
            
            if (joinedValueData >= 100000) {
              setZone("A");
          } else if (joinedValueData >= 60000) {
              setZone("B");
          } else if (shortlistedData.length >= 10 || joinedValueData < 60000 && joinedValueData != 0) {
              setZone("C");
          } else{
              setZone("D"); // Default or fallback zone if none of the conditions are met
          }
          

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Background color for Zone 
    const getBackgroundColor = (zone) => {
     
      if (zone == "A") {
        return 'green';
      } else if (zone == "B") {
        return 'blue';
      } 
      else if (zone == "C") {
        return 'orange';
      }else {
        return "red";
      }
    };

    // Apply date filter based on the selected option
    const applyDateFilter = (data) => {
      const now = new Date();
      let startDate;
  
      switch (filterOption) {
          case '1': // Current month
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
          case '2': // Previous month
              startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              break;
          case '3': // Last 6 months
              startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
              break;
          case '4': // Last 1 year
              startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
              break;
          default:
              startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Default to current month
              break;
      }
  
      const formattedStartDate = startDate.toISOString(); // Convert startDate to ISO format
  
      // Filter data by comparing ISO-formatted startDate with item.createdDate
      return data.filter(item => item.createdDate >= formattedStartDate);
  };
  
  
 
    // Fetch data whenever the recruiterId or filterOption changes
    useEffect(() => {
        if (recruiterId) {
            fetchData();
        }
    }, [recruiterId, filterOption]);

    const handleOnChange = (event) => {
        setFilterOption(event.target.value);
    };

    return (
        <div className='linegraph-main'>
            <div className="graphtop">
                <h5>Performance</h5>
                <div className='filteroption'>
                   <Col md={2}>
                         <h4 className='zone' style={{
            background: getBackgroundColor(zone),
          }}>Zone : <span>{zone}</span></h4>
                   </Col>
                    <Col md={2}>
                        <FloatingLabel controlId="floatingSelect" label="Month Wise">
                            <Form.Select aria-label="Floating label select example" onChange={handleOnChange}>
                               
                                <option value="1">Current Month</option>
                                <option value="2">Previous Month</option>
                                <option value="3">Last 6 Months</option>
                                <option value="4">Last 1 Year</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400} style={{ backgroundColor: "white" }}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis domain={[0, 8]} tickCount={8} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="scheduled" stroke="#8884d8" name="Scheduled" strokeWidth={2} />
                    <Line type="monotone" dataKey="attended" stroke="#82ca9d" name="Attended" strokeWidth={2} />
                    <Line type="monotone" dataKey="shortlisted" stroke="#ffc658" name="Shortlisted" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;
