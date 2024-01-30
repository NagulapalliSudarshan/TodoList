import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Permalist',
  password: 'password@123',
  port: 5433,
})
db.connect()
.then(() => console.log('connected to the database'))
.catch((err) => console.error(err))

let items=[];

app.get("/", async (req, res) => {
  const result=await db.query("select title from items")
  items = result.rows
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  await db.query("insert into items (title) values ($1)",[item])
  res.redirect("/"); 
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  console.log(item,'+',id)
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try{
    await db.query("delete from items where id=$1",[id])
    res.redirect("/")
  }catch(err){
    console.Console.log("erro")
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
