#ifndef PJ_AudioFile
#define PJ_AudioFile

#include <string>
#include <fstream>
class PJAudioFile
{
public:
    const char *file_path;
    int loadfile(const char *filename);
    std::string getFileContents(std::ifstream &file);
    std::string fileContent;
    double run_length_seconds;
    PJAudioFile(const char *_file_path);
};

#endif
