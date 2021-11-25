#include "pjfile.h"
#include <string>
#include <iostream>
#include <fstream>
using namespace std;

unsigned long PJFile::getFileLength(ifstream &file)
{
    if (!file.good())
        return 0;
    unsigned long pos = file.tellg();
    file.seekg(0, ios::end);
    unsigned long len = file.tellg();
    file.seekg(ios::beg);
    return len;
}

std::string PJFile::getFileContents(ifstream &file)
{
    if (!file.good())
        return 0;
    string contents = "";
    string line;
    while (std::getline(file, line))
    {
        contents += line;
        contents += "\n";
    }
    unsigned long pos = file.tellg();
    file.seekg(0, ios::end);
    unsigned long len = file.tellg();
    file.seekg(ios::beg);
    return contents;
}

int PJFile::loadfile(const char *filename)
{
    ifstream file;
    file.open(filename, ios::in);
    if (!file)
        return -1;
    unsigned long len = getFileLength(file);
    fileContent = getFileContents(file);
    if (len == 0)
        return -2;
    file.close();
    return 0;
}

PJFile::PJFile(const char *_file_path)
{
    file_path = _file_path;
    loadfile(file_path);
}
