const express = require("express");

const app = express();
const fileSystem = require("fs");
const { createFolder, validateMonth, datesInAMonth } = require("./utils");
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello world" });
});

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
    if(fileSystem.lstatSync("src/"+"user.json").isFile()) {
        const result = JSON.parse(fileSystem.readFileSync("src/"+"user.json", "utf8"));
        console.log(result);
        return res.status(201).json(result.filter(person => {return person.name.toLowerCase() === name.toLowerCase()}));
    }
    return res.status(201).json({ message: "Hello world" });
})

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

app.listen(3333, () => console.log("Executando"));
