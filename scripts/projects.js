const Project = ({ title, languages, date }) => `
<div class="project-box cursor-link">
    <p class="project-title">${title}</p>
    <p class="project-langs">${languages}</p>
    <p class="project-date">${date}</p>
</div>
`;

function add_project(project, parent){
    var element = document.createElement('div');
    element.innerHTML = Project({
        "title": project.title,
        "languages": project.langs,
        "date": project.date
    });

    parent.appendChild(element.children[0]);
}

async function get_projects(file) {
    var response = await fetch("projects.json");
    var projects = await response.json();

    for(var i = 0; i < projects.length; i++){
        var response = await fetch("projects/"+projects[i]+"/data.json");
        var project = await response.json();

        project.id = projects[i];
        add_project(project, $("#project-container")[0]);
    }
}

get_projects();