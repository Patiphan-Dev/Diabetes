const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Let's Working with NoSQL Databases");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const uri = "mongodb://adminDiabete:passDiabete@localhost:27017/?authMechanism=DEFAULT&authSource=DiabetesDB";

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log(`MongoDB connected successfully.`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

// Read All API
app.get("/diabetes", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const objects = await client
    .db("DiabetesDB")
    .collection("Diabetes")
    .find({})
    .sort({ PatientID: 1 })
    .limit(10)
    .toArray();
  await client.close();
  res.status(200).send(objects);
});

// Create API
app.post("/diabetes/create", async (req, res) => {
  const object = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("DiabetesDB").collection("Diabetes").insertOne({
    PatientID: object.PatientID,
    Age: object.Age,
    Gender: object.Gender,
    Ethnicity: object.Ethnicity,
    SocioeconomicStatus: object.SocioeconomicStatus,
    EducationLevel: object.EducationLevel,
    BMI: object.BMI,
    Smoking: object.Smoking,
    AlcoholConsumption: object.AlcoholConsumption,
    PhysicalActivity	: object.PhysicalActivity	,

  });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "Diabete is created",
    diabete: object,
  });
});

// Update API
app.put("/diabetes/update", async (req, res) => {
  const object = req.body;
  const id = object._id;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).send({ status: "error", message: "Invalid ID" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    
    const result = await client
      .db("DiabetesDB")
      .collection("Diabetes")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            PatientID: object.PatientID,
            Age: object.Age,
            Gender: object.Gender,
            Ethnicity: object.Ethnicity,
            SocioeconomicStatus: object.SocioeconomicStatus,
            EducationLevel: object.EducationLevel,
            BMI: object.BMI,
            Smoking: object.Smoking,
            AlcoholConsumption: object.AlcoholConsumption,
            PhysicalActivity: object.PhysicalActivity,

          },
        }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ status: "error", message: "Diabete not found or no changes made" });
    }

    res.status(200).send({
      status: "ok",
      message: "Diabete with ID = " + id + " is updated",
      diabete: object,
    });
  } catch (error) {
    console.error("Error updating diabete:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while updating the diabete: " + error.message,
    });
  } finally {
    await client.close();
  }
});

// Delete API
app.delete("/diabetes/delete", async (req, res) => {
  try {
    const object = req.body;
    const id = object._id;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({ status: "error", message: "Invalid ID" });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const result = await client
      .db("DiabetesDB")
      .collection("Diabetes")
      .deleteOne({ _id: new ObjectId(id) });

    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Diabete not found with ID = " + id,
      });
    }

    res.status(200).send({
      status: "ok",
      ID: id,
      message: "Diabete with ID = " + id + " is deleted",
    });
  } catch (error) {
    console.error("Error deleting diabete:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while deleting the diabete: " + error.message,
    });
  }
});


// Read Limit API
app.get("/diabetes/limit", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const objects = await client
    .db("DiabetesDB")
    .collection("Diabetes")
    .find({})
    .sort({ PatientID: 1 })
    .limit(10000)
    .toArray();
  await client.close();
  res.status(200).send(objects);
});

// Read by id API
app.get("/diabetes/:id", async (req, res) => {
  const { params } = req;
  const id = params.id;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).send({ status: "error", message: "Invalid ID" });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const object = await client
      .db("DiabetesDB")
      .collection("Diabetes")
      .findOne({ _id: new ObjectId(id) });

    if (!object) {
      return res.status(404).send({ status: "error", message: "Diabete not found" });
    }

    res.status(200).send({
      status: "ok",
      ID: id,
      object: object,
    });
  } catch (error) {
    console.error("Error fetching diabete:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while fetching the diabete: " + error.message,
    });
  } finally {
    await client.close();
  }
});

// Query by filter API: Search text from PatientID Name
app.get("/diabetes/patientid/:searchText", async (req, res) => {
  const { params } = req;
  const searchText = params.searchText;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const objects = await client
      .db("DiabetesDB")
      .collection("Diabetes")
      .find({ $text: { $search: searchText } }) // ตรวจสอบว่าคุณได้สร้าง Text Index
      .sort({ PatientID: 1 })
      .limit(10)
      .toArray();

    res.status(200).send({
      status: "ok",
      searchText: searchText,
      Diabetes: objects, // ส่งกลับเป็น Diabetes
    });
  } catch (error) {
    console.error("Error querying diabetes:", error);
    res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message, // เพิ่มข้อความข้อผิดพลาด
    });
  } finally {
    await client.close();
  }
});


