// Références aux éléments HTML
const tradeForm = document.getElementById('tradeForm');
const tradeTableBody = document.getElementById('tradeTableBody');
const addConditionButton = document.getElementById('addConditionButton');
const conditionsList = document.getElementById('conditionsList');
const analyzeButton = document.getElementById('analyzeButton');
const analysisResults = document.getElementById('analysisResults');

// Initialisation des conditions par défaut
const defaultConditions = ["RSI < 30", "MACD croisement haussier"];

// Charger les conditions depuis localStorage ou utiliser par défaut
function loadConditions() {
  const savedConditions = JSON.parse(localStorage.getItem('conditions')) || defaultConditions;
  conditionsList.innerHTML = '';
  savedConditions.forEach(condition => {
    const conditionElement = document.createElement('label');
    conditionElement.innerHTML = `<input type="checkbox" name="conditions" value="${condition}"> ${condition}`;
    conditionsList.appendChild(conditionElement);
    conditionsList.appendChild(document.createElement('br'));
  });
}

// Ajouter une nouvelle condition (et éviter les doublons)
function saveCondition(newCondition) {
  const savedConditions = JSON.parse(localStorage.getItem('conditions')) || defaultConditions;
  if (!savedConditions.includes(newCondition)) {
    savedConditions.push(newCondition);
    localStorage.setItem('conditions', JSON.stringify(savedConditions));
    return true;
  }
  return false;
}

// Ajouter une condition via le bouton
addConditionButton.addEventListener('click', () => {
  const newCondition = prompt("Entrez une nouvelle condition d'entrée :");
  if (newCondition) {
    const added = saveCondition(newCondition);
    if (added) {
      loadConditions();
    } else {
      alert("Cette condition existe déjà !");
    }
  }
});

// Enregistrer un trade
tradeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(tradeForm);
  const conditions = formData.getAll('conditions');

  const trade = {
    instrument: formData.get('instrument'),
    entryPrice: formData.get('entryPrice'),
    exitPrice: formData.get('exitPrice'),
    stopLoss: formData.get('stopLoss'),
    takeProfit: formData.get('takeProfit'),
    tradeDate: formData.get('tradeDate'),
    conditions: conditions.join(', ')
  };

  addTradeToTable(trade);
  tradeForm.reset();
});

// Ajouter un trade au tableau
function addTradeToTable(trade) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${trade.instrument}</td>
    <td>${trade.entryPrice}</td>
    <td>${trade.exitPrice}</td>
    <td>${trade.stopLoss}</td>
    <td>${trade.takeProfit}</td>
    <td>${trade.tradeDate}</td>
    <td>${trade.conditions}</td>
  `;
  tradeTableBody.appendChild(row);
}

// Analyser les trades
analyzeButton.addEventListener('click', () => {
  const rows = document.querySelectorAll('#tradeTableBody tr');
  let totalTrades = 0;
  let winningTrades = 0;

  rows.forEach(row => {
    const entryPrice = parseFloat(row.cells[1].innerText);
    const exitPrice = parseFloat(row.cells[2].innerText);
    if (!isNaN(entryPrice) && !isNaN(exitPrice)) {
      totalTrades++;
      if (exitPrice > entryPrice) {
        winningTrades++;
      }
    }
  });

  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(2) : 0;
  analysisResults.innerHTML = `
    <h3>Résultats de l'Analyse</h3>
    <p>Total des trades : ${totalTrades}</p>
    <p>Trades gagnants : ${winningTrades}</p>
    <p>Taux de réussite : ${winRate}%</p>
  `;
});

// Charger les conditions au démarrage
loadConditions();

  