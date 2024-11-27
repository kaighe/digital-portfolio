const BOID_COUNT = 1000;

const BOID_VISUAL_RANGE = 100;
const BOID_PROTECTED_RANGE = 15;
const BOID_MAX_SPEED = 1.5;
const BOID_MIN_SPEED = 0.3;

const BOID_ALIGNMENT = 0.05;
const BOID_SEPARATION = 0.05;
const BOID_COHESION = 0.005;

const BOID_SCREEN_EDGE_AVOIDANCE = 0.3;
const BOID_SCREEN_MARGIN = 40;

const BOID_MOUSE_AVOIDANCE = 0.1;
const BOID_MOUSE_RANGE = 80;

const canvas = $("#boid-canvas")[0];
const ctx = canvas.getContext("2d");

Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};

function clamp(a, min, max){
    return Math.max(Math.min(a, max), min);
}

$(window).on("resize", function(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
});
$(window).trigger("resize");

class vec2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    length(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    scale(a){
        return new vec2(this.x*a, this.y*a);
    }

    add(other){
        return new vec2(this.x+other.x, this.y+other.y);
    }
    sub(other){
        return new vec2(this.x-other.x, this.y-other.y);
    }

    normalize(){
        if(this.length() == 0) return new vec2(0, 0);
        return new vec2(this.x/this.length(), this.y/this.length());
    }
}

class Particle {
    constructor(x, y, color){
        this.position = new vec2(x, y);
        this.color = color;
        this.velocity = new vec2(Math.random()*2-1, Math.random()*2-1).normalize();
        this.parent = null;
        this.data = {};
    }
}

class QuadNode {
    constructor(parent, pos, size){
        this.parent = parent;
        this.pos = pos;
        this.size = size;
        this.children = null;
        this.particles = [];
        
        this.data = {
            "sum_position": new vec2(0, 0),
            "sum_direction": new vec2(0, 0),
            "particles": 0,
        };
    }

    is_leaf(){
        return (this.children == null);
    }

    divide(){
        if(this.is_leaf()){
            this.children = [
                [
                    new QuadNode(this, this.pos, this.size/2), 
                    new QuadNode(this, this.pos.add(new vec2(0, this.size/2)), this.size/2)
                ],
                [
                    new QuadNode(this, this.pos.add(new vec2(this.size/2, 0)), this.size/2), 
                    new QuadNode(this, this.pos.add(new vec2(this.size/2, this.size/2)), this.size/2)
                ]
            ];

            for(var i = 0; i < this.particles.length; i++){
                particle = this.particles[i];
                var new_cell_x = Math.floor((particle.position.x - this.pos.x)/this.size*2);
                var new_cell_y = Math.floor((particle.position.y - this.pos.y)/this.size*2);
                this.children[new_cell_x][new_cell_y].particles.push(particle);
            }
            this.particles = [];
        }
    }

    count_particles(){
        if(this.is_leaf()){
            return this.particles.length;
        }else{
            return this.children[0][0].count_particles() + this.children[0][1].count_particles() + this.children[1][0].count_particles() + this.children[1][1].count_particles();
        }
    }

    collapse(){
        this.particles = this._collapse_rec(this);
        this.children = null;
    }
    _collapse_rec(base){
        if(this.is_leaf()){
            this.particles.forEach(particle => {
                particle.parent = base;
            });
            return this.particles;
        }else{
            return this.children[0][0]._collapse_rec(base).concat(this.children[0][1]._collapse_rec(base)).concat(this.children[1][0]._collapse_rec(base)).concat(this.children[1][1]._collapse_rec(base))
        }
    }

    check_collapse(){
        if(this.is_leaf()){
            this._check_collapse_rec(this);
        }else{
            throw new Error("QuadNode must be a leaf to use check_collapse()");
        }
    }
    _check_collapse_rec(node){
        if(node.count_particles() <= 1){
            node.collapse();
            if(node.parent != null){
                this._check_collapse_rec(node.parent);
            }
        }
    }

    get_particles(){
        if(this.is_leaf()){
            return this.particles;
        }else{
            return this.children[0][0].get_particles().concat(this.children[0][1].get_particles()).concat(this.children[1][0].get_particles()).concat(this.children[1][1].get_particles())
        }
    }
}

class QuadTree {
    constructor(width, height, max_depth){
        this.size = Math.max(width, height);
        this.width = width;
        this.height = height;
        this.max_depth = max_depth;
        this.root = new QuadNode(null, new vec2(0, 0), this.size);
    }

