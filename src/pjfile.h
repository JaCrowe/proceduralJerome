#ifndef PJ_File
#define PJ_File

#include <GLES3/gl3.h>
#include <string>
#include <iostream>
#include <fstream>
class PJFile
{
public:
    const char *file_path;
    int loadfile(const char *filename);
    unsigned long getFileLength(std::ifstream &file);
    std::string getFileContents(std::ifstream &file);
    std::string fileContent;
    PJFile(const char *_file_path);
};

#endif
