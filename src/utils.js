const fileSystem = require("fs");

function createFolder(folderName) {
  if (!fileSystem.existsSync(folderName)) {
    fileSystem.mkdirSync(folderName);
    return folderName + " - criado com sucesso!";
  }
  return folderName + " - não foi possível criar!";
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

module.exports = {
  createFolder,
  validateMonth,
  datesInAMonth,
};
