// login function

function initLogin() {
  var email = $("#email_id").val();
  var pass = $("#password").val();

  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }

  xmlhttp1.open("POST", baseurl + "/authentication/getGenericJWTToken", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader("clientID", clientId);
  xmlhttp1.onreadystatechange = function () {
    //if(this.status==200 && this.responseText!=null && this.responseText !="" && this.readystate==4)
    if (
      this.status == 200 &&
      this.readyState == 4 &&
      this.responseText != "" &&
      this.responseText != null
    ) {
      var res = JSON.parse(this.responseText);
      if (res.token != "Invalid User or Password / Or Account Locked") {
        localStorage.setItem("token", res.token);
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/index.html";
      } else {
        $("#error_message").show();
        $("#error_message").html(
          "<strong>Invalid User or Password / Or Account Locked</strong>"
        );
      }
    }
  };
  xmlhttp1.send(
    JSON.stringify({
      username: email,
      password: pass,
    })
  );
}

function getUserInfo() {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open("GET", baseurl + "/helpdeskcc/getuserinfo", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);
      localStorage.setItem(
        "agentname",
        response.firstName + " " + response.lastName
      );
      localStorage.setItem("agentemail", response.emailId);
      var user = document.getElementById("profile_name");
      user.innerHTML = localStorage.getItem("agentname");
    } else if (
      (this.status == 403 ||
        this.status == 401 ||
        this.status == 501 ||
        this.status == 503 ||
        this.status == 500) &&
      this.readyState == 4
    ) {
      window.location.href =
        window.location.protocol +
        "//" +
        window.location.host +
        "/customerCare_login.html";
    }
  };

  xmlhttp1.send();
}
// login end

function getNewTickets() {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open("GET", baseurl + "/helpdeskcc" + "/getNewTickets", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);
      var name = localStorage.getItem("agentname");
      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("newHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert">' + response[i].ticketNumber + "</td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td> <input type="button" value="Assign to me" onclick="assignToMe(\'' +
                response[i].ticketNumber +
                "','" +
                name +
                "')\"></td>";
            } else {
              tableData +=
                "<tr id = " +
                response[i].ticketNumber +
                ' class = "rem1' +
                [i] +
                ' odd">';
              tableData +=
                '<td class="invert">' + response[i].ticketNumber + "</td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td> <input type="button" value="Assign to me" onclick="assignToMe(\'' +
                response[i].ticketNumber +
                "','" +
                name +
                "')\"></td>";
            }
          }
          document.getElementById("newTickets").innerHTML = tableData;
        } else {
          document.getElementById("newHead").style.display = "none";
          document.getElementById("newTickets").style.textAlign = "center";
          document.getElementById("newTickets").innerHTML =
            "NO NEW TICKETS YET";
        }
      }
    }
  };
  xmlhttp1.send();
}

// //replace document below with enclosing container but below will work too
// $(document).on('onclick', function fun() {
//   alert("jai mata di");
//   //  alert("Ticket Number -" + response[i].ticketNumber + " is assinging to you, Press OK to countinue!");
// });

function getOpenTickets() {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open("GET", baseurl + "/helpdeskcc" + "/getOpenTickets", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);

      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("openHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            } else {
              tableData += "<tr" + ' class = "rem1 odd">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            }
          }
          document.getElementById("openTickets").innerHTML = tableData;
        } else {
          document.getElementById("openHead").style.display = "none";
          document.getElementById("openTickets").style.textAlign = "center";
          document.getElementById("openTickets").innerHTML =
            "NO OPEN TICKETS YET";
        }
      }
    }
  };
  xmlhttp1.send();
}

function getAnsweredTickets() {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open("GET", baseurl + "/helpdeskcc" + "/getAnsweredTickets", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);

      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("answerHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            } else {
              tableData +=
                "<tr id = " +
                response[i].ticketNumber +
                ' class = "rem1' +
                [i] +
                ' odd">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            }
          }
          document.getElementById("answeredTickets").innerHTML = tableData;
        } else {
          document.getElementById("answerHead").style.display = "none";
          document.getElementById("answeredTickets").style.textAlign = "center";
          document.getElementById("answeredTickets").innerHTML =
            "NO ANSWERED TICKETS YET";
        }
      }
    }
  };
  xmlhttp1.send();
}

