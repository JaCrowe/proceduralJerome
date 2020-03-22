#include <string>
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <GLES3/gl3.h>
#include <iostream>
#include <fstream>
#include "pjshader.h"
#include "pjmanager.h"
#include <list>

#define GL_GLEXT_PROTOTYPES
using namespace std;

int main(int argc, char *argv[])
{
    PJManager *pjManager = new PJManager();

    PJShader *pjShader = new PJShader("shaders/simple.vert");
    pjShader->addShader("shaders/simple.vert");
    pjShader->addShader("shaders/simple.frag", true);

    pjManager->bindShaders(pjShader);
    pjManager->initOpenGL();
    pjManager->initGeometry();
    pjManager->initLoop();

    return 0;
}
