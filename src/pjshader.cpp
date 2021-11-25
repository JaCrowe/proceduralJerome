#include "pjshader.h"
#include <string.h>
#include <GLES3/gl3.h>
#include <vector>

PJShader::PJShader(const char *_file_path, bool is_fragment)
{
    shaderFile = new PJFile(_file_path);
    shader = glCreateShader(GL_VERTEX_SHADER);
    const char *vertex_shader = shaderFile->fileContent.c_str();
    int length = strlen(vertex_shader);
    glShaderSource(shader, 1, (const GLchar **)&vertex_shader, &length);
    glCompileShader(shader);
    GLint status;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &status);
    if (status == GL_FALSE)
    {
        fprintf(stderr, "shader compilation failed\n");
    }
}

void PJShader::addShader(const char *_file_path, bool is_fragment)
{
    shaderFile = new PJFile(_file_path);
    GLuint thisShader = glCreateShader(is_fragment ? GL_FRAGMENT_SHADER : GL_VERTEX_SHADER);
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