function getClosedTickets() {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open("GET", baseurl + "/helpdeskcc" + "/getClosedTickets", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);

      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("closeHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].closedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            } else {
              tableData +=
                "<tr id = " +
                response[i].ticketNumber +
                ' class = "rem1' +
                [i] +
                ' odd">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].closedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            }
          }
          document.getElementById("closedTickets").innerHTML = tableData;
        } else {
          document.getElementById("closeHead").style.display = "none";
          document.getElementById("closedTickets").style.textAlign = "center";
          document.getElementById("closedTickets").innerHTML =
            "NO CLOSED TICKETS YET";
        }
      }
    }
  };
  xmlhttp1.send();
}

function startChat(ticketNumber) {
  location.href = "chat.html?ticketNumber=" + ticketNumber;
}

// form_postquerry

function createTicket(URLParams) {
  var name = $("#fname").val();
  var email = $("#email").val();
  var subject = $("#subject").val();
  var message = $("#message").val();
  var department = URLParams;
  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }
  xmlhttp1.open("POST", baseurl + "/helpdesklanding/createticket", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != "" &&
      this.readyState == 4
    ) {
      {
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/cc_thank.html?DId=" +
          URLParams;
      }
    }
  };
  xmlhttp1.send(
    JSON.stringify({
      name: name,
      email: email,
      subject: subject,
      message: message,
      department: department,
    })
  );
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

function assignToMe(ticketNumber, name) {
  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }
  xmlhttp1.open(
    "POST",
    baseurl +
      "/helpdeskcc" +
      "/updateNewTickets?ticketNumber=" +
      ticketNumber +
      "&name=" +
      name,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != "" &&
      this.readyState == 4
    ) {
      confirm("This ticket has been assigned to you successfully");
      window.location.href =
        window.location.protocol +
        "//" +
        window.location.host +
        "/chat.html?ticketNumber=" +
        ticketNumber;
    }
  };
  xmlhttp1.send();
}
let countNew;
let countOpen;
let countClosed;
let countAnswered;

function countTicket(status) {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }

  xmlhttp1.open(
    "GET",
    baseurl + "/helpdeskcc/countTickets?status=" + status,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      //var response = JSON.parse(res["response"]);
      //if (response == null) {
      // window.location.href = "error.html";
      //} else if (response != null) {
      if (status === "NEW") {
        countNew = res.response;
        document.getElementById("countNew").innerHTML = res.response;
      } else if (status === "OPEN") {
        document.getElementById("countOpen").innerText = res.response;
      } else if (status === "CLOSED") {
        document.getElementById("countClosed").innerHTML = res.response;
      } else if (status === "ANSWERED") {
        document.getElementById("countAnswered").innerHTML = res.response;
      }
    }
  };

  xmlhttp1.send();
}

//-----Ticket Details----

function getTicketDetails(ticketNumber) {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open(
    "GET",
    baseurl + "/helpdeskcc" + "/getTicketDetails?ticketNumber=" + ticketNumber,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);
      console.log(response);
      document.getElementById("ticketNo").innerHTML = response.ticketNumber;
      document.getElementById("Cname").innerHTML = response.name;
      document.getElementById("username").innerHTML = response.name;
      document.getElementById("msg").innerHTML = response.message;
      document.getElementById("email").innerHTML = response.email;
      document.getElementById("Email").innerHTML = response.email;
      document.getElementById("status").innerHTML = response.status;
      document.getElementById("department").innerHTML = response.department;
      if (response.priority != null) {
        document.getElementById("getPriority").innerHTML = response.priority;
      } else {
        document.getElementById("getPriority").innerHTML = "null";
      }
      if (response.reassignComment != null) {
        document.getElementById("reassignedmsg").innerHTML =
          response.reassignComment;
      } else {
        document.getElementById("reassignmessage").style.display = "none";
      }
      // document.getElementById("subject").innerHTML = response.subject;
      document.getElementById("Subject").innerHTML = response.subject;
      document.getElementById("createDate").innerHTML = response.timeStamp;
      if (response.repliedDate != null) {
      document.getElementById("repliedOn").innerHTML = response.repliedDate;
      } else {
        document.getElementById("repliedOn").innerHTML = "not responded yet";
      }
      // document.getElementById("type").innerHTML = response.type;
      document.getElementById("assignedTo").innerHTML = response.assignedTo;
      document.getElementById("closedOn").innerHTML = response.closedDate;
      var assignedTo = document.getElementById("assignedTo").innerHTML;
      var agent = localStorage.getItem("agentname");
      if (assignedTo !== agent) {
        document.getElementById("choose").style.display = "none";
        document.getElementById("assign_to_me").style.display = "block";
      }
      var status = document.getElementById("status").innerHTML;
      if (status === "ANSWERED") {
        document.getElementById("choose").style.display = "none";
        document.getElementById("assign_to_me").style.display = "none";
        document.getElementById("hidePriority").style.display = "none";
      }
      if (status === "CLOSED") {
        document.getElementById("choose").style.display = "none";
        document.getElementById("assign_to_me").style.display = "none";
        document.getElementById("hidePrior").style.display = "none";
        document.getElementById("hidePriority").style.display = "none";
        document.getElementById("closedDate").style.display = "block";
      }
    }
  };
  xmlhttp1.send();
}

