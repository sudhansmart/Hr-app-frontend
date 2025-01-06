import React, { useState, useEffect } from "react";
import "../styles/multiStepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHourglassHalf, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";

const MultiStepProgressBar = ({ filteredData }) => {
  const [page, setPage] = useState("pageone");
     console.log("stepBar :",filteredData)
  // Function to determine the current page based on the filtered data
  const determinePage = (data) => {
     console.log("data",data)
    if (data.interviewStatus === "attended") {
      setPage("pageone");
    }
    if (data.interviewFinalStatus === "shortlisted" || data.interviewFinalStatus === "rejected" || data.interviewFinalStatus === "hold") {
      setPage("pagetwo");
    }
    if (data.offerStatus === "yettorelease" || data.offerStatus === "released" ||data.interviewFinalStatus == "shortlisted") {
      setPage("pagethree");
    }
    if (data.offerStatus === "released" ) {
      setPage("pagefour");
    }
    if (data.joinedStatus === "joined" || data.joinedStatus === "drop" ) {
      setPage("pagefive");
    }
  };

 
  // Use useEffect to process the filtered data when it changes
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      // Assuming you want to determine the page based on the first item
      determinePage(filteredData[0]);
    }
  }, [filteredData]);

  // Calculate step percentage based on the current page
  const getStepPercentage = () => {
    switch (page) {
      case "pageone":
        return 0;
      case "pagetwo":
        return 25;
      case "pagethree":
        return 52.5;
      case "pagefour":
        return 75;
      case "pagefive":
        return 100;
      default:
        return 0;
    }
  };

  

  return (
    <ProgressBar percent={getStepPercentage()}>
      <Step>
        {({ accomplished }) => (
          <div className="step-container">
            <div
                 className={`indexedStep ${accomplished ? (filteredData[0]?.interviewStatus !== "attended"  ? "xmark-background" : "accomplished") : ""}`}
                 >

              {accomplished ? (
               filteredData[0].interviewStatus == "attended" ? <FontAwesomeIcon icon={faCheck} />: <FontAwesomeIcon  icon={faXmark} />
              ) : (
                <FontAwesomeIcon icon={faMinus} />
              )}
            </div>
            <div className="step-label">Interview Attended</div>
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished }) => (
          <div className="step-container">
            <div
  className={`indexedStep ${accomplished ? (filteredData[0]?.interviewFinalStatus !== "shortlisted"  ? "xmark-background" : "accomplished") : ""}`}
>

              {accomplished ? (
                filteredData[0].interviewFinalStatus === "shortlisted" ? <FontAwesomeIcon icon={faCheck} />: <FontAwesomeIcon  icon={faXmark} />
              ) : (
                <FontAwesomeIcon icon={faMinus} />
              )}
            </div>
            <div className="step-label">Shortlisted</div>
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished }) => (
          <div className="step-container">
            <div
               className={`indexedStep ${accomplished ? ( filteredData[0]?.offerStatus  === "released"|| filteredData[0]?.offerStatus === "yettorelease" || filteredData[0]?.offerStatus === "hold" ? "accomplished" : "xmark-background") : ""}`}
             >

              {accomplished ? (
                 filteredData[0]?.offerStatus === "released" ||filteredData[0]?.offerStatus === "yettorelease"  || filteredData[0]?.offerStatus === "hold" ? <FontAwesomeIcon icon={faCheck} />: <FontAwesomeIcon  icon={faXmark} />
              ) : (
                <FontAwesomeIcon icon={faMinus} />
              )}
            </div>
            <div className="step-label">Selected</div>
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished }) => (
          <div className="step-container">
            <div
              className={`indexedStep ${accomplished ? ( filteredData[0]?.offerStatus  === "hold" ? "hold-background" : "accomplished") : ""}`}
            >

              {accomplished ? (
              filteredData[0]?.offerStatus !== "hold" ? <FontAwesomeIcon icon={faCheck} />  :<FontAwesomeIcon icon={faHourglassHalf} />
              ) : (
                <FontAwesomeIcon icon={faMinus} />
              )}
            </div>
            <div className="step-label">{filteredData[0]?.offerStatus == "hold" ? "Hold" : "Offered"}</div>
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished }) => (
          <div className="step-container">
            <div
               className={`indexedStep ${accomplished ? (filteredData[0]?.interviewFinalStatus !== "shortlisted" || filteredData[0]?.joinedStatus !== "joined" ? "xmark-background" : "accomplished") : ""}`}
             >

              {accomplished ? (
               filteredData[0].joinedStatus ==="joined" ?  <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon  icon={faXmark} />
              ) : ( 
                <FontAwesomeIcon icon={faMinus} />
              )}
            </div>
            <div className="step-label">{filteredData[0].joinedStatus ==="drop" ? "Dropped" : "joined" } </div>
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
