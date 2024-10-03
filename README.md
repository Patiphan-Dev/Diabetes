# Diabetes

# คำสั่งนี้จะเปิด MongoDB shell
C:\Users\xxxxx> mongosh 

Current Mongosh Log ID: 66fdf00c9e79cb72e6c73bf7
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1
Using MongoDB:          7.0.14
Using Mongosh:          2.3.1

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2024-10-01T19:24:49.603+07:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

# สร้างฐานข้อมูล StatlogDB
test> use StatlogDB

switched to db StatlogDB

# สร้างผู้ใช้งาน
StatlogDB> db.createUser({ user: "adminStatlog", pwd: "passStatlog", roles: [{ role: "dbAdmin", db: "StatlogDB" }, "dbAdmin"] })

# ดูผู้ใช้งาน
StatlogDB> db.getUsers()
{
  users: [
    {
      _id: 'StatlogDB.adminStatlog',
      userId: UUID('f3bb3eb4-f8a1-4415-bf42-e4f408152bab'),
      user: 'adminStatlog',
      db: 'StatlogDB',
      roles: [ { role: 'dbAdmin', db: 'StatlogDB' } ],
      mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
    }
  ],
  ok: 1
}

# สร้าง collection Diabetes
StatlogDB> db.createCollection("Diabetes")
{ ok: 1 }

# สร้าง text index สำหรับไว้ค้นหา
StatlogDB> db.Diabetes.createIndex({ Attribute: "text", Description: "text", Data_Type: "text", Domain: "text" })
Attribute_text_Description_text_Data_Type_text_Domain_text

# แสดง collections
StatlogDB> show collections
Diabetes

# ตรวจสอบข้อมูลใน collections
StatlogDB> db.Diabetes.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'Attribute_text_Description_text_Data_Type_text_Domain_text',
    weights: { Attribute: 1, Data_Type: 1, Description: 1, Domain: 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  }
]

