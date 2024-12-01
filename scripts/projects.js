const Project = ({ title, languages, date, id }) => `
<div class="project-box cursor-link" onclick="open_project('${id}');">
    <p class="project-title">${title}</p>
    <p class="project-langs">${languages}</p>
    <p class="project-date">${date}</p>
</div>
`;

async function open_project(id){
    var response = await fetch("projects/"+id+"/page.md");
    var text = await response.text();
    $("#project-view")[0].innerHTML = marked.parse(text);
    $("#project-view").addClass("open");
    $("#project-view-block").addClass("open");
}

function close_project(){
    $("#project-view").removeClass("open");
    $("#project-view-block").removeClass("open");
}

function add_project(project, parent){
    var element = document.createElement('div');
    element.innerHTML = Project({
        "title": project.title,
        "languages": project.langs,
        "date": project.date,
        "id": project.id
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