#ifndef PJ_Geometry
#define PJ_Geometry
#include "pjshader.h"
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <GLES3/gl3.h>
#include "pjtypes.h"

class PJGeometry
{
private:
    int width, height;

public:
    GLuint vao, vbo;
    GLuint program;
    PJGeometry();
    ~PJGeometry();
    void init();
    void bindGeo();
};
#endif
