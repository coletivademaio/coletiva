fetch('dados.csv')
  .then(response => response.text())
  .then(csv => {
    const dados = parseCSV(csv);
    const obrasPorInscrito = {};
    const inscritos = new Set();  // Para garantir que estamos contando inscritos únicos

    dados.forEach(item => {
      const inscrito = item.INSCRITOS;
      
      // Garantir que o inscrito seja contado apenas uma vez
      inscritos.add(inscrito);

      if (!obrasPorInscrito[inscrito]) {
        obrasPorInscrito[inscrito] = 0;
      }
      obrasPorInscrito[inscrito]++;
    });

    // Agora você pode ver o número de inscritos únicos e as obras por inscrito
    console.log("Inscritos Únicos:", inscritos.size);
    console.log("Obras por Inscrito:", obrasPorInscrito);
  });

// Função para parsear CSV simples
function parseCSV(csv) {
  const linhas = csv.split('\n');
  const cabecalho = linhas[0].split(',');
  const dados = linhas.slice(1).map(linha => {
    const colunas = linha.split(',');
    const obj = {};
    colunas.forEach((valor, index) => {
      obj[cabecalho[index].trim()] = valor.trim();
    });
    return obj;
  });
  return dados;
}
