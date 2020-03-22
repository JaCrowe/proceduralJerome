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
    void addShader(const char *_file_path, bool is_fragment = false);
    void bindShaders(GLuint &program);
    PJShader(const char *_file_path, bool is_fragment = false);
    ~PJShader();
};
#endif
