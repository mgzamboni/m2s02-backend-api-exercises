const express = require("express");

const app = express();
const fileSystem = require("fs");
const {
  createFolder,
  validateMonth,
  datesInAMonth,
  filterData,
  swapData,
  getDataArray,
  updateData,
  createItemList,
  calcFatorial
} = require("./utils");
app.use(express.json());

app.post("/", (req, res) => {
  const { folder, item } = req.body;
  const { job } = req.query;
  console.log(folder);
  const existFolder = createFolder(folder);
  delete req.body.folder;

  //Este if verifica se existe o arquivo user.json
  if (fileSystem.lstatSync("src/" + "user.json").isFile()) {
    //Neste result, retorna os dados do JSON de dentro do user
    const result = JSON.parse(
      fileSystem.readFileSync("src/" + "user.json", "utf8")
    );
    console.log(result);
    return res.status(201).json({ message: "Caiu aqui" });
  }
  // //Nesta Linha de baixo, é criado o user.json e preenche o arquivo JSON de acordo com o que foi enviado no req.body
  fileSystem.writeFileSync("src/" + "user.json", JSON.stringify(req.body));

  return res.status(201).json({ message: "Hello world" });
});

app.patch("/sortlist/:name", (req, res) => {
  const { name } = req.params;
  try {
    if (fileSystem.lstatSync("src/" + "user.json").isFile()) {
      const userList = JSON.parse(fileSystem.readFileSync("src/" + "user.json", "utf8"));
      const filteredUser = filterData(userList, "name", name);
      if (filteredUser !== null) {
        const updatedUserList = swapData(userList, 0, filteredUser[1]);
        fileSystem.writeFileSync("src/" + "user.json",JSON.stringify(updatedUserList));
        return res.status(200).json(updatedUserList);
      }
    }
    return res.status(400).json({ message: "O usuário informado não pertence a lista" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  // return res.status(500).json({ message: "Não foi possível localizar o banco de dados" });
});

app.get("/date/:month", (req, res) => {
  const { month } = req.params;
  const [validMonth, monthIndex] = validateMonth(month);

  if (validMonth) {
    const dates = datesInAMonth(monthIndex);
    return dates
      ? res.status(200).json(dates)
      : res.status(500).json({ message: "Ocorreu um erro durante a execução" });
  }
  return res.status(400).json({ message: "Mês inválido" });
});

app.post("/savedata", (req, res) => {
  const data = req.body;
  try{
    if(fileSystem.existsSync("src/" + "data.json")) {
      const result = getDataArray(data);
      fileSystem.writeFileSync("src/" + "data.json", JSON.stringify(result));
      return res.status(200).json(result);
    }
    fileSystem.writeFileSync("src/" + "data.json", JSON.stringify(data));
    return res.status(201).json(data);
  } catch (error){
    return res.status(500).json({message: error})
  }
});

app.put("/update/:id", (req, res) => {
  const data = req.body;
  const { id } = req.params;

  try{
    if (fileSystem.lstatSync("src/" + "user.json").isFile()) {
      const userList = JSON.parse(fileSystem.readFileSync("src/" + "user.json", "utf8"));
      const filteredUser = filterData(userList, "id", id);
      if (filteredUser !== null) {
        const updatedUserList = updateData(userList, data, filteredUser[1]);
        if( updatedUserList !== null) { 
          fileSystem.writeFileSync("src/" + "user.json",JSON.stringify(updatedUserList[0]))
          return res.status(200).json({message: `Os campos ${updatedUserList[1].join(', ')} foram atualizado`})  
        } 
        else {
          return res.status(200).json({message: "Nenhum campo foi alterado"});
        }
      }
      return res.status(400).json({message: "ID informado é inválido"})
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
})

app.get("/userlist", (req, res) => {
  const query = req.query;
  let filteredUserList = JSON.parse(fileSystem.readFileSync("src/" + "user.json", "utf8"));
    for(i = 0; i < Object.keys(query).length; i++) {
      if(Object.keys(query)[i] === "ageMin") {
        filteredUserList = filterData(filteredUserList, "age", query[Object.keys(query)[i]], ">=")[0];
      } else if(Object.keys(query)[i] === "ageMax") {
        filteredUserList = filterData(filteredUserList, "age", query[Object.keys(query)[i]], "<=")[0];
      } else{
        filteredUserList = filterData(filteredUserList, Object.keys(query)[i], query[Object.keys(query)[i]])[0];
      }
     console.log(`Scan ${i}: `, filteredUserList);
    }
  return res.status(200).json(filteredUserList);
})

app.post("/createlist", (req, res) => {
  const { number } = req.body;
  try {
    if (!Number.isInteger(number)) {
      return res.status(400).json({message: "Valor inválido, deve ser um número"});
    } else {
      itemlist = createItemList(number);
      console.log(itemlist);
      fileSystem.writeFileSync("src/" + "items.json",JSON.stringify(itemlist));
      return res.status(200).json(itemlist);
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
})

app.delete("/userlist/:id", (req, res) => {
  const { id } = req.params;
  const userList = JSON.parse(fileSystem.readFileSync("src/" + "user.json", "utf8"));
  const filteredUser = filterData(userList, "id", id);
  if(filteredUser[1] !== -1) {
    userList.splice(filteredUser[1], 1)
    fileSystem.writeFileSync("src/" + "user.json",JSON.stringify(userList))
    return res.status(200).json(userList);
  } else {
    return res.status(400).json({message: "ID informado não foi encontrado"});
  }

})


app.get("/fatorial", (req, res) => {
  const { value } = req.query;
  if(isNaN(parseInt(value)) || parseInt(value) < 0) {
    return res.status(400).json({message: "Valor inválido, digite um número inteiro maior ou igual a 0"})
  } else {
    return res.status(200).json({result: calcFatorial(parseInt(value))})
  }
})

app.listen(3333, () => console.log("Executando"));
