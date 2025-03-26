async function carregarDados() {
    try {
        const response = await fetch('dados.csv'); // Busca o arquivo CSV
        const csvText = await response.text(); // Converte para texto
        
        console.log("CSV Carregado: ", csvText); // Debug: ver o conteúdo do CSV

        const linhas = csvText.trim().split("\n").slice(1); // Remove o cabeçalho "Nome"

        if (linhas.length === 0) {
            console.warn("⚠️ Nenhum nome encontrado no CSV.");
            return;
        }

        // Exibe os nomes na lista
        const namesList = document.getElementById("namesList");
        namesList.innerHTML = ""; // Limpa a lista antes de adicionar os nomes

        linhas.forEach(nome => {
            const li = document.createElement("li");
            li.textContent = nome.trim(); // Remove espaços extras
            namesList.appendChild(li);
        });

        // Exibe a quantidade total de nomes
        document.getElementById("totalCount").textContent = linhas.length;

        // Exibe o último nome adicionado
        document.getElementById("lastAdded").textContent = linhas[linhas.length - 1] || "-";

    } catch (error) {
        console.error("❌ Erro ao buscar os dados:", error);
    }
}

// Chama a função ao carregar a página
carregarDados();
