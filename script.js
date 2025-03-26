async function carregarDados() {
    try {
        const response = await fetch('dados.csv'); // Certifique-se de que o CSV está na mesma pasta do HTML
        const data = await response.text();
        const linhas = data.split('\n').map(linha => linha.trim()).filter(linha => linha);
        
        const artistsList = document.getElementById("artistsList");
        artistsList.innerHTML = "";
        
        let artistas = [];
        
        linhas.forEach(linha => {
            const [nome, ...obras] = linha.split(',');
            if (nome && obras.length > 0) {
                artistas.push({ nome, obras });
            }
        });
        
        artistas.forEach(artista => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${artista.nome}</strong>: ${artista.obras.join(', ')}`;
            artistsList.appendChild(li);
        });
        
        document.getElementById("totalCount").textContent = artistas.length;
        document.getElementById("lastAdded").textContent = artistas.length > 0 ? artistas[artistas.length - 1].nome : "-";
        
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

document.addEventListener("DOMContentLoaded", carregarDados);
