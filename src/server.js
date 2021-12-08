const express = require("express");

const app = express();
const fileSystem = require("fs");
const {
  createFolder,
  validateMonth,
  datesInAMonth,
  filterData,
  swapData,
  getDataArray
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

app.listen(3333, () => console.log("Executando"));
