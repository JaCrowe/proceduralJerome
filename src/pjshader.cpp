#include "pjshader.h"
#include <string.h>
#include <GLES3/gl3.h>
#include <vector>
#include <regex>
using namespace std;
PJShader::PJShader(){}

void PJShader::addShader(const char *_file_path)
{
    shaderFile = new PJFile(_file_path);

    GLuint thisShader = glCreateShader(regex_match(_file_path, regex(".*\\.frag$")) ? GL_FRAGMENT_SHADER : GL_VERTEX_SHADER);
    const char *vertex_shader = shaderFile->fileContent.c_str();
    int length = strlen(vertex_shader);
    glShaderSource(thisShader, 1, (const GLchar **)&vertex_shader, &length);
    glCompileShader(thisShader);
    GLint status;
    glGetShaderiv(thisShader, GL_COMPILE_STATUS, &status);
    if (status == GL_FALSE)
    {
        fprintf(stderr, "shader compilation failed\n");
    }
    shaders.push_back(thisShader);
}

void PJShader::bindShaders(GLuint &program)
{
    for (auto &&localShader : shaders)
        glAttachShader(program, localShader);
}
