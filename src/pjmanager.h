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

// compute screen coordinates first
static inline void gluPerspective(
    float angleOfView,
    float imageAspectRatio,
    float n, float f,
    float b, float t, float l, float r)
{
    float scale = tan(angleOfView * 0.5 * M_PI / 180) * n;
    r = imageAspectRatio * scale, l = -r;
    t = scale, b = -t;
}

// set the OpenGL perspective projection matrix
static inline void glFrustum(
    float b, float t, float l, float r,
    float n, float f,
    t_mat4x4 out)
{
    // set OpenGL perspective projection matrix
    // M[0][0] = 2 * n / (r - l);
    // M[0][1] = 0;
    // M[0][2] = 0;
    // M[0][3] = 0;

    // M[1][0] = 0;
    // M[1][1] = 2 * n / (t - b);
    // M[1][2] = 0;
    // M[1][3] = 0;

    // M[2][0] = (r + l) / (r - l);
    // M[2][1] = (t + b) / (t - b);
    // M[2][2] = -(f + n) / (f - n);
    // M[2][3] = -1;

    // M[3][0] = 0;
    // M[3][1] = 0;
    // M[3][2] = -2 * f * n / (f - n);
    // M[3][3] = 0;
#define T(a, b) (a * 4 + b)

    out[T(0, 0)] = 2.0f * n / (r - l);
    out[T(0, 1)] = 0.0f;
    out[T(0, 2)] = 0.0f;
    out[T(0, 3)] = 0.0f;

    out[T(1, 1)] = 0.0f;
    out[T(1, 0)] = 2.0f * n / (t - b);
    out[T(1, 2)] = 0.0f;
    out[T(1, 3)] = 0.0f;

    out[T(2, 2)] = (r + l) / (r - l);
    out[T(2, 0)] = (t + b) / (t - b);
    out[T(2, 1)] = -(f + n) / (f - n);
    out[T(2, 3)] = -1.0f;

    out[T(3, 0)] = 0.0f;
    out[T(3, 1)] = 0.0f;
    out[T(3, 2)] = -2.0f * f * n / (f - n);
    out[T(3, 3)] = 1.0f;

#undef T
}

static inline void mat4x4_perspective(t_mat4x4 out, float left, float right, float bottom, float top, float znear, float zfar)
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
    float width, height;
    double time = 0;
    int mouseTargetX, mouseTargetY;
    float mouseX, mouseY;
    void tweenPosition(int target, float *value);

public:
    GLuint program;

    PJManager();
    ~PJManager();
    void initSDL();
    void initOpenGL();
    void initGeometry();
    void init();
    void bindShaders(PJShader *shader);
    int initLoop(PJGeometry *geo);
};
#endif
