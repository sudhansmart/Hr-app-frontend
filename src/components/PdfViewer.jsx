import React, { useState } from 'react';

function PdfViewer({pdfId}) {
 


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 

  return (
    <div className='d-flex justify-content-center'>
      {pdfId && (
        <iframe
          src={`http://localhost:5000/candidate/pdfs/${pdfId}`}
          width= '300'
           height='400'
          title="PDF"
        ></iframe>
      )}
     
    
    </div>
  );
}

export default PdfViewer;
