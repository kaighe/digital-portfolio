function add_project(project){
    console.log(project);
}

async function get_projects(file) {
    var response = await fetch("projects.json");
    var projects = await response.json();

    for(var i = 0; i < projects.length; i++){
        var response = await fetch("projects/"+projects[i]+"/data.json");
        var project = await response.json();

        project.id = projects[i];
        add_project(project);
    }
}

get_projects();