    add(particle){
        this._add_rec(particle, this.root, 0);
    }
    _add_rec(particle, node, depth){
        if((node.particles.length == 0 && node.is_leaf()) || depth >= this.max_depth){
            node.particles.push(particle);
            particle.parent = node;
        }else{
            if(node.is_leaf()){
                node.divide();
            }
            var div_x = Math.floor((particle.position.x - node.pos.x)/node.size*2);
            var div_y = Math.floor((particle.position.y - node.pos.y)/node.size*2);
            this._add_rec(particle, node.children[div_x][div_y], depth+1);
        }
    }

    update_particles(callback){
        this.update_data();
        this._update_particles_rec(this.root, callback);
    }
    _update_particles_rec(node, callback){
        if(node.is_leaf()){
            var new_particles = [];
            for(var i = 0; i < node.particles.length; i++){
                var particle = node.particles[i];

                callback(particle);

                particle.position = particle.position.add(particle.velocity);
                particle.position.x = clamp(particle.position.x, 0, this.width-1);
                particle.position.y = clamp(particle.position.y, 0, this.height-1);

                if( particle.position.x < node.pos.x || particle.position.x >= node.pos.x+node.size ||
                    particle.position.y < node.pos.y || particle.position.y >= node.pos.y+node.size){
                    this.add(particle);
                }else{
                    new_particles.push(particle);
                }
            }
            node.particles = new_particles;
            node.check_collapse();
        }else{
            if(node && !node.is_leaf()) this._update_particles_rec(node.children[0][0], callback);
            if(node && !node.is_leaf()) this._update_particles_rec(node.children[0][1], callback);
            if(node && !node.is_leaf()) this._update_particles_rec(node.children[1][0], callback);
            if(node && !node.is_leaf()) this._update_particles_rec(node.children[1][1], callback);
        }
    }

    get_nodes_in_range(p, r){
        return this._get_nodes_in_range_rec(this.root, p, r, [])
    }
    _get_nodes_in_range_rec(node, p, r, node_list){
        var d1 = node.pos.sub(p).length();
        var d2 = node.pos.add(new vec2(node.size, 0)).sub(p).length();
        var d3 = node.pos.add(new vec2(node.size, node.size)).sub(p).length();
        var d4 = node.pos.add(new vec2(0, node.size)).sub(p).length();
        if(d1 <= r && d2 <= r && d3 <= r && d4 <= r){
            return node_list.concat(node);
        }else if(!node.is_leaf()){
            node_list = this._get_nodes_in_range_rec(node.children[0][0], p, r, node_list);
            node_list = this._get_nodes_in_range_rec(node.children[0][1], p, r, node_list);
            node_list = this._get_nodes_in_range_rec(node.children[1][0], p, r, node_list);
            return this._get_nodes_in_range_rec(node.children[1][1], p, r, node_list);
        }else{
            return node_list;
        }
    }

    update_data(){
        this._update_data_rec(this.root);
    }
    _update_data_rec(node){
        if(node.is_leaf()){
            node.data.particles = node.particles.length;
            node.data.sum_position = new vec2(0, 0);
            node.data.sum_direction = new vec2(0, 0);
            for(var i = 0; i < node.particles.length; i++){
                var particle = node.particles[i];
                node.data.sum_position = node.data.sum_position.add(particle.position);
                node.data.sum_direction = node.data.sum_direction.add(particle.velocity);
            }
        }else{
            this._update_data_rec(node.children[0][0]);
            this._update_data_rec(node.children[0][1]);
            this._update_data_rec(node.children[1][0]);
            this._update_data_rec(node.children[1][1]);

            node.data.particles = node.children[0][0].data.particles + node.children[0][1].data.particles + node.children[1][0].data.particles + node.children[1][1].data.particles;
            node.data.sum_position = node.children[0][0].data.sum_position.add(node.children[0][1].data.sum_position).add(node.children[1][0].data.sum_position).add(node.children[1][1].data.sum_position);
            node.data.sum_direction = node.children[0][0].data.sum_direction.add(node.children[0][1].data.sum_direction).add(node.children[1][0].data.sum_direction).add(node.children[1][1].data.sum_direction);
        }
    }
}


function draw_quadtree_rec(node, size, pos, ctx){
    if(node == null) return;

    if(node.is_leaf()){
        for(var i = 0; i < node.particles.length; i++){
            var particle = node.particles[i];
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.position.x-1, particle.position.y-1, 2, 2);
        }

        ctx.beginPath();
        ctx.moveTo(pos.x+size, pos.y);
        ctx.lineTo(pos.x+size, pos.y+size);
        ctx.lineTo(pos.x, pos.y+size);
        ctx.stroke();
    }else{
        size /= 2;
        draw_quadtree_rec(node.children[0][0], size, pos, ctx);
        draw_quadtree_rec(node.children[0][1], size, pos.add(new vec2(0, size)), ctx);
        draw_quadtree_rec(node.children[1][0], size, pos.add(new vec2(size, 0)), ctx);
        draw_quadtree_rec(node.children[1][1], size, pos.add(new vec2(size, size)), ctx);
    }
}

