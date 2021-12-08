const fileSystem = require("fs");

function createFolder(folderName) {
  if (!fileSystem.existsSync(folderName)) {
    fileSystem.mkdirSync(folderName);
    return folderName + " - criado com sucesso!";
  }
  return folderName + " - não foi possível criar!";
}

/*
  Função utilizada para filtrar dados de um array de objetos.
  A função obtém os dados de consulta do arquivo "user.json" (código pode ser refatorado para aceitar um argumento que indique o arquivo desejados.
  A função recebe a propriedade que será verificada e o dado utilizado para validação
  Caso o método filtro encontre os dados buscados, irá retornar um array contendo todos os elementos encontrados
  e o índice do primeiro elemento encontrado no array original.
  Caso a função não encontre o valor, irá retornar null.
*/
function filterData(array, prop, data) {
  if(array.length <= 0) return null;
  if(!(prop in array[0])) return null;
  const filteredResult = array.filter(obj => {return obj[prop].toString().toLowerCase() === data.toString().toLowerCase()});
  if(filteredResult.length > 0) {
    const dataIndex = array.indexOf(filteredResult[0]);
    return [filteredResult, dataIndex];
  }
  return null;
}

/*
  Função utilizada para trocar as posições de dois elementos dentro de um array;
  A função recebe o array que será modificado e o index dos respectivos elementos;
  A função retorna um novo array com os elementos em suas novas posições
*/
function swapData(array, indexA, indexB) {
  if(indexA === indexB) 
    return array;
  else {
    let swapAux = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = swapAux;
    return array;
  }
}

/*
    Função para validar se o mês obtido via parâmetro é válido.
    O paramêtro "month" pode ser um número ou uma string que refencie o mês.
    Para strings são aceitos o nome completo ou a abreviação. A função não é case sensitive.

    A função ira retornar um array de duas posições, onde o índice 0 é um booleano indicando se o mês é válido (true) ou não (false).
    No índice 1 é retornado um valor numérico do mês informado por parâmetro.

    Ex1: validateMonth("fevereiro") => [true, 2]
    Ex2: validateMonth("joao") => [false, 0]
    Ex3: validateMonth(10) => [true, 10]
*/
function validateMonth(month) {
  const monthsExtended = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const monthsAbbreviation = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  if (!isNaN(month)) {
    return month >= 1 && month <= 12 ? [true, month] : [false, 0];
  } else {
    return monthsExtended.includes(month.toLowerCase())
      ? [
          monthsExtended.includes(month.toLowerCase()),
          monthsExtended.indexOf(month.toLowerCase()) + 1,
        ]
      : [
          monthsAbbreviation.includes(month.toLowerCase()),
          monthsAbbreviation.indexOf(month.toLowerCase()) + 1,
        ];
  }
}


/*
    Função que retorna um array listando todas as datas referentes ao mês pesquisado.
    A função retorna um array ordenado de todas as datas contidas dentro de um mês.
    O ano será sempre referente à data do sistema operacional;
    
    Ex: datesInAMonth(2) => [
  "01/02/2021",
  "02/02/2021",
  "03/02/2021",
  "04/02/2021",
        .
        .
        .
  "25/02/2021",
  "26/02/2021",
  "27/02/2021",
  "28/02/2021"]
*/
function datesInAMonth(monthIndex) {
  if(monthIndex < 1 || monthIndex > 12) {
      return null;
  } 
  const year = new Date().getFullYear();
  const date = new Date(year, monthIndex, 0);
  const month = monthIndex < 10 ? "0" + monthIndex : "" + monthIndex;
  let dates = [];
  for (let i = 1; i <= date.getDate(); i++) {
    const day = "" + i < 10 ? "0" + i : "" + i;
    dates.push(`${day.slice(-2)}/${month.slice(-2)}/${year}`);
  }
  return dates;
}

/*
  Função utilizada para concatenar um dado, passado por parâmetro, a um arquivo.
  O conteúdo é concatenado na forma de array, ou seja, o novo dado será inserido ao final do array.
  Caso o conteúdo do arquivo não esteja na forma de um array, todo o seu conteudo será passado para o primeiro indice de um array e o novo dado será adicionado ao próximo indice
  caso o conteúdo do arquivo já esteja no formato de array, o novo dado será inserido utilizando o método push.

*/
function getDataArray(data) {
  let result = JSON.parse(fileSystem.readFileSync("src/" + "data.json", "utf8"));
  Array.isArray(result) ? result.push(data) : result = [result, data];
  return result;
}

function updateData(array, data, objIndex) {
  console.log("print1", data);
  console.log("print2", array[objIndex])
  const obj = { data } = array[objIndex];
  array[objIndex] = { ...data }
  console.log(array[objIndex])
  return null;
}

module.exports = {
  createFolder,
  validateMonth,
  datesInAMonth,
  filterData,
  swapData,
  getDataArray,
  updateData
};
