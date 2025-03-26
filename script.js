async function carregarDados() {
    try {
        const response = await fetch('dados.csv'); // Carrega o CSV
        const csvText = await response.text();
        const linhas = csvText.trim().split("\n").slice(1); // Ignora o cabeçalho "Nome"

        // Exibe os nomes na lista
        const namesList = document.getElementById("namesList");
        linhas.forEach(nome => {
            const li = document.createElement("li");
            li.textContent = nome;
            namesList.appendChild(li);
        });

        // Exibe a quantidade total de nomes
        document.getElementById("totalCount").textContent = linhas.length;

        // Exibe o último nome adicionado
        document.getElementById("lastAdded").textContent = linhas.length ? linhas[linhas.length - 1] : "-";

    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}

// Chama a função ao carregar a página
carregarDados();