//---post reply----

function postReply(ticketNumber) {
  var priority = $("#prior").val();
  console.log(priority);
  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }
  xmlhttp1.open(
    "POST",
    baseurl +
      "/helpdeskcc" +
      "/updateOpenTickets?ticketNumber=" +
      ticketNumber +
      "&priority=" +
      priority,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != "" &&
      this.readyState == 4
    ) {
      $("#okreply").html('<h3 style="color:rgb(19, 122, 19);">Replied ✔️</h3>');
      window.setTimeout(function () {
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/answeredTicket.html";
      }, 3000);
    }
  };
  xmlhttp1.send();
}

function reassignTicket(ticketNumber) {
  var assignedTo = $("#assignId").val();
  var assign_comments = $("#assign_comments").val();
  var priority = $("#prior").val();
  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }
  xmlhttp1.open(
    "POST",
    baseurl +
      "/helpdeskcc/reassignTicket?ticketNumber=" +
      ticketNumber +
      "&emailId=" +
      assignedTo,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  // xmlhttp1.setRequestHeader('clientID', clientId);
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != "" &&
      this.readyState == 4
    ) {
      var res = JSON.parse(this.responseText);
      alert("This ticket has been reassigned succesfully!");
      window.location.href =
        window.location.protocol + "//" + window.location.host + "/index.html";
    }
  };
  xmlhttp1.send(
    JSON.stringify({
      assignedTo: assignedTo,
      reassignComment: assign_comments,
      priority: priority,
    })
  );
}

function logout() {
  localStorage.setItem("token", null);
  localStorage.setItem("agentname", null);
  window.location.reload();
}

function getOpenTicketsOfAgent(agent) {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open(
    "GET",
    baseurl + "/helpdeskcc" + "/openticketofagent?agent=" + agent,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);

      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("openHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            } else {
              tableData += "<tr" + ' class = "rem1 odd">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            }
          }
          document.getElementById("openTickets").innerHTML = tableData;
        } else {
          document.getElementById("openHead").style.display = "none";
          document.getElementById("openTickets").style.textAlign = "center";
          document.getElementById("openTickets").innerHTML =
            "NO OPEN TICKETS OF AGENT";
        }
      }
    }
  };
  xmlhttp1.send();
}

function getAnsweredTicketsOfAgent(agent) {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open(
    "GET",
    baseurl + "/helpdeskcc" + "/answeredticketofagent?agent=" + agent,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);

      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("answerHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            } else {
              tableData += "<tr" + ' class = "rem1 odd">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            }
          }
          document.getElementById("answeredTickets").innerHTML = tableData;
        } else {
          document.getElementById("answerHead").style.display = "none";
          document.getElementById("answeredTickets").style.textAlign = "center";
          document.getElementById("answeredTickets").innerHTML =
            "NO ANSWERED TICKETS OF AGENT";
        }
      }
    }
  };
  xmlhttp1.send();
}

