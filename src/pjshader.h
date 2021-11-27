#ifndef PJ_Shader
#define PJ_Shader
#include "./pjfile.h"
#include <GLES3/gl3.h>
#include <string>
#include <iostream>
#include <fstream>
#include <vector>

class PJShader
{
public:
    PJFile *shaderFile;
    std::vector<GLuint> shaders;
    GLuint shader;
    void addShader(const char *_file_path);
    void bindShaders(GLuint &program);
    PJShader();
    ~PJShader();
};
#endif
