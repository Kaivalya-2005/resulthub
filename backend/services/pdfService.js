const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const db = require('../models/db');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,  // Your Google Cloud Project ID
    keyFilename: process.env.GCP_KEY_FILE   // Path to your service account key file
});

const bucketName = process.env.GCP_BUCKET_NAME; // Your GCS bucket name
const bucket = storage.bucket(bucketName);

// Function to generate the PDF using Puppeteer 
const generatePDF = async (student) => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	const bootstrapCSS = fs.readFileSync(path.resolve(__dirname, '../public/css/bootstrap.min.css'), 'utf-8');
    const mainCSS = fs.readFileSync(path.resolve(__dirname, '../public/css/main.css'), 'utf-8');

 // HTML Template with student data
  let html = `
	<!DOCTYPE html>
    <html lang="en"><head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="">
	<meta name="author" content="">
	<title>SSC Result 2024::MSBSHSE, PUNE</title>
	<!-- Bootstrap core CSS -->
	<style>
		${bootstrapCSS}
		${mainCSS}
	</style>

  </head>
  <body>
	<div class="container">
		<div id="header" class="header">
		  <div class="row">
			  <div id="imglogo" class="col-sm-2" style="margin-top: -3%;">
				  <div class="card border-0">
					  <div class="card-body">
						  <img src="data:image/gif;base64,${await getBase64Image('../public/img/mahastateedu.gif')}"/>
					  </div>
				  </div>
			  </div>
			  <div id="mhboardbanner" class="col-sm-10" style=" margin-top:-3%;">
				  <div id="mhboardbannerin" class="card border-0">
					  <div class="card-body">
						  <div style="padding-left: 5%; margin-top:1%;" class="logo col-lg-10 col-md-10 col-sm-10">
							  <p style="font-size:1.05em;">MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY
								  EDUCATION, PUNE</p>
   
						  </div>
						  <div id="mhboardbannerin1" style="padding-left: 5%; margin-top:-6%;" class="logo col-lg-10 col-md-10 col-sm-10">
							  <p style="font-size:1em;"><b>SSC Examination March- 2025 RESULT</b></p>
						  </div>
					  </div>
				  </div>
			  </div>
		  </div>
   
		  <div id="examresicon" style=" margin-top:-4%;" class="btb col-sm-12 row"><a class="col-3" href="http://results.gov.in" target="_blank"><img src="data:image/gif;base64,${await getBase64Image('../public/img/icon01.gif')}"/></a>
			  <div class="col-9 float-end ">
				  <p style="font-size:.85em;">Brought to you by: <a style="text-decoration: none" href="http://www.nic.in/">NATIONAL INFORMATICS
						  CENTRE</a></p>
			  </div>
		  </div>	
   
		  <nav id="togglenav" style=" margin-top:-3%;" class="navbar navbar-expand-lg navbar-light justify-content-center">
			  <div>
   
			   <div class="navheader-div order-0">
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
					 <span class="navbar-toggler-icon"></span>
				   </button>
				 </div>
   
				  <div class="collapse navbar-collapse" id="navbarSupportedContent">
					  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
						  <li class="nav-item">
							  <a class="nav-link active" aria-current="page" href="../default.htm">Home</a>
						  </li>
   
   
						  <li class="nav-item dropdown">
							  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								  RESULTS
							  </a>
							  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
								  <li><a class="dropdown-item " aria-current="page" href="sscmarch2024.htm">SSC
										  Examination March- 2024 RESULT</a></li>
   
							  </ul>
						  </li>
						  <li class="nav-item">
							  <a class="nav-link active" href="../disclaimer.htm" aria-current="page">Disclaimer</a>
						  </li>
					  </ul>
				  </div>
			  </div>
		  </nav>
   
   
   
			</div><!-- /.container-fluid -->
		  
		</div>

<!-- started code -->


 <div style=" margin-top:-1%;" class="cont container">
	<div id="hscexamdiv" style=" margin-top:4%;"><center><strong>SSC Examination March- 2024 RESULT</strong></center></div>
	<div id="movup" class="row">
		<div class="col-sm-12">
			<div class="card border-0">
				<div class="card-body">
					<div class="cont container" id="container">
						<div class="row">
							<div style=" margin-top:-13%;" id="cardbody" class="col-sm-10">
								<div id="res" style="background: transparent;" class="card border-0">
									<div style=" margin-top:-1.5%;" class="card-body">
										  <p style="text-align: left; margin-left:-5%;margin-top: 1em ;
										  "><b>Candidate Name</b>: &nbsp;
                                          ${student.student_name}
										  </p>
										  <p style="text-align: left; margin-left:-5%;margin-top: -0.8em ;
										  "><b>Mother's Name</b>: &nbsp; 
                                          ${student.mother_name}
										  </p>
										  <div id="movright">
										  <p style="text-align: left; margin-left:-5%;margin-top: -0.8em ;
										  "><b>Seat Number</b>: &nbsp; 
                                          ${student.seat_number}
										  </p>
										  <p style="text-align: left; margin-left:-5%;margin-top: -0.8em ;
										  "><b>Division</b>: &nbsp; 
                                          ${student.division}
										  </p>
										  </div>
									</div>
								</div>
							</div>
							<div id="printdiv" class="col-sm-2">
								<div style="background: transparent;" class="card border-0">
									<div class="card-body">
										<div style="float:right;" class="hidden-xs col-sm-4 hidden-print">
											<button type="button" id="print" class="btn btn-primary btn-sm pull-right"><span class="glyphicon glyphicon-print"></span> Print</button>
										  </div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div id="table">
		<table class="table table-striped table-bordered table-hover">
		   
			 <thead>
			<tr>
			  <th>Subjects Code</th>
			  <th>Subject Name</th>
			  <th colspan="2">Marks Obtained</th>
			</tr>
		  </thead>
		  <tbody>
			<tr>
			
			  <td>01</td>
			  <td>MARATHI (1ST LANG)</td>
			  <td colspan="2">${student.marathi < 10 ? '00' + student.marathi : (student.marathi < 100 ? '0' + student.marathi : student.marathi)}</td>
			</tr>
			
			<tr>
			   <td>15</td>
			  <td>HINDI (2/3 LANG)</td>
              <td colspan="2">${student.hindi < 10 ? '00' + student.hindi : (student.hindi < 100 ? '0' + student.hindi : student.hindi)}</td>
			</tr>
			
			<tr>
			 <td>17</td>
				<td>ENGLISH (2/3 LANG)</td>
                <td colspan="2">${student.english < 10 ? '00' + student.english : (student.english < 100 ? '0' + student.english : student.english)}</td>
			</tr>
			
			<tr>
			 <td>71</td>
			  <td>MATHEMATICS</td>
              <td colspan="2">${student.mathematics < 10 ? '00' + student.mathematics : (student.mathematics < 100 ? '0' + student.mathematics : student.mathematics)}</td>
			</tr>
			
			<tr>
			 <td>72</td>
			  <td>SCIENCE &amp; TECHNOLOGY</td>
              <td colspan="2">${student.science < 10 ? '00' + student.science : (student.science < 100 ? '0' + student.science : student.science)}</td>
			</tr>
			
			<tr>
			 <td>73</td>
			  <td>SOCIAL SCIENCES</td>
              <td colspan="2">${student.social_science < 10 ? '00' + student.social_science : (student.social_science < 100 ? '0' + student.social_science : student.social_science)}</td>
			</tr>
					
			
			<tr class="success" >
			<td>£&nbsp;Percentage</td>
			<td>£&nbsp;${student.percentage < 10.00 ? '00' + student.percentage : (student.percentage < 100.00 ? '0' + student.percentage : student.percentage)}</td></td>
			<td style="text-align:left"><b>Total Marks</b></td>
			<td>
			
			
			
			    <!-- 470&#43;07&nbsp;$  -->
				
				<!--HERE add this code for handling *-sign cases, as Total and sport are NULL in these 22/07/2020 -->
				$&nbsp;${student.total_marks < 10 ? '00' + student.total_marks : (student.total_marks < 100 ? '0' + student.total_marks : student.total_marks)}+${student.additional_marks < 10 ? '0' + student.additional_marks : student.additional_marks}
		
			</td>
		</tr>
		
		
			<tr class="success">
			<td>Result</td>
			<td>${student.result_status}</td>
		<!--    <td  style="text-align:left"><b>Out of</b></td>
			<td  style="text-align:left"><b>500</b></td> -->
			 <td style="text-align:left"><b>Out of</b></td>
			 <td style="text-align:left"><b>500</b></td>
			 
			</tr>
			
			<tr class="danger">
			  <td colspan="4" style="text-align:center;font-style:italic">$ - Additional sport/art marks.</td>
				  </tr>
			
			<tr><td colspan="4">£-Indicates total 
			  marks and Percentage calculated on the basis of "Best of 5" 
			  criteria</td></tr>
		  </tbody>
		</table>



<div style="margin-top: -.5em;" id="notdisplay">
	<p style="margin-top: 0.5em" align="justify"><font face="Times New Roman" size="1"> <b>Disclaimer</b>
	Neither NIC nor Maharashtra State Board of Secondary and Higher Secondary 
	Education, Pune is responsible for any inadvertent error that may have 
	crept in the results being published online. The results published on 
	net are for immediate information only. These cannot be treated as original 
	statement of mark,please verify the information from original statement 
	of marks issued by the Board separately and available at the time of declaration 
	with the respective School.</font> </p>
	<p style="margin-top: -1em ;margin-bottom: 0.5em ;" align="justify"><font face="Times New Roman" size="1"> <b>Note for CIS candidates</b>
		It is obligatory for candidates admitted for class improvement to give their option
		within one month from the date on which marklists have been distributed.After that
		the board marklist with option will be given within the period of six months after
		paying extra charges.If no application with option is received within 6 months the
		class improvement performance will be considered as "Cancelled" and previous
		performance will be taken into account by divisional board.</font></p>
	
		<div style="margin-top:2.2em"><center><font face="Times New Roman" size="2">Hosted By National 
	Informatics Centre (NIC). Data Provided By MSBSHSE, Pune</font></center><font face="Times New Roman" size="2"> </font></div><font face="Times New Roman" size="2">
  </font></div><font face="Times New Roman" size="2">
	  <script>
		const printbtn=document.getElementById('print');
		printbtn.addEventListener('click',function()
		{
			print();
		}
		);
		
	</script>
	<script src="../js/jquery.min.js"></script>
	<script src="../js/bootstrap.min.js"></script>
  
</font></div></div></div></div></div></div></body></html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

//   // Generate PDF as buffer
//   const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: {
//     top: '20px',
//     bottom: '20px',
//     left: '20px',
//     right: '20px',
//   }});

    // Generate PDF
    await page.pdf({
        path: `./results/${student.seat_number}_result.pdf`,
        format: 'A4',
        printBackground: true,
    });
// Helper function to convert an image to base64
async function getBase64Image(imgPath) {
    const fs = require('fs');
    const path = require('path');
    const imagePath = path.resolve(__dirname, imgPath);
    const image = fs.readFileSync(imagePath);
    return image.toString('base64');
}
  await browser.close();
  return pdfBuffer; // return buffer instead of saving to disk	
};

// Function to upload PDF to Google Cloud Storage
const uploadToGCS = async (pdfBuffer, studentName) => {
	try {
	  // Sanitize studentName (optional)
	  const safeStudentName = studentName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
	  
	  const fileName = `pdfs/${safeStudentName}-${Date.now()}.pdf`; // Unique and safe file name
	  const file = bucket.file(fileName);
  
	  const writeStream = file.createWriteStream({
		resumable: false,
		contentType: 'application/pdf',
	  });
  
	  return new Promise((resolve, reject) => {
		writeStream.end(pdfBuffer);
  
		writeStream.on('finish', async () => {
		  try {
			// Generate a signed URL that expires in 30 days
			const signedUrl = await file.getSignedUrl({
			  action: 'read',
			  expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
			});
			resolve(signedUrl[0]);  // Return the signed URL
		  } catch (error) {
			reject(error);
		  }
		});
  
		writeStream.on('error', (err) => {
		  reject(err);
		});
	  });
	} catch (error) {
	  throw error;
	}
};
  

// Function to update the PDF URL in the database
const updatePDFUrlInDb = async (seatNumber, pdfUrl) => {
  try {
    await db.query('UPDATE student_results SET pdf_url = ? WHERE seat_number = ?', [pdfUrl, seatNumber]);
    console.log(`PDF URL updated for ${seatNumber}`);
  } catch (error) {
    console.error(`Error updating PDF URL for ${seatNumber}:`, error.message);
  }
};

// Main function to generate PDF for all students and upload them
const generateAndStorePDFs = async () => {
	try {
	  //const [students] = await db.query('SELECT * FROM student_results');
	  const [students] = await db.query(`
		SELECT * 
		FROM student_results 
		WHERE total_marks IS NOT NULL AND pdf_url IS NULL
	  `);
	
	  if (students.length === 0) {
		console.log('✅ All student results already fetched.');
		return;
	  }
	  // If you expect a large number of students, consider processing in batches.
	  for (let student of students) {
		try {
		  const pdfBuffer = await generatePDF(student); // Generate PDF buffer for the student
		  const pdfUrl = await uploadToGCS(pdfBuffer, student.student_name); // Upload PDF to GCS

		  if (pdfUrl) {
			await updatePDFUrlInDb(student.seat_number, pdfUrl); // Update the URL in the database
		  }
		} catch (error) {
		  console.error(`Error processing student ${student.seat_number}:`, error.message);
		  // Optionally, log the error stack for more detailed debugging
		}
	  }
	} catch (error) {
	  console.error('Error fetching students from database:', error.message);
	}
};

module.exports = { generateAndStorePDFs };
