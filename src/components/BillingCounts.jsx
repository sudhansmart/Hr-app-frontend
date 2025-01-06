import React, { useState,useEffect } from 'react'
import '../styles/billingCounts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines,faHandHoldingDollar,faThumbsDown,faIndianRupeeSign} from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import axios from 'axios';

function BillingCounts() {
      const[yettoraiseData,setYetToRaiseData]= useState([]);
      const [yettoraisevalue, setYetToRaiseValue] = useState(0);
      const [raisedData, setRaisedData] = useState([]);
      const [raisedvalue, setRaisedValue] = useState(0);
      const [receivedData, setReceivedData] = useState([]);
      const [receivedvalue, setReceivedValue] = useState(0);
      const [dropData, setDropData] = useState([]);
      const [dropvalue, setDropValue] = useState(0);
    
       
      const fetchAllData = async () => {
            try {
              const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
            //   const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
        
              const data = response.data;
        
              // Flatten the nested data if necessary
              const flattenedData = data.map(candidate => ({
                ...candidate.common,
                ...candidate.infosys,
                ...candidate.jobDetails,
                ...candidate.wipro1,
                ...candidate.wipro2,
                ...candidate.accenture,
                ...candidate.other,
                _id: candidate._id, // Ensure _id is preserved
              }));     
               
               const yettoraiseData =  flattenedData.filter(item => item.billingStatus === "yettoraise");
               const yettoraisevalue = yettoraiseData.reduce((sum, item) => sum + +(item.billValue || 0), 0);
               const raisedData = flattenedData.filter(item => item.billingStatus === "raised" &&  item.raisedStatus !== "received" && item.raisedStatus !== "drop");
               const raisedvalue = raisedData.reduce((sum, item) => sum + +(item.receivableAmount || 0), 0);
               const receivedData = flattenedData.filter(item => item.raisedStatus === "received" );
               const receivedvalue = receivedData.reduce((sum, item) => sum + +(item.receivableAmount || 0), 0);
               const dropData = flattenedData.filter(item => item.raisedStatus === "drop");
               const dropvalue = dropData.reduce((sum, item) => sum + +(item.billValue || 0), 0);
               
             

               setYetToRaiseData(yettoraiseData);
               setYetToRaiseValue(yettoraisevalue);
               setRaisedData(raisedData);
               setRaisedValue(raisedvalue);
               setReceivedData(receivedData);
               setReceivedValue(receivedvalue);
               setDropData(dropData);
               setDropValue(dropvalue);


              
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
        
          useEffect(() => {
            fetchAllData();
          }, []);



  return (
    <div className='billingcounts-main'>
          <div className="billingcover">
             <div className="billing-title">
                    <p>Yet to be Raise</p> 
                    <div className="icon-cover1">
                          <FontAwesomeIcon icon={faFileLines} />
                    </div> 
                </div>  
                <div className="billingnumbers">
                      <p className='files'>{yettoraiseData.length}</p>
                      <p className='rupees'><FontAwesomeIcon icon={faIndianRupeeSign} /> {yettoraisevalue}</p>
                    </div>   
          </div>
          <div className="billingcover">
              <div className="billing-title">
                      <p>Raised</p>
                      <div className="icon-cover2">
                          <FontAwesomeIcon icon={faCircleCheck} />
                      </div>
                </div> 
                <div className="billingnumbers">
                      <p className='files'>{raisedData.length}</p>
                      <p className='rupees'><FontAwesomeIcon icon={faIndianRupeeSign} /> {raisedvalue}</p>
                    </div>   
                      
          </div>
          <div className="billingcover">
                <div className="billing-title">
                    <p>Received</p>
                    <div className="icon-cover3">
                        <FontAwesomeIcon icon={faHandHoldingDollar} />
                    </div>
                </div>  
                <div className="billingnumbers">
                      <p className='files'>{receivedData.length}</p>
                      <p className='rupees'><FontAwesomeIcon icon={faIndianRupeeSign} /> {receivedvalue}</p>
                    </div>          
          </div>
          <div className="billingcover">
                <div className="billing-title">
                    <p>Drops</p>
                    <div className="icon-cover4">
                    <FontAwesomeIcon icon={faThumbsDown} />
                    </div>
                </div> 
                <div className="billingnumbers">
                      <p className='files'>{dropData.length}</p>
                      <p className='rupees'><FontAwesomeIcon icon={faIndianRupeeSign} /> {dropvalue}</p>
                    </div>           
          </div>
    </div>
  )
}

export default BillingCounts