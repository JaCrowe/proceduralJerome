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
    PJShader *vShader = new PJShader("shaders/simple.vert");
    vShader->addShader("shaders/simple.vert");
    vShader->addShader("shaders/simple.frag", true);
    pjManager->bindShaders(vShader);
    pjManager->initOpenGL();

    return 0;
}
