#include "pjgeometry.h"
#include <GLES3/gl3.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>

void PJGeometry::init()
{
    width = 800;
    height = 800;

    glGenVertexArrays(1, &vao);
    glGenBuffers(1, &vbo);
    glBindVertexArray(vao);
    glBindBuffer(GL_ARRAY_BUFFER, vbo);

    glEnableVertexAttribArray(attrib_position);
    glEnableVertexAttribArray(attrib_color);

    glVertexAttribPointer(attrib_color, 4, GL_FLOAT, GL_FALSE, sizeof(float) * 6, 0);
    glVertexAttribPointer(attrib_position, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void *)(4 * sizeof(float)));

    const GLfloat g_vertex_buffer_data[] = {
        /*  R, G, B, A, X, Y  */
        1, 0, 0, 1, 0, 0,
        0, 1, 0, 1, width, 0,
        0, 0, 1, 1, width, height,

        1, 0, 0, 1, 0, 0,
        0, 0, 1, 1, width, height,
        1, 1, 1, 1, 0, height};

    glBufferData(GL_ARRAY_BUFFER, sizeof(g_vertex_buffer_data), g_vertex_buffer_data, GL_STATIC_DRAW);
}
void PJGeometry::bindGeo()
{
    glBindVertexArray(vao);
}

PJGeometry::PJGeometry()
{
    init();
}