function getClosedTicketsOfAgent(agent) {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open(
    "GET",
    baseurl + "/helpdeskcc" + "/closedticketofagent?agent=" + agent,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");

  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);

      tableData = "";
      {
        if (response.length > 0) {
          document.getElementById("closeHead").style.display = "revert";
          for (i = 0; i < response.length; i++) {
            if (i % 2 == 0) {
              tableData += "<tr " + ' class = "rem1 even">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].closedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            } else {
              tableData +=
                "<tr id = " +
                response[i].ticketNumber +
                ' class = "rem1' +
                [i] +
                ' odd">';
              tableData +=
                '<td class="invert"><a id="link" onclick="startChat(' +
                response[i].ticketNumber +
                ')" class="approve"><u>' +
                response[i].ticketNumber +
                "</u></a></td>";
              tableData += '<td class="invert">' + response[i].name + "</td>";
              tableData += '<td class="invert">' + response[i].email + "</td>";
              tableData +=
                '<td class="invert">' + response[i].department + "</td>";
              // tableData += '<td class="invert">' + response[i].type + "</td>";
              tableData +=
                '<td class="invert">' + response[i].subject + "</td>";
              tableData += '<td class="invert">' + response[i].status + "</td>";
              tableData +=
                '<td class="invert">' + response[i].priority + "</td>";
              tableData +=
                '<td class="invert">' + response[i].timeStamp + "</td>";
              tableData +=
                '<td class="invert">' + response[i].repliedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].closedDate + "</td>";
              tableData +=
                '<td class="invert">' + response[i].assignedTo + "</td>";
            }
          }
          document.getElementById("closedTickets").innerHTML = tableData;
        } else {
          document.getElementById("closeHead").style.display = "none";
          document.getElementById("closedTickets").style.textAlign = "center";
          document.getElementById("closedTickets").innerHTML =
            "NO CLOSED TICKETS OF AGENT";
        }
      }
    }
  };
  xmlhttp1.send();
}
function getAgentList() {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open("GET", baseurl + "/helpdeskcc" + "/agentlist", true);
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);
      // console.log(response);
      var agentList = '<option value="-1"> Select Team Member </option>';
      for (var i = 0; i < response.length; i++) {
        agentList +=
          "<option value= " +
          response[i].emailId +
          ">" +
          response[i].firstName +
          " " +
          response[i].lastName +
          " </option>";
        // agentList += '<option value="'+ response[i].firstName + ' ' + response[i].lastName +'"><p>' + response[i].firstName + ' ' + response[i].lastName + '</p><p id="mail"> (' + response[i].emailId + ' )</p> </option>'
        // agentList += '<option value="'+response[i].firstName +'">'+response[i].firstName+'</option>'
        // document.getElementById("mail").style.display="none";
      }
      document.getElementById("assignId").innerHTML = agentList;
    }
  };
  xmlhttp1.send();
}

//-----------Filter---------

function myFunction(index, inputname, tableName) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(inputname);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableName);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[index];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function filterRows(tableName) {
  var from = $("#datefilterfrom").val();
  var to = $("#datefilterto").val();

  if (!from && !to) {
    // no value for from and to
    return;
  }

  from = from || "1970-01-01"; // default from to a old date if it is not set
  to = to || "2999-12-31";

  var dateFrom = moment(from);
  var dateTo = moment(to);
  // console.log(dateFrom, dateTo);

  $(tableName).each(function (i, tr) {
    var val = $(tr).find("td:nth-child(8)").text();
    // console.log(val);
    var dateVal = moment(val, "YYYY-MM-DD");
    // console.log(dateVal);
    var visible = dateVal.isBetween(dateFrom, dateTo, null, []) ? "" : "none"; // [] for inclusive
    $(tr).css("display", visible);
  });
}

function loadFilterType(selectedValue) {
  var value;
  if (selectedValue == "filterByName") {
    document.getElementById("name").style.display = "block";
    document.getElementById("rowDate").style.display = "none";
    document.getElementById("Department").style.display = "none";
    document.getElementById("Priority").style.display = "none";
    document.getElementById("ticketNumber").style.display = "none";
  }
  if (selectedValue == "filterByDate") {
    document.getElementById("rowDate").style.display = "block";
    document.getElementById("name").style.display = "none";
    document.getElementById("Department").style.display = "none";
    document.getElementById("Priority").style.display = "none";
    document.getElementById("ticketNumber").style.display = "none";
  }
  if (selectedValue == "filterByDepartment") {
    document.getElementById("Department").style.display = "block";
    document.getElementById("name").style.display = "none";
    document.getElementById("rowDate").style.display = "none";
    document.getElementById("Priority").style.display = "none";
    document.getElementById("ticketNumber").style.display = "none";
  }
  if (selectedValue == "filterByPriority") {
    document.getElementById("Priority").style.display = "block";
    document.getElementById("name").style.display = "none";
    document.getElementById("rowDate").style.display = "none";
    document.getElementById("Department").style.display = "none";
    document.getElementById("ticketNumber").style.display = "none";
  }
  if (selectedValue == "filterByTicketNumber") {
    document.getElementById("ticketNumber").style.display = "block";
    document.getElementById("name").style.display = "none";
    document.getElementById("rowDate").style.display = "none";
    document.getElementById("Department").style.display = "none";
    document.getElementById("Priority").style.display = "none";
  }
}

