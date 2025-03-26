fetch('dados.csv')
  .then(response => response.text())
  .then(csv => {
    const dados = parseCSV(csv);
    const obrasPorInscrito = {};
    const inscritos = new Set();  // Para garantir que estamos contando inscritos únicos

    dados.forEach(item => {
      const inscrito = item.INSCRITOS;

      if (inscrito) { // Verifique se o nome do inscrito existe
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

    // Agora você pode ver o número de inscritos únicos e as obras por inscrito
    console.log("Inscritos Únicos:", inscritos.size);
    console.log("Obras por Inscrito:", obrasPorInscrito);

    // Exemplo de como mostrar no HTML (caso necessário)
    document.getElementById('totalCount').textContent = inscritos.size;
    document.getElementById('totalWorks').textContent = Object.values(obrasPorInscrito).reduce((acc, count) => acc + count, 0);
  })
  .catch(error => {
    console.error('Erro ao carregar o arquivo CSV:', error);
  });

// Função para parsear CSV simples
function parseCSV(csv) {
  const linhas = csv.split('\n').filter(linha => linha.trim() !== ''); // Ignorar linhas vazias
  const cabecalho = linhas[0].split(','); // Primeira linha é o cabeçalho
  const dados = linhas.slice(1).map(linha => {
    const colunas = linha.split(',');
    const obj = {};

    colunas.forEach((valor, index) => {
      obj[cabecalho[index].trim()] = valor.trim(); // Atribui o valor do CSV ao objeto
    });

    return obj;
  });

  return dados;
}
