#include <string>
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <GLES3/gl3.h>
#include <iostream>
#include <fstream>
#include "pjshader.h"
#include "pjmanager.h"
#include "pjgeometry.h"
#include <list>

#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libswscale/swscale.h>

#define GL_GLEXT_PROTOTYPES
using namespace std;

int main(int argc, char *argv[])
{
    PJManager *pjManager = new PJManager();

    PJShader *pjShader = new PJShader();
    pjShader->addShader("shaders/simple.vert");
    // pjShader->addShader("shaders/simple.frag", true);
    // pjShader->addShader("shaders/fragment_ebbnflow.frag", true);
    pjShader->addShader("shaders/fragment_diamondlattice.frag");
    // pjShader->addShader("shaders/blackout_tuesday.frag", true);
    pjShader->bindShaders(pjManager->program);

    pjManager->initOpenGL();
    PJGeometry *flatGeo = new PJGeometry();
    pjManager->initGeometry();
    pjManager->initLoop(flatGeo);

    return 0;
}
