# Diabetes


# สร้างฐานข้อมูล
use DiabetesDB

# สร้าง user
db.createUser({
  user: "adminDiabete",
  pwd: "passDiabete",
  roles: [{ role: "dbAdmin", db: "DiabetesDB" }, "dbAdmin"]
})

# สร้างคอลเล็กชัน
db.createCollection("Diabetes")

# สร้าง text index ใน collection Diabetes เพื่อให้การค้นหา
db.Diabetes.createIndex({ PatientID: "text", Age: "text", Gender: "text", Ethnicity: "text", Smoking: "text" });

# รันโปรแกรม
npm start

