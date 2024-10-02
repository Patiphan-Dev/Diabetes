google.charts.load("current", {
  packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);

function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/diabetes");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var trHTML = "";
        var num = 1;
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += "<tr>";
          trHTML += "<td>" + num + "</td>";
          trHTML += "<td>" + object["PatientID"] + "</td>";
          trHTML += "<td>" + object["Age"] + "</td>";
          trHTML += "<td>" + object["Gender"] + "</td>";
          trHTML += "<td>" + object["Ethnicity"] + "</td>";
          trHTML += "<td>" + object["SocioeconomicStatus"] + "</td>";
          trHTML += "<td>" + object["EducationLevel"] + "</td>";
          trHTML += "<td>" + object["BMI"] + "</td>";
          trHTML += "<td>" + object["Smoking"] + "</td>";
          trHTML += "<td>" + object["AlcoholConsumption"] + "</td>";
          trHTML += "<td>" + object["PhysicalActivity"] + "</td>";

          trHTML += "<td>";
          trHTML +=
            '<a type="button" class="btn btn-outline-secondary" onclick="showDiabeteEditBox(\'' +
            object["_id"] +
            '\')"><i class="fas fa-edit"></i></a>';
          trHTML +=
            '<a type="button" class="btn btn-outline-danger" onclick="DiabeteDelete(\'' +
            object["_id"] +
            '\')"><i class="fas fa-trash"></i></a></td>';
          trHTML += "</tr>";

          num++;
        }
        document.getElementById("mytable").innerHTML = trHTML;

        loadGraph(); // เรียกใช้งานฟังก์ชัน loadGraph()
      } else {
        console.error("Error fetching data:", this.statusText);
        document.getElementById("mytable").innerHTML =
          '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
      }
    }
  };
}

function loadQueryTable() {
  // แสดงข้อความ Loading
  document.getElementById("mytable").innerHTML =
    '<tr><th scope="row" colspan="5">Loading...</th></tr>';
  const searchText = document.getElementById("searchTextBox").value;

  // ตรวจสอบว่ามีข้อความค้นหาหรือไม่
  if (!searchText) {
    Swal.fire("Please enter a search term.");
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "http://localhost:3000/diabetes/patientid/" + encodeURIComponent(searchText)
  );

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var trHTML = "";
        var num = 1;
        const objects = JSON.parse(this.responseText).Diabetes;

        // เช็คว่ามีข้อมูลหรือไม่
        if (objects && objects.length > 0) {
          for (let object of objects) {
            trHTML += "<tr>";
            trHTML += "<td>" + num + "</td>";
            trHTML += "<td>" + object["PatientID"] + "</td>";
            trHTML += "<td>" + object["Age"] + "</td>";
            trHTML += "<td>" + object["Gender"] + "</td>";
            trHTML += "<td>" + object["Ethnicity"] + "</td>";
            trHTML += "<td>" + object["SocioeconomicStatus"] + "</td>";
            trHTML += "<td>" + object["EducationLevel"] + "</td>";
            trHTML += "<td>" + object["BMI"] + "</td>";
            trHTML += "<td>" + object["Smoking"] + "</td>";
            trHTML += "<td>" + object["AlcoholConsumption"] + "</td>";
            trHTML += "<td>" + object["PhysicalActivity"] + "</td>";

            trHTML += "<td>";
            trHTML +=
              '<a type="button" class="btn btn-outline-secondary" onclick="showDiabeteEditBox(\'' +
              object["_id"] +
              '\')"><i class="fas fa-edit"></i></a>';
            trHTML +=
              '<a type="button" class="btn btn-outline-danger" onclick="DiabeteDelete(\'' +
              object["_id"] +
              '\')"><i class="fas fa-trash"></i></a>';
            trHTML += "</td>";
            trHTML += "</tr>";
            num++;
          }
        } else {
          // แสดงข้อความเมื่อไม่มีข้อมูล
          trHTML = '<tr><td colspan="6">No results found.</td></tr>';
        }
        console.log(trHTML);
        document.getElementById("mytable").innerHTML = trHTML;
      } else {
        console.error("Error fetching data:", this.statusText);
        Swal.fire(
          "Oops!",
          "Something went wrong while fetching results.",
          "error"
        );
        document.getElementById("mytable").innerHTML =
          '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
      }
    }
  };
}

