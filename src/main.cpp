#include <string>
#include <iostream>
#include <fstream>
#include <list>
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <GLES3/gl3.h>
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libswscale/swscale.h>
#include "pjshader.h"
#include "pjmanager.h"
#include "pjgeometry.h"
#include "pjaudiofile.h"

#define GL_GLEXT_PROTOTYPES
using namespace std;

std::string getFragmentShaderFilePath(int argc, char *argv[])
{

    for (int i = 1; i < argc; i++)
    {
        // Match so long as this arg or the previous don't start with a dash
        if (argv[i][0] == '-' || argv[i - 1][0] == '-')
        {
            continue;
        }
        else
        {
            return argv[i];
        }
    }

    return "";
}

std::string checkAudioFilePath(int argc, char *argv[])
{

    for (int i = 0; i < argc; i++)
    {
        if (argv[i] == std::string("-a"))
        {
            return argv[i + 1];
        }
    }
    return "";
}

bool checkSaveFrames(int argc, char *argv[])
{
    for (int i = 0; i < argc; i++)
    {
        if (argv[i] == std::string("-s"))
        {
            return true;
        }
    }
    return false;
}

int main(int argc, char *argv[])
{
    std::string parsedFragmentShaderPath = getFragmentShaderFilePath(argc, argv);
    std::string fragmentShaderPath = parsedFragmentShaderPath.length() > 0 ? parsedFragmentShaderPath : "shaders/fragment_diamondlattice.frag";

    cout << "Going to use fragment shader '" << fragmentShaderPath << "'" << endl;
    bool doSaveFrames = checkSaveFrames(argc, argv);

    if (doSaveFrames)
    {
        cout << "Going to save those frames friend!" << endl;
    }

    std::string doAudioFile = checkAudioFilePath(argc, argv);

    PJManager *pjManager = new PJManager(doSaveFrames);

    if (doAudioFile.length() > 0)
    {
        cout << "Going to match to an audio file!" << endl;
        PJAudioFile *audioFile = new PJAudioFile(doAudioFile.c_str());
        pjManager->run_length = audioFile->run_length_seconds;
        // return 0;
    }

    PJShader *pjShader = new PJShader();
    pjShader->addShader("shaders/simple.vert");
    // pjShader->addShader("shaders/simple.frag", true);
    // pjShader->addShader("shaders/fragment_ebbnflow.frag");
    // pjShader->addShader("shaders/fragment_diamondlattice.frag");
    // pjShader->addShader("shaders/blackout_tuesday.frag");
    // pjShader->addShader("shaders/chip_chomper.frag");
    pjShader->addShader(fragmentShaderPath.c_str());

    pjShader->bindShaders(pjManager->program);

    pjManager->initOpenGL();
    PJGeometry *flatGeo = new PJGeometry();
    pjManager->initGeometry();
    pjManager->initLoop(flatGeo);

    return 0;
}
