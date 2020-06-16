#include "pjmanager.h"
#include "pjgeometry.h"
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>

void PJManager::initSDL()
{
    SDL_Init(SDL_INIT_VIDEO);
    SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
    SDL_GL_SetAttribute(SDL_GL_ACCELERATED_VISUAL, 1);
    SDL_GL_SetAttribute(SDL_GL_RED_SIZE, 8);
    SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE, 8);
    SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE, 8);
    SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE, 8);

    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 2);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);

    width = 800;
    height = 800;

    window = SDL_CreateWindow("", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, width, height, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    context = SDL_GL_CreateContext(window);

    program = glCreateProgram();
}

void PJManager::initOpenGL()
{
    glBindAttribLocation(program, attrib_position, "i_position");
    glBindAttribLocation(program, attrib_color, "i_color");
    glLinkProgram(program);

    glUseProgram(program);

    glUniform1f(glGetUniformLocation(program, "i_time"), time);
    glUniform2f(glGetUniformLocation(program, "i_resolution"), width, height);
    glUniform2f(glGetUniformLocation(program, "i_mouse"), width / 2.0, height / 2.0);

    glDisable(GL_DEPTH_TEST);
    glClearColor(0.5, 0.0, 0.0, 0.0);
    glViewport(0, 0, width, height);
}

void PJManager::initGeometry()
{
    t_mat4x4 projection_matrix;

    float angleOfView = 90;
    float near = 0.1;
    float far = 100;
    float imageAspectRatio = width / (float)height;
    // Perspective code
    float b, t, l, r;
    std::cout << "Height, width? " << height << ", " << width << std::endl;
    gluPerspective(angleOfView, imageAspectRatio, near, far, b, t, l, r);
    std::cout << "b, t, l, r, near, far? " << b << ", " << t << ", " << l << ", " << r << ", " << near << ", " << far << std::endl;
    glFrustum(b, t, l, r, near, far, projection_matrix);
    std::cout << projection_matrix << std::endl;
    // Ortho code
    // mat4x4_ortho(projection_matrix, 0.0f, (float)width, (float)height, 0.0f, 0.0f, 100.0f);

    glUniformMatrix4fv(glGetUniformLocation(program, "u_projection_matrix"), 1, GL_FALSE, projection_matrix);
}

PJManager::PJManager()
{
    initSDL();
}

void PJManager::bindShaders(PJShader *shader)
{
    shader->bindShaders(program);
}

void PJManager::tweenPosition(int target, float *value)
{
    *value = *value + (((float)target) - *value) * 0.01;
}

int PJManager::initLoop(PJGeometry *geo)
{
    for (;;)
    {
        glClear(GL_COLOR_BUFFER_BIT);

        SDL_Event event;
        while (SDL_PollEvent(&event))
        {
            switch (event.type)
            {
            case SDL_KEYUP:
                if (event.key.keysym.sym == SDLK_ESCAPE)
                    return 0;
                break;
            case SDL_MOUSEMOTION:
                SDL_GetMouseState(&mouseTargetX, &mouseTargetY);
            }
        }

        time += 0.005;
        tweenPosition(mouseTargetX, &mouseX);
        tweenPosition(mouseTargetY, &mouseY);
        geo->bindGeo();
        glUniform2f(glGetUniformLocation(program, "i_mouse"), mouseX, mouseY);
        glUniform1f(glGetUniformLocation(program, "i_time"), time);
        glDrawArrays(GL_TRIANGLES, 0, 6);
        SDL_GL_SwapWindow(window);
        SDL_Delay(1);
    }

    return 0;
}

PJManager::~PJManager()
{
    SDL_GL_DeleteContext(context);
    SDL_DestroyWindow(window);
    SDL_Quit();
}