function loadGraph() {
  let Man = 0;
  let Woman = 0;

  let Caucasian = 0;
  let AfricanAmerican = 0;
  let Asian = 0;
  let Other = 0;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/diabetes/");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const objects = JSON.parse(this.responseText);

        // ฟังก์ชันนับประเภทข้อมูล
        function countResponses(array, key, counts) {
          for (let object of array) {
            const value = object[key];
            counts[value] = (counts[value] || 0) + 1;
          }
        }

        // นับประเภทข้อมูล
        const dataTypeCounts = {};
        countResponses(objects, "Gender", dataTypeCounts);
        Man = dataTypeCounts["Man"] || 0;
        Woman = dataTypeCounts["Woman"] || 0;

        // นับแอตทริบิวต์
        const submittedViaCounts = {};
        countResponses(objects, "Ethnicity", submittedViaCounts);
        Caucasian = submittedViaCounts["Caucasian"] || 0;
        AfricanAmerican = submittedViaCounts["African American"] || 0;
        Asian = submittedViaCounts["Asian"] || 0;
        Other = submittedViaCounts["Other"] || 0;

        // แสดงกราฟประเภทข้อมูล
        const TimelyResponseData = google.visualization.arrayToDataTable([
          ["Gender", "Count"],
          ["Man", Man],
          ["Woman", Woman],
        ]);

        const optionsTimelyResponse = {
          title: "Gender Stats (Latest 10000 cases)",
        };
        const chartTimelyResponse = new google.visualization.PieChart(
          document.getElementById("piechartTimelyResponse")
        );
        chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);

        // แสดงกราฟแอตทริบิวต์
        const dataSubmitted = google.visualization.arrayToDataTable([
          ["Ethnicity", "Number", { role: "style" }, { role: "annotation" }],
          ["Caucasian", Caucasian, "#F65A83", "Caucasian"],
          ["African American", AfricanAmerican, "#FF4500", "African American"],
          ["Asian", Asian, "#8A2BE2", "Asian"],
          ["Other", Other, "#FFD700", "Other"],
        ]);

        const optionSubmitted = {
          title: "Ethnicity Stats (Latest 10000 cases)",
          legend: { position: "none" },
        };

        const chartSubmitted = new google.visualization.BarChart(
          document.getElementById("barchartSubmitted")
        );
        chartSubmitted.draw(dataSubmitted, optionSubmitted);
      } else {
        console.error("Error fetching data:", this.statusText);
        Swal.fire(
          "Oops!",
          "Something went wrong while fetching the graph data.",
          "error"
        );
      }
    }
  };
}

function showDiabeteCreateBox() {
  var d = new Date();
  const date = d.toISOString().split("T")[0];

  Swal.fire({
    title: "Create Patient information",
    html:
      '<div class="mb-3"><label for="PatientID" class="form-label">PatientID</label>' +
      '<input class="form-control" id="PatientID" placeholder="PatientID"></div>' +
      '<div class="mb-3"><label for="Age" class="form-label">Age</label>' +
      '<input class="form-control" id="Age" placeholder="Age"></div>' +
      '<div class="mb-3"><label for="Gender" class="form-label">Gender</label>' +
      '<input class="form-control" id="Gender" placeholder="Gender"></div>' +
      '<div class="mb-3"><label for="Ethnicity" class="form-label">Ethnicity</label>' +
      '<input class="form-control" id="Ethnicity" placeholder="Ethnicity"></div>' +
      '<div class="mb-3"><label for="SocioeconomicStatus" class="form-label">SocioeconomicStatus</label>' +
      '<input class="form-control" id="SocioeconomicStatus" placeholder="SocioeconomicStatus"></div>' +
      '<div class="mb-3"><label for="EducationLevel" class="form-label">EducationLevel</label>' +
      '<input class="form-control" id="EducationLevel" placeholder="EducationLevel"></div>' +
      '<div class="mb-3"><label for="BMI" class="form-label">BMI</label>' +
      '<input class="form-control" id="BMI" placeholder="BMI"></div>' +
      '<div class="mb-3"><label for="Smoking" class="form-label">Smoking</label>' +
      '<input class="form-control" id="Smoking" placeholder="Smoking"></div>' +
      '<div class="mb-3"><label for="AlcoholConsumption" class="form-label">AlcoholConsumption</label>' +
      '<input class="form-control" id="AlcoholConsumption" placeholder="AlcoholConsumption"></div>' +
      '<div class="mb-3"><label for="PhysicalActivity" class="form-label">PhysicalActivity</label>' +
      '<input class="form-control" id="PhysicalActivity" placeholder="PhysicalActivity"></div>',
    focusConfirm: false,
    preConfirm: () => {
      DiabeteCreate();
    },
  });
}

function DiabeteCreate() {
  const PatientID = document.getElementById("PatientID").value;
  const Age = document.getElementById("Age").value;
  const Gender = document.getElementById("Gender").value;
  const Ethnicity = document.getElementById("Ethnicity").value;
  const SocioeconomicStatus = document.getElementById(
    "SocioeconomicStatus"
  ).value;
  const EducationLevel = document.getElementById("EducationLevel").value;
  const BMI = document.getElementById("BMI").value;
  const Smoking = document.getElementById("Smoking").value;
  const AlcoholConsumption =
    document.getElementById("AlcoholConsumption").value;
  const PhysicalActivity = document.getElementById("PhysicalActivity").value;

  console.log(
    JSON.stringify({
      PatientID: PatientID,
      Age: Age,
      Gender: Gender,
      Ethnicity: Ethnicity,
      SocioeconomicStatus: SocioeconomicStatus,
      EducationLevel: EducationLevel,
      BMI: BMI,
      Smoking: Smoking,
      AlcoholConsumption: AlcoholConsumption,
      PhysicalActivity: PhysicalActivity,
    })
  );

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/diabetes/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      PatientID: PatientID,
      Age: Age,
      Gender: Gender,
      Ethnicity: Ethnicity,
      SocioeconomicStatus: SocioeconomicStatus,
      EducationLevel: EducationLevel,
      BMI: BMI,
      Smoking: Smoking,
      AlcoholConsumption: AlcoholConsumption,
      PhysicalActivity: PhysicalActivity,
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire("Good job!", "Create Patient information Successfully!", "success");
      loadTable();
    }
  };
}

