const Project = ({ title, languages, date, id }) => `
<div class="project-box cursor-link" onclick="open_project('${id}');">
    <p class="project-title">${title}</p>
    <p class="project-langs">${languages}</p>
    <p class="project-date">${date}</p>
</div>
`;
const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

async function open_project(id){
    var response = await fetch("projects/"+id+"/page.md");
    var text = await response.text();
    var parsed = reader.parse(text);
    $("#project-view")[0].innerHTML = writer.render(parsed);
    $("#project-view").addClass("open");
    $("#project-view-block").addClass("open");

    var url = new URL(window.location.href);
    url.searchParams.set("project", id);
    window.history.replaceState(null, document.title, url.href)
}

function close_project(){
    $("#project-view").removeClass("open");
    $("#project-view-block").removeClass("open");

    var url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.history.replaceState(null, document.title, url.href)
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

var url = new URL(window.location.href);
var project = url.searchParams.get("project");
if(project != null){
    open_project(project);
}