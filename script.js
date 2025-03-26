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
      try {
        const dados = parseCSV(csv);
        if (dados.length === 0) {
          throw new Error('O CSV está vazio ou não foi processado corretamente.');
        }

        const obrasPorInscrito = {};
        const inscritos = new Set();

        dados.forEach(item => {
          const inscrito = item.INSCRITOS || ''; // Garante que existe
          const obras = item.OBRAS ? item.OBRAS.split(';') : [];

          if (inscrito.trim() !== '') {
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

      } catch (error) {
        console.error('Erro ao processar os dados:', error);
      }
    })
    .catch(error => {
      console.error('Erro ao carregar o arquivo CSV:', error);
    });
}

// Função para parsear CSV corretamente
function parseCSV(csv) {
  if (!csv) {
    console.error('O arquivo CSV está vazio.');
    return [];
  }

  let linhas = csv.split(/\r?\n/).filter(linha => linha.trim() !== ''); // Remove linhas vazias
  if (linhas.length < 2) {
    console.error('O CSV contém apenas cabeçalho ou está vazio.');
    return [];
  }

  // Detecta automaticamente o delimitador: ',' ou ';'
  let delimitador = linhas[0].includes(';') ? ';' : ',';

  const cabecalho = linhas[0].split(delimitador).map(col => col.trim());
  const dados = [];

  linhas.slice(1).forEach(linha => {
    const colunas = linha.split(delimitador).map(col => col.trim());

    // Ignora linhas incompletas
    if (colunas.length < cabecalho.length) {
      console.warn('Linha ignorada (faltando colunas):', linha);
      return;
    }

    let obj = {};
    cabecalho.forEach((chave, index) => {
      obj[chave] = colunas[index] || ''; // Garante que não seja undefined
    });

    dados.push(obj);
  });

  return dados;
}
