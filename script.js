window.onload = function () {
  fetchProjects();
};

let allProjects = [];
function fetchProjects() {
  const projectsContainer = document.getElementById('projects');
  fetch('https://api.github.com/users/huandrey/repos')  // Substitua 'SeuUsuario' pelo seu usuário do GitHub
    .then(response => response.json())
    .then(data => {
      allProjects = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      displayProjects(data);
      updateLanguageOptions(data);
    })
    .catch(error => console.error('Erro ao buscar projetos:', error));
}


function displayProjects(projects) {
  const projectsContainer = document.getElementById('projects');
  projectsContainer.innerHTML = ''; // Clear previous projects
  projects.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project';
    projectDiv.innerHTML = `
      <div>
        <div>
          <h3>${project.name}</h3>
          <i class="fa-solid fa-copy"></i>
          </div>
        ${project.description ? `<p>${project.description}</p>` : ''}
        Linguagem: <span>${project.language ?? 'txt'}</span>
        
        ${project.topics.length ? `<div class="topics">Tópicos: ${project.topics.map(topic => `<span class="badge" style="background-color: ${getRandomColor()}">${topic}</span>`).join(' ')}</div>` : ''}
      </div>
      <button onclick="copyToClipboard('${project.git_url}')">Visitar Projeto</button>
    `;
    projectsContainer.appendChild(projectDiv);
  });
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 100%, 70%)`; // Gera uma cor HSL aleatória
}

function updateLanguageOptions(data) {
  const languages = new Set(data.map(project => project.language).filter(Boolean));
  console.log(languages)
  const filter = document.getElementById('languageFilter');
  languages.forEach(language => {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = language;
    filter.appendChild(option);
  });
}

function filterProjects() {
  const selectedLanguage = document.getElementById('languageFilter').value;
  const filteredProjects = allProjects.filter(project => project.language === selectedLanguage || selectedLanguage === 'All');
  displayProjects(filteredProjects);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('URL do Git copiada para a área de transferência!');
  }, () => {
    alert('Falha ao copiar URL.');
  });
}
