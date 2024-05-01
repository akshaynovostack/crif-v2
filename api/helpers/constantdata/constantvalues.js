exports.applicationStatusCode = { 
    //==== Application Status with their respective status_code
    'New' : 0, 
    'In Progress' : 5, 
    'Ready For Submission' : 10, 
    'Under Review' : 14, 
    'Approved By Student' : 18, 
    'Submitted to 3rd Party' : 20, 
    'Submitted to University' : 30, 
    'Application Rejected' : 40, 
    // 'Waitlisted' : 50,
    'Info required post submission' : 60,
    'Offer Received (Conditional)' : 70, 
    'Offer Received (Unconditional)' : 72, 
    'Offer Accepted' : 80, 
    'Deposit Made' : 90, 
    'Visa Application Completed' : 100, 
    'Visa Received' : 110,
    'Registered At University':120
}


// In Context of users,
// 21 - No Apps Submitted
// 25 - Few Apps Submitted
// 27 - Atleast One Submitted
// 30 - All Apps Submitted

exports.essayStatusToCode = { 
    //==== Essay Status with their respective status_code
    "Pending": 0,  
    "Questionnaire Filled": 10,
    "Student Draft Created": 20,
    "Draft In Progress": 30,
    "Under Student Review": 40,
    "Finalised": 50
}
exports.essayStatusCodeToName = { 
    //==== Essay Status codes with their respective status name
    0: "Pending",  
    10: "Questionnaire Filled",
    20: "Student Draft Created",
    30: "Draft In Progress",
    40: "Under Student Review",
    50: "Finalised"
}
