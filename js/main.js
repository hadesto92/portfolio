const username = "hadesto92";

async function loadGitHubRepos() {
    const container = document.getElementById("projects-container");
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        const repos = await response.json();

        if (!Array.isArray(repos)) {
            container.innerHTML = "<p>Błąd: nie udało się pobrać projektów.</p>";
            return;
        }

        repos.forEach(repo => {
            const card = document.createElement("div");
            card.className = "repo-card";
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : "Brak opisu"}</p>
                <a href="${repo.html_url}" target="_blank">GitHub</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Demo</a>` : ""}
            `;
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "<p>Wystąpił błąd przy ładowaniu projektów.</p>";
        console.error(error);
    }
}

loadGitHubRepos();