$("#landing").on("mousemove", function(e){
    var rect = this.getBoundingClientRect();
    mouse_pos.x = e.clientX - rect.left;
    mouse_pos.y = e.clientY - rect.top;

    if(jQuery.browser.mobile){
        setTimeout(function(){
            mouse_pos.x = -1000;
            mouse_pos.y = -1000;
        }, 500);
    }
})
$("#landing").on("mouseleave", function(e){
    mouse_pos.x = -1000;
    mouse_pos.y = -1000;
})

const quadtree = new QuadTree(canvas.width, canvas.height, 4);
for(var i = 0; i < BOID_COUNT; i++){
    var particle = new Particle(Math.random()*canvas.width, Math.random()*canvas.height, "rgba(0, 0, 0, 0.1)");
    particle.data.id = i;
    quadtree.add(particle);
}

var lastUpdate = Date.now();
var tick_count = 0;
var fps = 50;
var mouse_pos = new vec2(-1000, -1000);
loop();
function loop() {
    var now = Date.now();
    var dt = (now - lastUpdate)/1000;
    lastUpdate = now;
    tick_count++;

    if(dt != 0) fps = Math.round((fps + (1/dt - fps)*0.05)*10)/10;
    $("#fps-counter")[0].innerText = fps+"fps";

    tick(dt);
    requestAnimationFrame(loop);
}


function tick(dt){
    ctx.fillStyle = "rgba(255, 255, 255, "+ (10*dt) +")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    quadtree.update_particles(function(p){
        if(p.data.id%2 != tick_count%2) return
        var nodes = quadtree.get_nodes_in_range(p.position, BOID_VISUAL_RANGE);
        var average_position = new vec2(0, 0);
        var average_direction = new vec2(0, 0);
        var n = 0;
        nodes.forEach(node => {
            average_position = average_position.add(node.data.sum_position);
            average_direction = average_direction.add(node.data.sum_direction);
            n += node.data.particles;
            var particles = node.get_particles();
            particles.forEach(p2 => {
                var distance = p2.position.sub(p.position).length();
                if(distance <= BOID_PROTECTED_RANGE){
                    p.velocity = p.velocity.add(p.position.sub(p2.position).scale(BOID_SEPARATION));
                }
            });
        });
        if(n > 0){
            average_position = average_position.scale(1/n);
            average_direction = average_direction.scale(1/n);
            p.velocity = p.velocity.add(average_direction.sub(p.velocity).scale(BOID_ALIGNMENT));
            p.velocity = p.velocity.add(average_position.sub(p.position).scale(BOID_COHESION));
        }
        if(p.position.sub(mouse_pos).length() < BOID_MOUSE_RANGE){
            p.velocity = p.velocity.add(p.position.sub(mouse_pos).scale(BOID_MOUSE_AVOIDANCE));
        }
        // var center = new vec2(quadtree.width/2, quadtree.height/2);
        // if(p.position.sub(center).length() < 150){
        //     p.velocity = p.velocity.add(p.position.sub(center).normalize().scale(BOID_AVOIDANCE));
        // }

        if(p.position.x < BOID_SCREEN_MARGIN){
            p.velocity.x += BOID_SCREEN_EDGE_AVOIDANCE;
        }if(p.position.y < BOID_SCREEN_MARGIN){
            p.velocity.y += BOID_SCREEN_EDGE_AVOIDANCE;
        }
        if(p.position.x > quadtree.width - BOID_SCREEN_MARGIN){
            p.velocity.x -= BOID_SCREEN_EDGE_AVOIDANCE;
        }if(p.position.y > quadtree.height - BOID_SCREEN_MARGIN){
            p.velocity.y -= BOID_SCREEN_EDGE_AVOIDANCE;
        }

        if(p.velocity.length() > BOID_MAX_SPEED){
            p.velocity = p.velocity.normalize().scale(BOID_MAX_SPEED);
        }else if(p.velocity.length() < BOID_MIN_SPEED){
            p.velocity = p.velocity.normalize().scale(BOID_MIN_SPEED);
        }
    });

    ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";
    ctx.setLineDash([3, 3]);
    draw_quadtree_rec(quadtree.root, quadtree.size, new vec2(0, 0), ctx); // lily loves kai
}