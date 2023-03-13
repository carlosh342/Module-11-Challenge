const PORT = process.env.PORT || 3001;
/// Get requirements
const fs = require("fs");
const path = require("path");
const express =require("express");
const Notes =require("./db/db.json");

const App =express();
// App use
App.use(express.urlencoded({extended:true}));
App.use(express.json());
App.use(express.static("public"));

// App get 
App.get("/api/notes",(req,res)=>{res.json(Notes.slice(1))});
App.get("/",(req,res) =>{res.sendFile(path.join(__dirname,"./public/index.html"))});
App.get("/notes",(req,res) =>{res.sendFile(path.join(__dirname,"./public/notes.html"))});
App.get("*",(req,res) =>{res.sendFile(path.join(__dirname,"./public/index.html"))});

/// Create new Note Function

function create_Note(body,notesArray){
    const new_Note = body;
    if(!Array.isArray(notesArray)){
        notesArray=[];
    }
    if(notesArray.length===0){
        notesArray.push(0);
    }
    body.id =notesArray[0];
    notesArray[0]++;

    notesArray.push(new_Note);
    fs.writeFileSync(path.join(__dirname,"./db/db.json"),JSON.stringify(notesArray,null,2));

    return new_Note;
}

App.post("/api/notes",(req,res)=>{
    const newNote =create_Note(req.body,Notes);
    res.json(newNote)
});

function delete_Note(id,notesArray){
    for(let i=0;i<notesArray.length;i++){
     let note=notesArray[i];

     if(note.id==id){
        notesArray.splice(i,1);
        fs.writeFileSync(path.join(__dirname,"./db/db.json"),JSON.stringify(notesArray,null,2));
        break;
     }
    }
}
App.delete("/api/notes/:id",(req,res)=>{
    delete_Note(req.params.id,Notes);
    res.json(true);
});

App.listen(PORT,()=>{
 console.log(`Api server listening on port:${PORT}`)
});