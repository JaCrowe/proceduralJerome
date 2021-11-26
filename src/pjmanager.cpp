#include "pjmanager.h"
#include "pjgeometry.h"
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <SDL2/SDL_image.h>

void Screenshot(int x, int y, int w, int h, const char * filename)
    {
        unsigned char * pixels = new unsigned char[w*h*4]; // 4 bytes for RGBA
        glReadPixels(x,y,w, h, GL_RGBA, GL_UNSIGNED_BYTE, pixels);

        SDL_Surface * surf = SDL_CreateRGBSurfaceFrom(pixels, w, h, 8*4, w*4, 0,0,0,0);
        // SDL_SaveBMP(surf, filename);
        IMG_SavePNG(surf, filename);
        SDL_FreeSurface(surf);
        delete [] pixels;
    }


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

    glDisable(GL_DEPTH_TEST);
    glClearColor(0.5, 0.0, 0.0, 0.0);
    glViewport(0, 0, width, height);
}

void PJManager::initGeometry()
{
    t_mat4x4 projection_matrix;
    mat4x4_ortho(projection_matrix, 0.0f, (float)width, (float)height, 0.0f, 0.0f, 100.0f);
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
            }
        }

        frame++;

        geo->bindGeo();
        glUniform1f(glGetUniformLocation(program, "i_time"), frame*0.005);
        glDrawArrays(GL_TRIANGLES, 0, 6);

        char fName[50];

        sprintf(fName, "out/capture_%03d.png", frame);

        // Screenshot(0,0,width,height,fName);

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
