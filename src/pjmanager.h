#ifndef PJ_Manager
#define PJ_Manager
#include "pjshader.h"
#include "pjgeometry.h"
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <GLES3/gl3.h>
#include "pjtypes.h"

typedef float t_mat4x4[16];

static inline void mat4x4_ortho(t_mat4x4 out, float left, float right, float bottom, float top, float znear, float zfar)
{
#define T(a, b) (a * 4 + b)

    out[T(0, 0)] = 2.0f / (right - left);
    out[T(0, 1)] = 0.0f;
    out[T(0, 2)] = 0.0f;
    out[T(0, 3)] = 0.0f;

    out[T(1, 1)] = 2.0f / (top - bottom);
    out[T(1, 0)] = 0.0f;
    out[T(1, 2)] = 0.0f;
    out[T(1, 3)] = 0.0f;

    out[T(2, 2)] = -2.0f / (zfar - znear);
    out[T(2, 0)] = 0.0f;
    out[T(2, 1)] = 0.0f;
    out[T(2, 3)] = 0.0f;

    out[T(3, 0)] = -(right + left) / (right - left);
    out[T(3, 1)] = -(top + bottom) / (top - bottom);
    out[T(3, 2)] = -(zfar + znear) / (zfar - znear);
    out[T(3, 3)] = 1.0f;

#undef T
}

class PJManager
{
private:
    SDL_Window *window;
    SDL_GLContext context;
    GLuint vao, vbo;
    int width, height;
    int frame = 0;
    double time = 0;
    bool saveOutput;

public:
    GLuint program;

    PJManager(bool _saveOutput);
    ~PJManager();
    void initSDL();
    void initOpenGL();
    void initGeometry();
    void init();
    void bindShaders(PJShader *shader);
    int initLoop(PJGeometry *geo);

    int fps = 30;
    double run_length = 10.0;
};
#endif