//------getCustomerTicketDetails----------
function getCustomerTicketDetails(ticketNumber) {
  var xmlhttp1;
  try {
    xmlhttp1 = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp1 = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("BROWSER BROKE");
        return false;
      }
    }
  }
  xmlhttp1.open(
    "GET",
    baseurl +
      "/helpdesklanding" +
      "/getcustomerticketdetails?ticketNumber=" +
      ticketNumber,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != ""
    ) {
      var res = JSON.parse(this.responseText);
      var response = JSON.parse(res.response);
      if (response.status === "CLOSED") {
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/ticketEnd.html";
      } else if (response.status === "OPEN") {
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/status.html";
      } else if (response.status === "NEW") {
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/cc_thank.html";
      } else {
        document.getElementById("ticketNo").innerHTML = response.ticketNumber;
        document.getElementById("profile_name").innerHTML = response.name;
        document.getElementById("Aname").innerHTML = response.assignedTo;
        document.getElementById("username").innerHTML = response.name;
        document.getElementById("msg").innerHTML = response.message;
        document.getElementById("email").innerHTML = response.email;
        document.getElementById("Email").innerHTML = response.email;
        document.getElementById("department").innerHTML = response.department;
        document.getElementById("Subject").innerHTML = response.subject;
        document.getElementById("createDate").innerHTML = response.timeStamp;
        document.getElementById("repliedOn").innerHTML = response.repliedDate;
        document.getElementById("assignedTo").innerHTML = response.assignedTo;
        document.getElementById("status").innerHTML = response.status;
      }
    }
  };
  xmlhttp1.send();
}

//-----------CloseTicket-----------
function closeTicket(ticketNumber) {
  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }
  xmlhttp1.open(
    "POST",
    baseurl +
      "/helpdesklanding" +
      "/updateAnsweredTickets?ticketNumber=" +
      ticketNumber,
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.responseText != null &&
      this.responseText != "" &&
      this.readyState == 4
    ) {
      window.location.href =
        window.location.protocol +
        "//" +
        window.location.host +
        "/ticketEnd.html";
    }
  };
  xmlhttp1.send();
}

function customerVerification() {
  var email = document.getElementById("email").value;
  var ticketNumber = document.getElementById("ticketNo").value;

  var xmlhttp1;
  {
    try {
      xmlhttp1 = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp1 = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          alert("BROWSER BROKE");
          return false;
        }
      }
    }
  }

  xmlhttp1.open(
    "POST",
    baseurl + "/helpdesklanding" + "/customerverification",
    true
  );
  xmlhttp1.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xmlhttp1.onreadystatechange = function () {
    if (
      this.status == 200 &&
      this.readyState == 4 &&
      this.responseText != "" &&
      this.responseText != null
    ) {
      var res = JSON.parse(this.responseText);
      if (res.response === "Ticket Number & Email doesn't match") {
        $("#error_message").show();
        $("#error_message").html(
          "<strong>Ticket Number & Email doesn't match</strong>"
        );
      } else if (res.response === "Ticket Number does not exist") {
        $("#error_message").show();
        $("#error_message").html(
          "<strong>Ticket Number does not exist</strong>"
        );
      } else {
        localStorage.setItem("response", res.response);
        var ticketNumber = res.response;
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/customerChat.html?ticketNumber=" +
          ticketNumber;
      }
    }
  };
  xmlhttp1.send(
    JSON.stringify({
      email: email,
      ticketNumber: ticketNumber,
    })
  );
}
