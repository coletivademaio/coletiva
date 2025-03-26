document.addEventListener('DOMContentLoaded', function() {
  carregarDados();
});

function carregarDados() {
  const namesList = document.getElementById('namesList');
  const totalCount = document.getElementById('totalCount');
  const totalWorks = document.getElementById('totalWorks');
  const lastAdded = document.getElementById('lastAdded');

  // Verificando se os elementos foram encontrados
  if (!namesList || !totalCount || !totalWorks || !lastAdded) {
    console.error('Um ou mais elementos não foram encontrados no DOM.');
    return;
  }

  fetch('dados.csv')  // Caminho para o seu arquivo CSV
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao carregar o arquivo CSV');
      }
      return response.text();
    })
    .then(csv => {
      const dados = parseCSV(csv);
      const obrasPorInscrito = {};
      const inscritos = new Set();  // Para garantir que estamos contando inscritos únicos

      dados.forEach(item => {
        const inscrito = item.INSCRITOS;

        if (inscrito) {
          // Garantir que o inscrito seja contado apenas uma vez
          inscritos.add(inscrito);

          // Inicializar contador de obras se não existir
          if (!obrasPorInscrito[inscrito]) {
            obrasPorInscrito[inscrito] = 0;
          }

          // Incrementa a quantidade de obras do inscrito
          obrasPorInscrito[inscrito]++;
        }
      });

      // Atualizando as estatísticas
      totalCount.textContent = inscritos.size;
      totalWorks.textContent = Object.values(obrasPorInscrito).reduce((acc, count) => acc + count, 0);

      // Exibindo o último artista adicionado
      if (inscritos.size > 0) {
        lastAdded.textContent = [...inscritos].pop();
      }
    })
    .catch(error => {
      console.error('Erro ao carregar ou processar o arquivo CSV:', error);
    });
}

// Função para parsear CSV simples
function parseCSV(csv) {
  const linhas = csv.split('\n').filter(linha => linha.trim() !== '');  // Ignorar linhas vazias
  const cabecalho = linhas[0].split(',');  // Primeira linha é o cabeçalho
  const dados = linhas.slice(1).map(linha => {
    const colunas = linha.split(',');
    const obj = {};

    colunas.forEach((valor, index) => {
      // Garantir que o valor não seja undefined ou null antes de chamar o método trim()
      obj[cabecalho[index].trim()] = valor ? valor.trim() : '';  // Se for undefined ou null, atribui string vazia
    });

    return obj;
  });

  return dados;
}

