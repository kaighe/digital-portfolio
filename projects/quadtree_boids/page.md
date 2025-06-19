# Quadtree Boids
> *Optimized Javascript boids*
>
> [`Github`](https://github.com/kaighe/digital-portfolio/blob/main/scripts/boids.js)

Boids is an artificial life program that resembles flocking birds, the tadpole like particles at the top of this page are my implementation of said program. The boids use a quadtree for fast spacial partitioning as well as a flowmap to direct the boids without having to check individual relations between them. From my very limited searching, this might currently be the fastest single-threaded JS boids implementation online, although I think it could definitly be optimised further.