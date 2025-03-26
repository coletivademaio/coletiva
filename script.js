async function carregarDados() {
    try {
        const response = await fetch('dados.csv'); // Busca o arquivo CSV
        const csvText = await response.text(); // Converte para texto
        
        console.log("CSV Carregado: ", csvText); // Debug: ver o conteúdo do CSV

        const linhas = csvText.trim().split("\n").slice(1); // Remove o cabeçalho

        if (linhas.length === 0) {
            console.warn("⚠️ Nenhum dado encontrado no CSV.");
            return;
        }

        const namesList = document.getElementById("namesList");
        namesList.innerHTML = ""; // Limpa a lista antes de adicionar os nomes

        let ultimoNome = "";
        let totalObras = 0;

        linhas.forEach(linha => {
            const partes = linha.split(","); // Separa Nome e Obras
            const nome = partes[0].trim();
            const obras = partes[1] ? partes[1].split(";").map(o => o.trim()) : [];

            // Criar elemento da lista
            const li = document.createElement("li");
            li.innerHTML = `<strong>${nome}</strong>: ${obras.join(", ")}`;
            namesList.appendChild(li);

            // Atualizar estatísticas
            ultimoNome = nome;
            totalObras += obras.length;
        });

        // Exibir total de artistas e o último nome adicionado
        document.getElementById("totalCount").textContent = linhas.length;
        document.getElementById("lastAdded").textContent = ultimoNome;
        document.getElementById("totalWorks").textContent = totalObras;

    } catch (error) {
        console.error("❌ Erro ao buscar os dados:", error);
    }
}

// Chama a função ao carregar a página
carregarDados();
