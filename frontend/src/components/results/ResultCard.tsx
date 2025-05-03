import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ResultCardProps {
  student: {
    seat_number: string;
    student_name: string;
    mother_name: string;
    division: string;
    marathi: number;
    hindi: number;
    english: number;
    mathematics: number;
    science: number;
    social_science: number;
    additional_marks: number;
    total_marks: number;
    percentage: number;
    pdf_url: string;
    result_status: string;
  };
}

function getResultHTML(student: ResultCardProps['student']) {

  let html = `
	<!DOCTYPE html>
    <html lang="en"><head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="">
	<meta name="author" content="">
	<title>SSC Result 2025::MSBSHSE, PUNE</title>
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="/bootstrap.min.css" />
    <link rel="stylesheet" href="/main.css" />
  </head>
  <body>
	<div class="container">
		<div id="header" class="header">
		  <div class="row">
			  <div id="imglogo" class="col-sm-2" style="margin-top: -3%;">
				  <div class="card border-0">
					  <div class="card-body">
						  <img src="/mahastateedu.gif" alt="Logo" />
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
   
		  <div id="examresicon" style=" margin-top:-4%;" class="btb col-sm-12 row"><a class="col-3" href="http://results.gov.in" target="_blank"><img src="/icon01.gif" alt="Icon" /></a>
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
										  Examination March- 2025 RESULT</a></li>
   
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
	<div id="hscexamdiv" style=" margin-top:4%;"><center><strong>SSC Examination March- 2025 RESULT</strong></center></div>
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
		window.onload = function() {
			const printbtn = document.getElementById('print');
			if(printbtn) {
				printbtn.addEventListener('click', function() {
					window.print();
				});
			}
		}
	</script>
	<script src="../js/jquery.min.js"></script>
	<script src="../js/bootstrap.min.js"></script>
  
</font></div></div></div></div></div></div></body></html>
  `;
  return html;
};

const ResultCard = ({ student }: ResultCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleDownload = () => {
    setIsOpening(true);
    try {
      // Get the HTML content
      const htmlContent = getResultHTML(student);
      
      // Open in new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error opening result:', error);
    } finally {
      setIsOpening(false);
    }
  };

  const subjects = [
    { name: 'Marathi', marks: student.marathi },
    { name: 'Hindi', marks: student.hindi },
    { name: 'English', marks: student.english },
    { name: 'Mathematics', marks: student.mathematics },
    { name: 'Science', marks: student.science },
    { name: 'Social Science', marks: student.social_science }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="space-y-2">
            <p className="text-gray-600 text-sm md:text-base">
              <span className="font-medium">Seat Number:</span> {student.seat_number}
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              <span className="font-medium">Name:</span> {student.student_name}
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              <span className="font-medium">Mother's Name:</span> {student.mother_name}
            </p>
          </div>
          <div className="mt-4 md:mt-0 p-4 bg-gray-50 rounded-lg">
            <p className="text-base md:text-lg font-medium">
              Total: <span className="font-bold">
                {student.total_marks}
                {student.additional_marks > 0 && 
                  <span className="text-green-600">{`+${student.additional_marks}`}</span>
                }
                /500
              </span>
            </p>
            <p className="text-base md:text-lg font-medium">
              Percentage: <span className="font-bold">{student.percentage}%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className="text-base md:text-lg order-2 sm:order-1">
            Status: <span className={`font-bold ${
              student.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'
            }`}>
              {student.result_status}
            </span>
          </p>
          <div className="flex flex-wrap gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 sm:flex-none"
            >
              <Eye size={16} className="mr-1" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleDownload}
              disabled={isOpening}
              className="flex-1 sm:flex-none"
            >
              <Download size={16} className="mr-1" />
              {isOpening ? 'Opening...' : 'Download Result'}
            </Button>
          </div>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Subject Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-sm md:text-base">{subject.name}</span>
                    <div className="flex items-center">
                      <div className="w-1 h-8 mr-3 rounded-full" 
                        style={{
                          backgroundColor: 
                            subject.marks >= 75 ? '#10B981' :
                            subject.marks >= 60 ? '#60A5FA' :
                            subject.marks >= 35 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                      <span className="font-bold text-sm md:text-base">{subject.marks}/100</span>
                    </div>
                  </div>
                ))}
                {student.additional_marks > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <span className="font-medium text-sm md:text-base">Additional Marks</span>
                    <span className="font-bold text-sm md:text-base text-green-600">
                      +{student.additional_marks}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default ResultCard;