function DiabeteDelete(id) {
  if (!id) {
    console.error("Invalid ID");
    return;
  }

  console.log("Delete: ", id);

  fetch("http://localhost:3000/diabetes/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ _id: id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire("Good job!", "Delete diabete Successfully!", "success");
      loadTable();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      Swal.fire("Error!", "Failed to delete diabete.", "error");
    });
}

function showDiabeteEditBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/diabetes/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText).object;
      console.log("showDiabeteEditBox", object);
      Swal.fire({
        title: "Edit Patient information",
        html:
          '<input id="id" class="swal2-input" type="hidden" value="' +
          object["_id"] +
          '">' +
          '<div class="mb-3"><label for="PatientID" class="form-label">PatientID</label>' +
          '<input class="form-control" id="PatientID" placeholder="PatientID" value="' +
          object["PatientID"] +
          '"></div>' +
          '<div class="mb-3"><label for="Age" class="form-label">Age</label>' +
          '<input class="form-control" id="Age" placeholder="Age" value="' +
          object["Age"] +
          '"></div>' +
          '<div class="mb-3"><label for="Gender" class="form-label">Gender</label>' +
          '<input class="form-control" id="Gender" placeholder="Gender" value="' +
          object["Gender"] +
          '"></div>' +
          '<div class="mb-3"><label for="Ethnicity" class="form-label">Ethnicity</label>' +
          '<input class="form-control" id="Ethnicity" placeholder="Ethnicity" value="' +
          object["Ethnicity"] +
          '"></div>' +
          '<div class="mb-3"><label for="SocioeconomicStatus" class="form-label">SocioeconomicStatus</label>' +
          '<input class="form-control" id="SocioeconomicStatus" placeholder="SocioeconomicStatus" value="' +
          object["SocioeconomicStatus"] +
          '"></div>' +
          '<div class="mb-3"><label for="EducationLevel" class="form-label">EducationLevel</label>' +
          '<input class="form-control" id="EducationLevel" placeholder="EducationLevel" value="' +
          object["EducationLevel"] +
          '"></div>' +
          '<div class="mb-3"><label for="BMI" class="form-label">BMI</label>' +
          '<input class="form-control" id="BMI" placeholder="BMI" value="' +
          object["BMI"] +
          '"></div>' +
          '<div class="mb-3"><label for="Smoking" class="form-label">Smoking</label>' +
          '<input class="form-control" id="Smoking" placeholder="Smoking" value="' +
          object["Smoking"] +
          '"></div>' +
          '<div class="mb-3"><label for="AlcoholConsumption" class="form-label">AlcoholConsumption</label>' +
          '<input class="form-control" id="AlcoholConsumption" placeholder="AlcoholConsumption" value="' +
          object["AlcoholConsumption"] +
          '"></div>' +
          '<div class="mb-3"><label for="PhysicalActivity" class="form-label">PhysicalActivity</label>' +
          '<input class="form-control" id="PhysicalActivity" placeholder="PhysicalActivity" value="' +
          object["PhysicalActivity"] +
          '"></div>',
        focusConfirm: false,
        preConfirm: () => {
          return userEdit(); // รอให้ userEdit คืนค่าก่อน
        },
      });
    }
  };
}

async function userEdit() {
  const id = document.getElementById("id").value;
  const PatientID = document.getElementById("PatientID").value;
  const Age = document.getElementById("Age").value;
  const Gender = document.getElementById("Gender").value;
  const Ethnicity = document.getElementById("Ethnicity").value;
  const SocioeconomicStatus = document.getElementById(
    "SocioeconomicStatus"
  ).value;
  const EducationLevel = document.getElementById("EducationLevel").value;
  const BMI = document.getElementById("BMI").value;
  const Smoking = document.getElementById("Smoking").value;
  const AlcoholConsumption =
    document.getElementById("AlcoholConsumption").value;
  const PhysicalActivity = document.getElementById("PhysicalActivity").value;

  const data = {
    _id: id,
    PatientID: PatientID,
    Age: Age,
    Gender: Gender,
    Ethnicity: Ethnicity,
    SocioeconomicStatus: SocioeconomicStatus,
    EducationLevel: EducationLevel,
    BMI: BMI,
    Smoking: Smoking,
    AlcoholConsumption: AlcoholConsumption,
    PhysicalActivity: PhysicalActivity,
  };

  console.log(JSON.stringify(data));

  try {
    const response = await fetch("http://localhost:3000/diabetes/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const objects = await response.json();
    Swal.fire("Good job!", "Update diabete Successfully!", "success");
    loadTable(); // รีเฟรชตารางหลังจากอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating diabete:", error);
    Swal.fire("Oops!", "Something went wrong!", "error");
  }
}
