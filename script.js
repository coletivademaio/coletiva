document.addEventListener('DOMContentLoaded', function () {
  carregarDados();
});

function carregarDados() {
  const namesList = document.getElementById('namesList');
  const totalCount = document.getElementById('totalCount');
  const totalWorks = document.getElementById('totalWorks');
  const lastAdded = document.getElementById('lastAdded');

  // Verificando se os elementos foram encontrados no DOM
  if (!namesList || !totalCount || !totalWorks || !lastAdded) {
    console.error('Erro: Um ou mais elementos não foram encontrados no DOM.');
    return;
  }

  fetch('dados.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao carregar o arquivo CSV');
      }
      return response.text();
    })
    .then(csv => {
      const dados = parseCSV(csv);
      const obrasPorInscrito = {};
      const inscritos = new Set();

      dados.forEach(item => {
        const inscrito = item.INSCRITOS;
        const obras = item.OBRAS ? item.OBRAS.split(';') : []; // Corrigindo separação das obras

        if (inscrito) {
          inscritos.add(inscrito);
          
          if (!obrasPorInscrito[inscrito]) {
            obrasPorInscrito[inscrito] = 0;
          }

          obrasPorInscrito[inscrito] += obras.length;
        }
      });

      // Atualizando os valores no HTML
      totalCount.textContent = inscritos.size;
      totalWorks.textContent = Object.values(obrasPorInscrito).reduce((acc, count) => acc + count, 0);
      lastAdded.textContent = inscritos.size > 0 ? [...inscritos].pop() : '-';

      // Atualizando a lista de artistas
      namesList.innerHTML = '';
      inscritos.forEach(inscrito => {
        const li = document.createElement('li');
        li.textContent = inscrito;
        namesList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar ou processar o arquivo CSV:', error);
    });
}

// Função para parsear CSV corretamente
function parseCSV(csv) {
  const linhas = csv.trim().split('\n').filter(linha => linha.trim() !== ''); // Ignorar linhas vazias
  const cabecalho = linhas[0].split(',').map(col => col.trim());
  const dados = [];

  linhas.slice(1).forEach(linha => {
    const colunas = linha.split(',');
    
    if (colunas.length >= 2) { // Evita erros se houver colunas faltando
      const inscrito = colunas[0].trim();
      const obras = colunas.slice(1).map(obra => obra.trim()).join(';'); // Une obras corretamente

      dados.push({
        INSCRITOS: inscrito,
        OBRAS: obras
      });
    }
  });

  return dados;
}
