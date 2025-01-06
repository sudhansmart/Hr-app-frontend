import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/clientList.css';

function ClientList() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Adjust the number of rows per page as needed

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://103.38.50.152/nodejs/candidate/candidatesdata'
      );
      const data = response.data;

      // Flatten and process the data
      const flattenedData = data.map(candidate => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        ...candidate.other,
        _id: candidate._id,
        date: candidate.date,
      }));

      const groupedData = processClientData(flattenedData);
      setTableData(groupedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processClientData = (data) => {
    const clientMap = {};

    data.forEach((item) => {
      const clientName = item.clientName;
      const position = item.position || item.role;
      const status = item.status;
      const date = item.createdDate;

      if (!clientMap[clientName]) {
        clientMap[clientName] = {};
      }

      if (!clientMap[clientName][position]) {
        clientMap[clientName][position] = {
          startDate: date,
          shortlisted: 0,
          selected: 0,
          offers: 0,
          joined: 0,
          dates: {},
        };
      }

      const currentData = clientMap[clientName][position];

      if (date && (!currentData.startDate || new Date(date) < new Date(currentData.startDate))) {
        currentData.startDate = date;
      }

      if (item.interviewFinalStatus === 'shortlisted') currentData.shortlisted++;
      if (status === 'Selected') currentData.selected++;
      if (item.offerStatus === 'released') currentData.offers++;
      if (item.joinedStatus === 'Joined') currentData.joined++;

      if (date) {
        currentData.dates[date] = (currentData.dates[date] || 0) + 1;
      }
    });

    const result = [];
    Object.keys(clientMap).forEach((clientName) => {
      Object.keys(clientMap[clientName]).forEach((position) => {
        result.push({
          name: clientName,
          position,
          ...clientMap[clientName][position],
        });
      });
    });

    return result;
  };

  const calculateTotalProfiles = (dates) =>
    Object.values(dates).reduce((acc, val) => acc + val, 0);

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='clientlist-main'>
      <h4>Client-wise Data</h4>
      <div className="clientlist-table">
        <table className="clientlist-table">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>Client Name</th>
              <th>Position</th>
              <th>Total Profiles</th>
              <th>Shortlisted</th>
              <th>Selected</th>
              <th>Offer Received</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((data, index) => (
              <tr key={index}>
                <td>
                  {new Date(data.startDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
                <td>{data.name}</td>
                <td>{data.position}</td>
                <td>{calculateTotalProfiles(data.dates)}</td>
                <td>{data.shortlisted}</td>
                <td>{data.selected}</td>
                <td>{data.offers}</td>
                <td>{data.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pagination1 d-flex justify-content-center gap-2 m-5'>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active text-center' : 'text-center'}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ClientList;
